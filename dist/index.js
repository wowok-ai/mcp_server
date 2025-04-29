import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport, } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListResourcesRequestSchema, ListResourceTemplatesRequestSchema, ListToolsRequestSchema, ReadResourceRequestSchema, ToolSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { query_objects, WOWOK, query_events, query_permission, query_table, call_guard, call_demand, call_machine, call_service, call_treasury, queryTableItem_ServiceSale, queryTableItem_DemandService, call_arbitration, call_permission, call_personal, call_transfer_permission, call_repository, queryTableItem_ArbVoting, queryTableItem_MachineNode, queryTableItem_MarkTag, queryTableItem_PermissionEntity, queryTableItem_ProgressHistory, queryTableItem_TreasuryHistory, queryTableItem_RepositoryData, query_personal, local_mark_operation, local_info_operation, account_operation, query_local_mark_list, query_local_info_list, query_account, query_account_list, query_local_mark, query_local_info, } from 'wowok_agent';
import { QueryObjectsSchema, QueryEventSchema, QueryPermissionSchema, QueryTableItemsSchema, QueryPersonalSchema, QueryByAddressNameSchema, QueryByIndexSchema, QueryByNameSchema, QueryByAddressSchema, } from './query.js';
import { CallArbitrationSchema, CallDemandSchema, CallGuardSchema, CallMachineSchema, CallObejctPermissionSchema, CallPermissionSchema, CallPersonalSchema, CallRepositorySchema, CallServiceSchema, CallTreasurySchema, } from "./call.js";
import { parseUrlParams } from "./util.js";
import { AccountOperationSchema, LocalInfoOperationSchema, LocalMarkFilterSchema, LocalMarkOperationSchema, QueryAccountSchema, QueryLocalInfoSchema, QueryLocalMarkSchema } from "./local.js";
const ToolInputSchema = ToolSchema.shape.inputSchema;
export var ToolName;
(function (ToolName) {
    ToolName["QUERY_OBJECTS"] = "objects";
    ToolName["QUERY_EVENTS"] = "events";
    ToolName["QUERY_PERMISSIONS"] = "permissions";
    ToolName["QUERY_TABLE_ITEMS"] = "table_items";
    //QUERY_TABLE_ITEM = 'table_item',
    ToolName["QUERY_PERSONAL"] = "presonal_information";
    ToolName["QUERY_ARB_VOTING"] = "arb_table_item";
    ToolName["QUERY_DEMAND_SERVICE"] = "demand_table_item";
    ToolName["QUERY_PERMISSION_ENTITY"] = "permission_table_item";
    ToolName["QUERY_MACHINE_NODE"] = "machine_table_item";
    ToolName["QUERY_SERVICE_SALE"] = "service_table_item";
    ToolName["QUERY_PROGRESS_HISTORY"] = "progress_table_item";
    ToolName["QUERY_TREASURY_HISTORY"] = "treasury_table_item";
    ToolName["QUERY_REPOSITORY_DATA"] = "repository_table_item";
    ToolName["QUERY_MARK_TAGS"] = "personalmark_table_item";
    ToolName["QUERY_LOCAL_MARK_LIST"] = "local_mark_list";
    ToolName["QUERY_LOCAL_MARK_FILTER"] = "local_mark_filter";
    ToolName["QUERY_LOCAL_INFO_LIST"] = "local_info_list";
    ToolName["QUERY_ACCOUNT_LIST"] = "account_list";
    ToolName["QUERY_LOCAL_MARK"] = "local_mark";
    ToolName["QUERY_LOCAL_INFO"] = "local_info";
    ToolName["QUERY_ACCOUNT"] = "account";
    ToolName["OP_PERSONAL"] = "personal_operations";
    ToolName["OP_MACHINE"] = "machine_operations";
    ToolName["OP_SERVICE"] = "service_operations";
    ToolName["OP_PERMISSION"] = "permission_operations";
    ToolName["OP_TREASURY"] = "treasury_operations";
    ToolName["OP_ARBITRATION"] = "arbitration_operations";
    ToolName["OP_REPOSITORY"] = "repository_operations";
    ToolName["OP_GUARD"] = "guard_operations";
    ToolName["OP_DEMAND"] = "demand_operations";
    ToolName["OP_REPLACE_PERMISSION_OBJECT"] = "replace_permission_object";
    ToolName["OP_ACCOUNT"] = "account_operations";
    ToolName["OP_LOCAL_MARK"] = "local_mark_operations";
    ToolName["OP_LOCAL_INFO"] = "local_info_operations";
})(ToolName || (ToolName = {}));
export var EventName;
(function (EventName) {
    EventName["new_arb"] = "new_arb_events";
    EventName["new_progress"] = "new_progress_events";
    EventName["new_order"] = "new_order_events";
    EventName["present_service"] = "present_service_events";
})(EventName || (EventName = {}));
WOWOK.Protocol.Instance().use_network(WOWOK.ENTRYPOINT.testnet);
// Create server instance
const server = new Server({
    name: "wowok",
    version: "1.0.0",
}, {
    capabilities: {
        prompts: {},
        resources: { subscribe: true },
        tools: {},
        logging: {},
    },
});
const RESOURCES = [
    {
        uri: 'wowok://account/list',
        name: ToolName.QUERY_ACCOUNT_LIST,
        description: "your accounts",
        mimeType: 'text/plain'
    },
    {
        uri: 'wowok://local_mark/list',
        name: ToolName.QUERY_LOCAL_MARK_LIST,
        description: "your local marks",
        mimeType: 'text/plain'
    },
    {
        uri: 'wowok://local_info/list',
        name: ToolName.QUERY_LOCAL_INFO_LIST,
        description: "your local info, such as 'Address of delivery', etc..",
        mimeType: 'text/plain'
    },
];
const RESOURCES_TEMPL = [
    {
        uriTemplate: 'wowok://objects/{?objects*, no_cache}',
        name: ToolName.QUERY_OBJECTS,
        description: "query wowok objects",
        mimeType: 'text/plain'
    },
    {
        uriTemplate: 'wowok://permissions/{?permission_object, address}',
        name: ToolName.QUERY_PERMISSIONS,
        description: "query permissions of an address from the wowok Permission object",
        mimeType: 'text/plain'
    },
    {
        uriTemplate: 'wowok://personal/{?address, no_cache}',
        name: ToolName.QUERY_PERSONAL,
        description: "query personal information for an address",
        mimeType: 'text/plain'
    },
    {
        uriTemplate: 'wowok://table_items/{?parent, cursor, limit}',
        name: ToolName.QUERY_TABLE_ITEMS,
        description: "query records of table data owned by the wowok object (Demand, Repository, Progress, Service, Treasury, Arb, Permission, Machine, PersonalMark)",
        mimeType: 'text/plain'
    },
    {
        uriTemplate: 'wowok://table_item/arb/{?object, address}',
        name: ToolName.QUERY_ARB_VOTING,
        description: "query voting information for an address in the Arb object.",
        mimeType: 'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/demand/{?object, address}',
        name: ToolName.QUERY_DEMAND_SERVICE,
        description: "query service recommendation information in the Demand object.",
        mimeType: 'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/machine/{?object, node}',
        name: ToolName.QUERY_MACHINE_NODE,
        description: "query node information in the Machine object.",
        mimeType: 'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/personalmark/{?object, address}',
        name: ToolName.QUERY_MARK_TAGS,
        description: "query name and tags for an address in the PersonalMark object",
        mimeType: 'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/permission/{?object, address}',
        name: ToolName.QUERY_PERMISSION_ENTITY,
        description: "query permissions for an address in the Permission object.",
        mimeType: 'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/repository/{?object, address, name}',
        name: ToolName.QUERY_REPOSITORY_DATA,
        description: "query data in the Repository object.",
        mimeType: 'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/progress/{?object, index}',
        name: ToolName.QUERY_PROGRESS_HISTORY,
        description: "query historical sessions data in the Progress object.",
        mimeType: 'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/treasury/{?object, index}',
        name: ToolName.QUERY_TREASURY_HISTORY,
        description: "query historical flows data in the Treasury object.",
        mimeType: 'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/service/{?object, name}',
        name: ToolName.QUERY_SERVICE_SALE,
        description: "query the current information of the item for sale in the Service object.",
        mimeType: 'text/plain',
    },
    {
        uriTemplate: 'wowok://events/onNewArb/{?cursor_eventSeq, cursor_txDigest, limit, order}',
        name: EventName.new_arb,
        description: "query 'onNewArb' events",
        mimeType: 'text/plain'
    },
    {
        uriTemplate: 'wowok://events/OnPresentService/{?cursor_eventSeq, cursor_txDigest, limit, order}',
        name: EventName.present_service,
        description: "query 'OnPresentService' events",
        mimeType: 'text/plain'
    },
    {
        uriTemplate: 'wowok://events/OnNewProgress/{?cursor_eventSeq, cursor_txDigest, limit, order}',
        name: EventName.new_progress,
        description: "query 'OnNewProgress' events",
        mimeType: 'text/plain'
    },
    {
        uriTemplate: 'wowok://events/OnNewOrder/{?cursor_eventSeq, cursor_txDigest, limit, order}',
        name: EventName.new_order,
        description: "query 'OnNewOrder' events",
        mimeType: 'text/plain'
    },
    {
        uriTemplate: 'wowok://account/{?name_or_address, balance_or_coin, token_type}',
        name: ToolName.QUERY_ACCOUNT,
        description: "query account information",
        mimeType: 'text/plain'
    },
    {
        uriTemplate: 'wowok://local_mark/{?name}',
        name: ToolName.QUERY_LOCAL_MARK,
        description: "query local mark",
        mimeType: 'text/plain'
    },
    {
        uriTemplate: 'wowok://local_info/{?name}',
        name: ToolName.QUERY_LOCAL_INFO,
        description: "query local info, such as 'Address of delivery', etc..",
        mimeType: 'text/plain'
    },
    {
        uriTemplate: 'wowok://local_mark/filter/{?name, tags*, object}',
        name: ToolName.QUERY_LOCAL_MARK_FILTER,
        description: "query local marks filter by name, tags and object address.",
        mimeType: 'text/plain'
    },
    /*{
        uriTemplate: 'wowok://table_item/{parent}{?key_type, key_value}',
        name: ToolName.QUERY_TABLE_ITEM,
        description: "query a record of table data owned by the wowok object",
        mimeType:'text/plain'
    },*/
];
const TOOLS = [
    {
        name: ToolName.QUERY_OBJECTS,
        description: "query wowok objects",
        inputSchema: zodToJsonSchema(QueryObjectsSchema),
    },
    {
        name: ToolName.QUERY_EVENTS,
        description: "query wowok events",
        inputSchema: zodToJsonSchema(QueryEventSchema),
    },
    {
        name: ToolName.QUERY_PERMISSIONS,
        description: "query permissions of an address from the wowok Permission object",
        inputSchema: zodToJsonSchema(QueryPermissionSchema),
    },
    {
        name: ToolName.QUERY_TABLE_ITEMS,
        description: "query records of table data owned by the wowok object",
        inputSchema: zodToJsonSchema(QueryTableItemsSchema),
    },
    /*{
        name: ToolName.QUERY_TABLE_ITEM,
        description: "query a record of table data owned by the wowok object",
        inputSchema: zodToJsonSchema(QueryTableItemSchema)  as ToolInput,
    },*/
    {
        name: ToolName.QUERY_PERSONAL,
        description: "query personal information for an address",
        inputSchema: zodToJsonSchema(QueryPersonalSchema),
    },
    {
        name: ToolName.QUERY_ARB_VOTING,
        description: "query voting information for an address in the Arb object.",
        inputSchema: zodToJsonSchema(QueryByAddressSchema),
    },
    {
        name: ToolName.QUERY_DEMAND_SERVICE,
        description: "query service recommendation information in the Demand object.",
        inputSchema: zodToJsonSchema(QueryByAddressSchema),
    },
    {
        name: ToolName.QUERY_MACHINE_NODE,
        description: "query node information in the Machine object.",
        inputSchema: zodToJsonSchema(QueryByNameSchema),
    },
    {
        name: ToolName.QUERY_MARK_TAGS,
        description: "query name and tags for an address in the PersonalMark object",
        inputSchema: zodToJsonSchema(QueryByAddressSchema),
    },
    {
        name: ToolName.QUERY_PERMISSION_ENTITY,
        description: "query permissions for an address in the Permission object.",
        inputSchema: zodToJsonSchema(QueryByAddressSchema),
    },
    {
        name: ToolName.QUERY_REPOSITORY_DATA,
        description: "query data in the Repository object.",
        inputSchema: zodToJsonSchema(QueryByAddressNameSchema),
    },
    {
        name: ToolName.QUERY_PROGRESS_HISTORY,
        description: "query historical sessions data in the Progress object.",
        inputSchema: zodToJsonSchema(QueryByIndexSchema),
    },
    {
        name: ToolName.QUERY_TREASURY_HISTORY,
        description: "query historical flows data in the Treasury object.",
        inputSchema: zodToJsonSchema(QueryByIndexSchema),
    },
    {
        name: ToolName.QUERY_SERVICE_SALE,
        description: "query the current information of the item for sale in the Service object.",
        inputSchema: zodToJsonSchema(QueryByNameSchema),
    },
    /*{
        name: ToolName.QUERY_LOCAL_MARK_LIST,
        description: "retrieve locally stored marks by the name, tags and object filters.",
        inputSchema: zodToJsonSchema(LocalMarkFilterSchema)  as ToolInput,
    },*/
    {
        name: ToolName.QUERY_LOCAL_INFO_LIST,
        description: "retrieve all locally stored personal infomation (e.g. address of delivery)",
        inputSchema: zodToJsonSchema(z.object({})),
    },
    {
        name: ToolName.QUERY_ACCOUNT_LIST,
        description: "retrieve all locally stored accounts",
        inputSchema: zodToJsonSchema(z.object({})),
    },
    {
        name: ToolName.QUERY_LOCAL_MARK,
        description: "retrieve locally stored marks by the name, tags and object filters.",
        inputSchema: zodToJsonSchema(QueryLocalMarkSchema),
    },
    {
        name: ToolName.QUERY_LOCAL_INFO,
        description: "retrieve the personal infomation by the name (e.g. 'address of delivery')",
        inputSchema: zodToJsonSchema(QueryLocalInfoSchema),
    },
    {
        name: ToolName.QUERY_ACCOUNT,
        description: "retrieve balance or coins of the token type by the name or address",
        inputSchema: zodToJsonSchema(QueryAccountSchema),
    },
    {
        name: ToolName.OP_PERSONAL,
        description: "operations on the wowok Personal object",
        inputSchema: zodToJsonSchema(CallPersonalSchema),
    },
    {
        name: ToolName.OP_PERMISSION,
        description: "operations on the wowok Permission object",
        inputSchema: zodToJsonSchema(CallPermissionSchema),
    },
    {
        name: ToolName.OP_REPOSITORY,
        description: "operations on the wowok Repository object",
        inputSchema: zodToJsonSchema(CallRepositorySchema),
    },
    {
        name: ToolName.OP_MACHINE,
        description: "operations on the wowok Machine object",
        inputSchema: zodToJsonSchema(CallMachineSchema),
    },
    {
        name: ToolName.OP_GUARD,
        description: "operations on the wowok Guard object",
        inputSchema: zodToJsonSchema(CallGuardSchema),
    },
    {
        name: ToolName.OP_SERVICE,
        description: "operations on the wowok Service object",
        inputSchema: zodToJsonSchema(CallServiceSchema),
    },
    {
        name: ToolName.OP_ARBITRATION,
        description: "operations on the wowok Arbitration object",
        inputSchema: zodToJsonSchema(CallArbitrationSchema),
    },
    {
        name: ToolName.OP_TREASURY,
        description: "operations on the wowok Treasury object",
        inputSchema: zodToJsonSchema(CallTreasurySchema),
    },
    {
        name: ToolName.OP_DEMAND,
        description: "operations on the wowok Demand object",
        inputSchema: zodToJsonSchema(CallDemandSchema),
    },
    {
        name: ToolName.OP_REPLACE_PERMISSION_OBJECT,
        inputSchema: zodToJsonSchema(CallObejctPermissionSchema),
        description: 'Batch modify the Permission object of wowok objects.' +
            'Transaction signers need to be the owner of the original Permission object in these wowok objects in order to succeed.'
    },
    {
        name: ToolName.OP_LOCAL_MARK,
        inputSchema: zodToJsonSchema(LocalMarkOperationSchema),
        description: 'Local mark operation, such as add or set local marks, remove local marks or remove all local marks.'
    },
    {
        name: ToolName.OP_LOCAL_INFO,
        inputSchema: zodToJsonSchema(LocalInfoOperationSchema),
        description: 'Local info operation, such as add local info or remove local info. '
    },
    {
        name: ToolName.OP_ACCOUNT,
        inputSchema: zodToJsonSchema(AccountOperationSchema),
        description: 'Account operation, such as generate a new account or transfer token from one account to another.'
    }
];
async function main() {
    const transport = new StdioServerTransport();
    server.setRequestHandler(ListResourcesRequestSchema, async () => {
        return { resources: RESOURCES };
    });
    server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => {
        return { resourceTemplates: RESOURCES_TEMPL };
    });
    server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
        const uri = request.params.uri;
        if (uri.startsWith("wowok://objects/")) {
            var query = parseUrlParams(uri);
            query.objects = query.objects.filter(v => WOWOK.IsValidAddress(v));
            const r = await query_objects(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v => v.name === ToolName.QUERY_OBJECTS), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.startsWith("wowok://permissions/")) {
            const query = parseUrlParams(uri);
            const r = await query_permission(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v => v.name === ToolName.QUERY_PERMISSIONS), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.startsWith("wowok://personal/")) {
            const query = parseUrlParams(uri);
            const r = await query_personal(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v => v.name === ToolName.QUERY_PERSONAL), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.startsWith("wowok://table_items/")) {
            const query = parseUrlParams(uri);
            const r = await query_table(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v => v.name === ToolName.QUERY_TABLE_ITEMS), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.startsWith("wowok://table_item/arb/")) {
            const query = parseUrlParams(uri);
            const r = await queryTableItem_ArbVoting(query);
            return { tools: [], content: [JSON.stringify(r)] };
        }
        else if (uri.startsWith("wowok://table_item/demand/")) {
            const query = parseUrlParams(uri);
            const r = await queryTableItem_DemandService(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v => v.name === ToolName.QUERY_DEMAND_SERVICE), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.startsWith("wowok://table_item/service/")) {
            const query = parseUrlParams(uri);
            const r = await queryTableItem_ServiceSale(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v => v.name === ToolName.QUERY_SERVICE_SALE), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.startsWith("wowok://table_item/machine/")) {
            const query = parseUrlParams(uri);
            const r = await queryTableItem_MachineNode(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v => v.name === ToolName.QUERY_MACHINE_NODE), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.startsWith("wowok://table_item/repository/")) {
            const query = parseUrlParams(uri);
            const r = await queryTableItem_RepositoryData(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v => v.name === ToolName.QUERY_REPOSITORY_DATA), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.startsWith("wowok://table_item/permission/")) {
            const query = parseUrlParams(uri);
            const r = await queryTableItem_PermissionEntity(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v => v.name === ToolName.QUERY_PERMISSION_ENTITY), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.startsWith("wowok://table_item/personalmark/")) {
            const query = parseUrlParams(uri);
            const r = await queryTableItem_MarkTag(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v => v.name === ToolName.QUERY_MARK_TAGS), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.startsWith("wowok://table_item/treasury/")) {
            const query = parseUrlParams(uri);
            const r = await queryTableItem_TreasuryHistory(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v => v.name === ToolName.QUERY_TREASURY_HISTORY), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.startsWith("wowok://table_item/progress/")) {
            const query = parseUrlParams(uri);
            const r = await queryTableItem_ProgressHistory(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v => v.name === ToolName.QUERY_PROGRESS_HISTORY), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.toLocaleLowerCase().startsWith("wowok://events/onnewarb/")) {
            const query = parseUrlParams(uri);
            const r = await query_events({ type: 'OnNewArb',
                cursor: query.cursor_eventSeq && query.cursor_txDigest ? { eventSeq: query.cursor_eventSeq, txDigest: query.cursor_txDigest } : undefined,
                limit: query.limit, order: query.order === 'descending' || query.order === 'desc' ? 'descending' : 'ascending' });
            const content = Object.assign(RESOURCES_TEMPL.find(v => v.name === EventName.new_arb), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.toLocaleLowerCase().startsWith("wowok://events/onpresentservice/")) {
            const query = parseUrlParams(uri);
            const r = await query_events({ type: 'OnPresentService',
                cursor: query.cursor_eventSeq && query.cursor_txDigest ? { eventSeq: query.cursor_eventSeq, txDigest: query.cursor_txDigest } : undefined,
                limit: query.limit, order: query.order === 'descending' || query.order === 'desc' ? 'descending' : 'ascending' });
            const content = Object.assign(RESOURCES_TEMPL.find(v => v.name === EventName.present_service), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.toLocaleLowerCase().startsWith("wowok://events/onnewprogress/")) {
            const query = parseUrlParams(uri);
            const r = await query_events({ type: 'OnNewProgress',
                cursor: query.cursor_eventSeq && query.cursor_txDigest ? { eventSeq: query.cursor_eventSeq, txDigest: query.cursor_txDigest } : undefined,
                limit: query.limit, order: query.order === 'descending' || query.order === 'desc' ? 'descending' : 'ascending' });
            const content = Object.assign(RESOURCES_TEMPL.find(v => v.name === EventName.new_progress), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.toLocaleLowerCase().startsWith("wowok://events/onneworder/")) {
            const query = parseUrlParams(uri);
            const r = await query_events({ type: 'OnNewOrder',
                cursor: query.cursor_eventSeq && query.cursor_txDigest ? { eventSeq: query.cursor_eventSeq, txDigest: query.cursor_txDigest } : undefined,
                limit: query.limit, order: query.order === 'descending' || query.order === 'desc' ? 'descending' : 'ascending' });
            const content = Object.assign(RESOURCES_TEMPL.find(v => v.name === EventName.new_order), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.toLocaleLowerCase().startsWith("wowok://local_mark/list")) {
            return { tools: [], contents: [{ uri: uri, text: JSON.stringify(await query_local_mark_list()) }] };
        }
        else if (uri.toLocaleLowerCase().startsWith("wowok://local_info/list")) {
            return { tools: [], contents: [{ uri: uri, text: JSON.stringify(await query_local_info_list()) }] };
        }
        else if (uri.toLocaleLowerCase().startsWith("wowok://account/list")) {
            return { tools: [], contents: [{ uri: uri, text: JSON.stringify(await query_account_list()) }] };
        }
        else if (uri.toLocaleLowerCase().startsWith('wowok://local_mark/filter/')) {
            const query = parseUrlParams(uri);
            server.sendLoggingMessage({ level: 'info', message: JSON.stringify(query) });
            const r = await query_local_mark_list(query);
            return { tools: [], contents: [{ uri: uri, text: JSON.stringify(r) }] };
        }
        else if (uri.toLocaleLowerCase().startsWith("wowok://local_mark/")) {
            const query = parseUrlParams(uri);
            const r = await query_local_mark(query.name);
            const content = Object.assign(RESOURCES_TEMPL.find(v => v.name === ToolName.QUERY_LOCAL_MARK), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.toLocaleLowerCase().startsWith("wowok://local_info/")) {
            const query = parseUrlParams(uri);
            const r = await query_local_info(query.name);
            const content = Object.assign(RESOURCES_TEMPL.find(v => v.name === ToolName.QUERY_LOCAL_INFO), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.toLocaleLowerCase().startsWith("wowok://account/")) {
            const query = parseUrlParams(uri);
            const r = await query_account(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v => v.name === ToolName.QUERY_ACCOUNT), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        throw new Error(`Unknown resource: ${uri}`);
    });
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return { tools: TOOLS };
    });
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        try {
            if (!request.params.arguments) {
                throw new Error("Arguments are required");
            }
            switch (request.params.name) {
                case ToolName.QUERY_OBJECTS: {
                    const args = QueryObjectsSchema.parse(request.params.arguments);
                    const r = await query_objects(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.QUERY_EVENTS: {
                    const args = QueryEventSchema.parse(request.params.arguments);
                    const r = await query_events(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.QUERY_PERMISSIONS: {
                    const args = QueryPermissionSchema.parse(request.params.arguments);
                    const r = await query_permission(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.QUERY_PERSONAL: {
                    const args = QueryPersonalSchema.parse(request.params.arguments);
                    const r = await query_personal(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.QUERY_TABLE_ITEMS: {
                    const args = QueryTableItemsSchema.parse(request.params.arguments);
                    const r = await query_table(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                /*case ToolName.QUERY_TABLE_ITEM: {
                    const args = QueryTableItemSchema.parse(request.params.arguments);
                    const r = await query_table(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }*/
                case ToolName.QUERY_ARB_VOTING: {
                    const args = QueryByAddressSchema.parse(request.params.arguments);
                    const r = await queryTableItem_ArbVoting(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.QUERY_MACHINE_NODE: {
                    const args = QueryByNameSchema.parse(request.params.arguments);
                    const r = await queryTableItem_MachineNode(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.QUERY_MARK_TAGS: {
                    const args = QueryByAddressSchema.parse(request.params.arguments);
                    const r = await queryTableItem_MarkTag(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.QUERY_PERMISSION_ENTITY: {
                    const args = QueryByAddressSchema.parse(request.params.arguments);
                    const r = await queryTableItem_PermissionEntity(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.QUERY_PROGRESS_HISTORY: {
                    const args = QueryByIndexSchema.parse(request.params.arguments);
                    const r = await queryTableItem_ProgressHistory(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.QUERY_TREASURY_HISTORY: {
                    const args = QueryByIndexSchema.parse(request.params.arguments);
                    const r = await queryTableItem_TreasuryHistory(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.QUERY_REPOSITORY_DATA: {
                    const args = QueryByAddressNameSchema.parse(request.params.arguments);
                    const r = await queryTableItem_RepositoryData(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.QUERY_SERVICE_SALE: {
                    const args = QueryByNameSchema.parse(request.params.arguments);
                    const r = await queryTableItem_ServiceSale(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.QUERY_DEMAND_SERVICE: {
                    const args = QueryByAddressSchema.parse(request.params.arguments);
                    const r = await queryTableItem_DemandService(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.QUERY_LOCAL_MARK_LIST: {
                    const args = LocalMarkFilterSchema.parse(request.params.arguments);
                    const r = await query_local_mark_list(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.QUERY_LOCAL_INFO_LIST: {
                    const r = await query_local_info_list();
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.QUERY_ACCOUNT_LIST: {
                    const r = await query_account_list();
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.QUERY_LOCAL_MARK: {
                    const args = QueryLocalMarkSchema.parse(request.params.arguments);
                    const r = await query_local_mark(args.name);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.QUERY_LOCAL_INFO: {
                    const args = QueryLocalInfoSchema.parse(request.params.arguments);
                    const r = await query_local_info(args.name);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.QUERY_ACCOUNT: {
                    const args = QueryAccountSchema.parse(request.params.arguments);
                    const r = await query_account(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.OP_GUARD: {
                    const args = CallGuardSchema.parse(request.params.arguments);
                    const r = await call_guard(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.OP_DEMAND: {
                    const args = CallDemandSchema.parse(request.params.arguments);
                    const r = await call_demand(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.OP_MACHINE: {
                    const args = CallMachineSchema.parse(request.params.arguments);
                    const r = await call_machine(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.OP_SERVICE: {
                    const args = CallServiceSchema.parse(request.params.arguments);
                    const r = await call_service(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.OP_TREASURY: {
                    const args = CallTreasurySchema.parse(request.params.arguments);
                    const r = await call_treasury(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.OP_ARBITRATION: {
                    const args = CallArbitrationSchema.parse(request.params.arguments);
                    const r = await call_arbitration(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.OP_PERMISSION: {
                    const args = CallPermissionSchema.parse(request.params.arguments);
                    const r = await call_permission(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.OP_PERSONAL: {
                    const args = CallPersonalSchema.parse(request.params.arguments);
                    const r = await call_personal(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.OP_REPLACE_PERMISSION_OBJECT: {
                    const args = CallObejctPermissionSchema.parse(request.params.arguments);
                    const r = await call_transfer_permission(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.OP_REPOSITORY: {
                    const args = CallRepositorySchema.parse(request.params.arguments);
                    const r = await call_repository(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.OP_LOCAL_MARK: {
                    const args = LocalMarkOperationSchema.parse(request.params.arguments);
                    await local_mark_operation(args);
                    return {
                        content: [{ type: "text", text: 'success' }],
                    };
                }
                case ToolName.OP_LOCAL_INFO: {
                    const args = LocalInfoOperationSchema.parse(request.params.arguments);
                    await local_info_operation(args);
                    return {
                        content: [{ type: "text", text: 'success' }],
                    };
                }
                case ToolName.OP_ACCOUNT: {
                    const args = AccountOperationSchema.parse(request.params.arguments);
                    const r = await account_operation(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                default:
                    throw new Error(`Unknown tool: ${request.params.name}`);
            }
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                throw new Error(`Invalid input: ${JSON.stringify(error.errors)}`);
            }
            throw error;
        }
        return { content: [] };
    });
    await server.connect(transport);
    // Cleanup on exit
    process.on("SIGINT", async () => {
        await cleanup();
        await server.close();
        process.exit(0);
    });
}
async function cleanup() {
}
main().catch((error) => {
    process.exit(1);
});
process.stdin.on("close", async () => {
    await cleanup();
    await server.close();
    process.exit(0);
});
