import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport, } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListResourcesRequestSchema, ListResourceTemplatesRequestSchema, ListToolsRequestSchema, ReadResourceRequestSchema, ToolSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { query_objects, WOWOK, query_events, query_permission, query_table, call_guard, call_demand, call_machine, call_service, call_treasury, queryTableItem_ServiceSale, queryTableItem_DemandService, call_arbitration, call_permission, call_personal, call_transfer_permission, call_repository, queryTableItem_ArbVoting, queryTableItem_MachineNode, queryTableItem_MarkTag, queryTableItem_PermissionEntity, queryTableItem_ProgressHistory, queryTableItem_TreasuryHistory, queryTableItem_RepositoryData, query_personal, local_mark_operation, local_info_operation, account_operation, query_local_mark_list, query_local_info_list, query_account, query_account_list, query_local_mark, query_local_info, } from 'wowok_agent';
import { QueryObjectsSchema, QueryEventSchema, QueryPermissionSchema, QueryTableItemsSchema, QueryPersonalSchema, QueryByAddressNameSchema, QueryByIndexSchema, QueryByNameSchema, QueryByAddressSchema, QueryObjectsSchemaDescription, QueryPermissionSchemaDescription, QueryPersonalSchemaDescription, QueryEventSchemaDescription, QueryTableItemsSchemaDescription, } from './query.js';
import { CallArbitrationSchema, CallArbitrationSchemaDescription, CallDemandSchema, CallDemandSchemaDescription, CallGuardSchema, CallGuardSchemaDescription, CallMachineSchema, CallMachineSchemaDescription, CallObejctPermissionSchema, CallObejctPermissionSchemaDescription, CallPermissionSchema, CallPermissionSchemaDescription, CallPersonalSchema, CallPersonalSchemaDescription, CallRepositorySchema, CallRepositorySchemaDescription, CallServiceSchema, CallServiceSchemaDescription, CallTreasurySchema, CallTreasurySchemaDescription, } from "./call.js";
import { parseUrlParams } from "./util.js";
import { AccountListSchemaDescription, AccountListSchema, AccountOperationSchema, LocalInfoListSchema, LocalInfoListSchemaDescription, LocalInfoOperationSchema, LocalMarkFilterSchema, LocalMarkFilterSchemaDescription, LocalMarkListSchemaDescription, LocalMarkOperationSchema, QueryAccountSchema, QueryAccountSchemaDescription, QueryLocalInfoSchema, QueryLocalInfoSchemaDescription, QueryLocalMarkSchema, QueryLocalMarkSchemaDescription, AccountOperationSchemaDescription, LocalInfoOperationSchemaDescription, LocalMarkOperationSchemaDescription } from "./local.js";
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
    ToolName["QUERY_ACCOUNT_LIST"] = "local_account_list";
    ToolName["QUERY_LOCAL_MARK"] = "local_mark";
    ToolName["QUERY_LOCAL_INFO"] = "local_info";
    ToolName["QUERY_ACCOUNT"] = "local_account";
    ToolName["OP_PERSONAL"] = "onchain_personal_operations";
    ToolName["OP_MACHINE"] = "onchain_machine_operations";
    ToolName["OP_SERVICE"] = "onchain_service_operations";
    ToolName["OP_PERMISSION"] = "onchain_permission_operations";
    ToolName["OP_TREASURY"] = "onchain_treasury_operations";
    ToolName["OP_ARBITRATION"] = "onchain_arbitration_operations";
    ToolName["OP_REPOSITORY"] = "onchain_repository_operations";
    ToolName["OP_GUARD"] = "onchain_guard_operations";
    ToolName["OP_DEMAND"] = "onchain_demand_operations";
    ToolName["OP_REPLACE_PERMISSION_OBJECT"] = "onchain_replace_permission_object";
    ToolName["OP_ACCOUNT"] = "local_account_operations";
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
    version: "1.1.12",
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
        description: AccountListSchemaDescription,
        mimeType: 'text/plain'
    },
    {
        uri: 'wowok://local_mark/list',
        name: ToolName.QUERY_LOCAL_MARK_LIST,
        description: LocalMarkListSchemaDescription,
        mimeType: 'text/plain'
    },
    {
        uri: 'wowok://local_info/list',
        name: ToolName.QUERY_LOCAL_INFO_LIST,
        description: LocalInfoListSchemaDescription,
        mimeType: 'text/plain'
    },
];
const RESOURCES_TEMPL = [
    {
        uriTemplate: 'wowok://objects/{?objects*, no_cache}',
        name: ToolName.QUERY_OBJECTS,
        description: QueryObjectsSchemaDescription,
        mimeType: 'text/plain'
    },
    {
        uriTemplate: 'wowok://permissions/{?permission_object, address}',
        name: ToolName.QUERY_PERMISSIONS,
        description: QueryPermissionSchemaDescription,
        mimeType: 'text/plain'
    },
    {
        uriTemplate: 'wowok://personal/{?address, no_cache}',
        name: ToolName.QUERY_PERSONAL,
        description: QueryPersonalSchemaDescription,
        mimeType: 'text/plain'
    },
    {
        uriTemplate: 'wowok://table_items/{?parent, cursor, limit}',
        name: ToolName.QUERY_TABLE_ITEMS,
        description: "Query records of table data owned by the on-chain wowok object (Demand, Repository, Progress, Service, Treasury, Arb, Permission, Machine, PersonalMark)",
        mimeType: 'text/plain'
    },
    {
        uriTemplate: 'wowok://table_item/arb/{?object, address}',
        name: ToolName.QUERY_ARB_VOTING,
        description: "Query voting information for an address in the on-chain Arb object.",
        mimeType: 'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/demand/{?object, address}',
        name: ToolName.QUERY_DEMAND_SERVICE,
        description: "Query service recommendation information in the on-chain Demand object.",
        mimeType: 'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/machine/{?object, node}',
        name: ToolName.QUERY_MACHINE_NODE,
        description: "Query node information in the on-chain Machine object.",
        mimeType: 'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/personalmark/{?object, address}',
        name: ToolName.QUERY_MARK_TAGS,
        description: "Query name and tags for an address in the on-chain PersonalMark object",
        mimeType: 'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/permission/{?object, address}',
        name: ToolName.QUERY_PERMISSION_ENTITY,
        description: "Query permissions for an address in the on-chain Permission object.",
        mimeType: 'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/repository/{?object, address, name}',
        name: ToolName.QUERY_REPOSITORY_DATA,
        description: "Query data in the on-chain Repository object.",
        mimeType: 'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/progress/{?object, index}',
        name: ToolName.QUERY_PROGRESS_HISTORY,
        description: "Query historical sessions data in the on-chain Progress object.",
        mimeType: 'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/treasury/{?object, index}',
        name: ToolName.QUERY_TREASURY_HISTORY,
        description: "Query historical flows data in the on-chain Treasury object.",
        mimeType: 'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/service/{?object, name}',
        name: ToolName.QUERY_SERVICE_SALE,
        description: "Query the current information of the item for sale in the on-chain Service object.",
        mimeType: 'text/plain',
    },
    {
        uriTemplate: 'wowok://events/onNewArb/{?cursor_eventSeq, cursor_txDigest, limit, order}',
        name: EventName.new_arb,
        description: "Query the on-chain 'onNewArb' events",
        mimeType: 'text/plain'
    },
    {
        uriTemplate: 'wowok://events/OnPresentService/{?cursor_eventSeq, cursor_txDigest, limit, order}',
        name: EventName.present_service,
        description: "Query the on-chain 'OnPresentService' events",
        mimeType: 'text/plain'
    },
    {
        uriTemplate: 'wowok://events/OnNewProgress/{?cursor_eventSeq, cursor_txDigest, limit, order}',
        name: EventName.new_progress,
        description: "Query the on-chain 'OnNewProgress' events",
        mimeType: 'text/plain'
    },
    {
        uriTemplate: 'wowok://events/OnNewOrder/{?cursor_eventSeq, cursor_txDigest, limit, order}',
        name: EventName.new_order,
        description: "Query the on-chain 'OnNewOrder' events",
        mimeType: 'text/plain'
    },
    {
        uriTemplate: 'wowok://account/{?name_or_address, balance_or_coin, token_type}',
        name: ToolName.QUERY_ACCOUNT,
        description: QueryAccountSchemaDescription,
        mimeType: 'text/plain'
    },
    {
        uriTemplate: 'wowok://local_mark/{?name}',
        name: ToolName.QUERY_LOCAL_MARK,
        description: QueryLocalMarkSchemaDescription,
        mimeType: 'text/plain'
    },
    {
        uriTemplate: 'wowok://local_info/{?name}',
        name: ToolName.QUERY_LOCAL_INFO,
        description: QueryLocalInfoSchemaDescription,
        mimeType: 'text/plain'
    },
    {
        uriTemplate: 'wowok://local_mark/filter/{?name, tags*, object}',
        name: ToolName.QUERY_LOCAL_MARK_FILTER,
        description: LocalMarkFilterSchemaDescription,
        mimeType: 'text/plain'
    },
    /*{
        uriTemplate: 'wowok://table_item/{parent}{?key_type, key_value}',
        name: ToolName.QUERY_TABLE_ITEM,
        description: "Query a record of table data owned by the wowok object",
        mimeType:'text/plain'
    },*/
];
const TOOLS = [
    {
        name: ToolName.QUERY_OBJECTS,
        description: QueryObjectsSchemaDescription,
        inputSchema: zodToJsonSchema(QueryObjectsSchema),
    },
    {
        name: ToolName.QUERY_EVENTS,
        description: QueryEventSchemaDescription,
        inputSchema: zodToJsonSchema(QueryEventSchema),
    },
    {
        name: ToolName.QUERY_PERMISSIONS,
        description: QueryPermissionSchemaDescription,
        inputSchema: zodToJsonSchema(QueryPermissionSchema),
    },
    {
        name: ToolName.QUERY_TABLE_ITEMS,
        description: QueryTableItemsSchemaDescription,
        inputSchema: zodToJsonSchema(QueryTableItemsSchema),
    },
    /*{
        name: ToolName.QUERY_TABLE_ITEM,
        description: "Query a record of table data owned by the wowok object",
        inputSchema: zodToJsonSchema(QueryTableItemSchema)  as ToolInput,
    },*/
    {
        name: ToolName.QUERY_PERSONAL,
        description: QueryPermissionSchemaDescription,
        inputSchema: zodToJsonSchema(QueryPersonalSchema),
    },
    {
        name: ToolName.QUERY_ARB_VOTING,
        description: "Query voting information for an address in the on-chain Arb object.",
        inputSchema: zodToJsonSchema(QueryByAddressSchema),
    },
    {
        name: ToolName.QUERY_DEMAND_SERVICE,
        description: "Query service recommendation information in the on-chain Demand object.",
        inputSchema: zodToJsonSchema(QueryByAddressSchema),
    },
    {
        name: ToolName.QUERY_MACHINE_NODE,
        description: "Query node information in the on-chain Machine object.",
        inputSchema: zodToJsonSchema(QueryByNameSchema),
    },
    {
        name: ToolName.QUERY_MARK_TAGS,
        description: "Query name and tags for an address in the on-chain PersonalMark object",
        inputSchema: zodToJsonSchema(QueryByAddressSchema),
    },
    {
        name: ToolName.QUERY_PERMISSION_ENTITY,
        description: "Query permissions for an address in the on-chain Permission object.",
        inputSchema: zodToJsonSchema(QueryByAddressSchema),
    },
    {
        name: ToolName.QUERY_REPOSITORY_DATA,
        description: "Query data in the on-chain Repository object.",
        inputSchema: zodToJsonSchema(QueryByAddressNameSchema),
    },
    {
        name: ToolName.QUERY_PROGRESS_HISTORY,
        description: "Query historical sessions data in the on-chain Progress object.",
        inputSchema: zodToJsonSchema(QueryByIndexSchema),
    },
    {
        name: ToolName.QUERY_TREASURY_HISTORY,
        description: "Query historical flows data in the on-chain Treasury object.",
        inputSchema: zodToJsonSchema(QueryByIndexSchema),
    },
    {
        name: ToolName.QUERY_SERVICE_SALE,
        description: "Query the current information of the item for sale in the on-chain Service object.",
        inputSchema: zodToJsonSchema(QueryByNameSchema),
    },
    {
        name: ToolName.QUERY_LOCAL_MARK_LIST,
        description: LocalMarkFilterSchemaDescription,
        inputSchema: zodToJsonSchema(LocalMarkFilterSchema),
    },
    {
        name: ToolName.QUERY_LOCAL_INFO_LIST,
        description: LocalInfoListSchemaDescription,
        inputSchema: zodToJsonSchema(LocalInfoListSchema),
    },
    {
        name: ToolName.QUERY_ACCOUNT_LIST,
        description: AccountListSchemaDescription,
        inputSchema: zodToJsonSchema(AccountListSchema),
    },
    {
        name: ToolName.QUERY_LOCAL_MARK,
        description: QueryLocalMarkSchemaDescription,
        inputSchema: zodToJsonSchema(QueryLocalMarkSchema),
    },
    {
        name: ToolName.QUERY_LOCAL_INFO,
        description: QueryLocalInfoSchemaDescription,
        inputSchema: zodToJsonSchema(QueryLocalInfoSchema),
    },
    {
        name: ToolName.QUERY_ACCOUNT,
        description: QueryAccountSchemaDescription,
        inputSchema: zodToJsonSchema(QueryAccountSchema),
    },
    {
        name: ToolName.OP_PERSONAL,
        description: CallPersonalSchemaDescription,
        inputSchema: zodToJsonSchema(CallPersonalSchema),
    },
    {
        name: ToolName.OP_PERMISSION,
        description: CallPermissionSchemaDescription,
        inputSchema: zodToJsonSchema(CallPermissionSchema),
    },
    {
        name: ToolName.OP_REPOSITORY,
        description: CallRepositorySchemaDescription,
        inputSchema: zodToJsonSchema(CallRepositorySchema),
    },
    {
        name: ToolName.OP_MACHINE,
        description: CallMachineSchemaDescription,
        inputSchema: zodToJsonSchema(CallMachineSchema),
    },
    {
        name: ToolName.OP_GUARD,
        description: CallGuardSchemaDescription,
        inputSchema: zodToJsonSchema(CallGuardSchema),
    },
    {
        name: ToolName.OP_SERVICE,
        description: CallServiceSchemaDescription,
        inputSchema: zodToJsonSchema(CallServiceSchema),
    },
    {
        name: ToolName.OP_ARBITRATION,
        description: CallArbitrationSchemaDescription,
        inputSchema: zodToJsonSchema(CallArbitrationSchema),
    },
    {
        name: ToolName.OP_TREASURY,
        description: CallTreasurySchemaDescription,
        inputSchema: zodToJsonSchema(CallTreasurySchema),
    },
    {
        name: ToolName.OP_DEMAND,
        description: CallDemandSchemaDescription,
        inputSchema: zodToJsonSchema(CallDemandSchema),
    },
    {
        name: ToolName.OP_REPLACE_PERMISSION_OBJECT,
        inputSchema: zodToJsonSchema(CallObejctPermissionSchema),
        description: CallObejctPermissionSchemaDescription,
    },
    {
        name: ToolName.OP_LOCAL_MARK,
        inputSchema: zodToJsonSchema(LocalMarkOperationSchema),
        description: LocalMarkOperationSchemaDescription,
    },
    {
        name: ToolName.OP_LOCAL_INFO,
        inputSchema: zodToJsonSchema(LocalInfoOperationSchema),
        description: LocalInfoOperationSchemaDescription,
    },
    {
        name: ToolName.OP_ACCOUNT,
        inputSchema: zodToJsonSchema(AccountOperationSchema),
        description: AccountOperationSchemaDescription,
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
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.QUERY_EVENTS: {
                    const args = QueryEventSchema.parse(request.params.arguments);
                    const r = await query_events(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.QUERY_PERMISSIONS: {
                    const args = QueryPermissionSchema.parse(request.params.arguments);
                    const r = await query_permission(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.QUERY_PERSONAL: {
                    const args = QueryPersonalSchema.parse(request.params.arguments);
                    const r = await query_personal(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.QUERY_TABLE_ITEMS: {
                    const args = QueryTableItemsSchema.parse(request.params.arguments);
                    const r = await query_table(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                /*case ToolName.QUERY_TABLE_ITEM: {
                    const args = QueryTableItemSchema.parse(request.params.arguments);
                    const r = await query_table(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }*/
                case ToolName.QUERY_ARB_VOTING: {
                    const args = QueryByAddressSchema.parse(request.params.arguments);
                    const r = await queryTableItem_ArbVoting(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.QUERY_MACHINE_NODE: {
                    const args = QueryByNameSchema.parse(request.params.arguments);
                    const r = await queryTableItem_MachineNode(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.QUERY_MARK_TAGS: {
                    const args = QueryByAddressSchema.parse(request.params.arguments);
                    const r = await queryTableItem_MarkTag(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.QUERY_PERMISSION_ENTITY: {
                    const args = QueryByAddressSchema.parse(request.params.arguments);
                    const r = await queryTableItem_PermissionEntity(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.QUERY_PROGRESS_HISTORY: {
                    const args = QueryByIndexSchema.parse(request.params.arguments);
                    const r = await queryTableItem_ProgressHistory(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.QUERY_TREASURY_HISTORY: {
                    const args = QueryByIndexSchema.parse(request.params.arguments);
                    const r = await queryTableItem_TreasuryHistory(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.QUERY_REPOSITORY_DATA: {
                    const args = QueryByAddressNameSchema.parse(request.params.arguments);
                    const r = await queryTableItem_RepositoryData(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.QUERY_SERVICE_SALE: {
                    const args = QueryByNameSchema.parse(request.params.arguments);
                    const r = await queryTableItem_ServiceSale(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.QUERY_DEMAND_SERVICE: {
                    const args = QueryByAddressSchema.parse(request.params.arguments);
                    const r = await queryTableItem_DemandService(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
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
                    const args = AccountListSchema.parse(request.params.arguments);
                    const r = await query_account_list(args?.showSuspendedAccount);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.QUERY_LOCAL_MARK: {
                    const args = QueryLocalMarkSchema.parse(request.params.arguments);
                    const r = await query_local_mark(args.name);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.QUERY_LOCAL_INFO: {
                    const args = QueryLocalInfoSchema.parse(request.params.arguments);
                    const r = await query_local_info(args.name);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.QUERY_ACCOUNT: {
                    const args = QueryAccountSchema.parse(request.params.arguments);
                    const r = await query_account(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.OP_GUARD: {
                    const args = CallGuardSchema.parse(request.params.arguments);
                    const r = await call_guard(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.OP_DEMAND: {
                    const args = CallDemandSchema.parse(request.params.arguments);
                    const r = await call_demand(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.OP_MACHINE: {
                    const args = CallMachineSchema.parse(request.params.arguments);
                    const r = await call_machine(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.OP_SERVICE: {
                    const args = CallServiceSchema.parse(request.params.arguments);
                    const r = await call_service(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.OP_TREASURY: {
                    const args = CallTreasurySchema.parse(request.params.arguments);
                    const r = await call_treasury(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.OP_ARBITRATION: {
                    const args = CallArbitrationSchema.parse(request.params.arguments);
                    const r = await call_arbitration(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.OP_PERMISSION: {
                    const args = CallPermissionSchema.parse(request.params.arguments);
                    server.sendLoggingMessage({ level: 'info', message: JSON.stringify(args) });
                    const r = await call_permission(args);
                    server.sendLoggingMessage({ level: 'info', message: JSON.stringify(r) });
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.OP_PERSONAL: {
                    const args = CallPersonalSchema.parse(request.params.arguments);
                    const r = await call_personal(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.OP_REPLACE_PERMISSION_OBJECT: {
                    const args = CallObejctPermissionSchema.parse(request.params.arguments);
                    const r = await call_transfer_permission(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
                    };
                }
                case ToolName.OP_REPOSITORY: {
                    const args = CallRepositorySchema.parse(request.params.arguments);
                    const r = await call_repository(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r) }],
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
                        content: [{ type: "text", text: JSON.stringify(r) }],
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
