import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport, } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListResourceTemplatesRequestSchema, ListToolsRequestSchema, ReadResourceRequestSchema, ToolSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { query_objects, WOWOK, query_events, query_permission, query_table, call_guard, call_demand, call_machine, call_service, call_treasury, queryTableItem_ServiceSale, queryTableItem_DemandService, call_arbitration, call_permission, call_personal, call_transfer_permission, call_repository, queryTableItem_ArbVoting, queryTableItem_MachineNode, queryTableItem_MarkTag, queryTableItem_PermissionEntity, queryTableItem_ProgressHistory, queryTableItem_TreasuryHistory, queryTableItem_RepositoryData, queryTableItem_Personal, } from 'wowok_agent';
import { QueryObjectsSchema, QueryEventSchema, QueryPermissionSchema, QueryTableItemsSchema, QueryPersonalSchema, QueryArbVotingSchema, QueryDemandServiceSchema, QueryMachineNodeSchema, QueryMarkTagSchema, QueryPermissionEntitySchema, QueryProgressHistorySchema, QueryTreasuryHistorySchema, QueryServiceSaleSchema, QueryRepositoryDataSchema, } from './query.js';
import { CallArbitrationSchema, CallDemandSchema, CallGuardSchema, CallMachineSchema, CallObejctPermissionSchema, CallPermissionSchema, CallPersonalSchema, CallRepositorySchema, CallServiceSchema, CallTreasurySchema, } from "./call.js";
import { parseUrlParams } from "./util.js";
const ToolInputSchema = ToolSchema.shape.inputSchema;
export var ToolName;
(function (ToolName) {
    ToolName["QUERY_OBJECTS"] = "objects";
    ToolName["QUERY_EVENTS"] = "events";
    ToolName["QUERY_PERMISSIONS"] = "permissions";
    ToolName["QUERY_TABLE_ITEMS"] = "table_items";
    //QUERY_TABLE_ITEM = 'table_item',
    ToolName["QUERY_PERSONAL"] = "presonal_infomation";
    ToolName["QUERY_ARB_VOTING"] = "arb_table_item";
    ToolName["QUERY_DEMAND_SERVICE"] = "demand_table_item";
    ToolName["QUERY_PERMISSION_ENTITY"] = "permission_table_item";
    ToolName["QUERY_MACHINE_NODE"] = "machine_table_item";
    ToolName["QUERY_SERVICE_SALE"] = "service_table_item";
    ToolName["QUERY_PROGRESS_HISTORY"] = "progress_table_item";
    ToolName["QUERY_TREASURY_HISTORY"] = "treasury_table_item";
    ToolName["QUERY_REPOSITORY_DATA"] = "repository_table_item";
    ToolName["QUERY_MARK_TAGS"] = "personal_resource_table_item";
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
})(ToolName || (ToolName = {}));
export var EventName;
(function (EventName) {
    EventName["new_arb"] = "onNewArb events";
    EventName["new_progress"] = "onNewProgress events";
    EventName["new_order"] = "onNewOrder events";
    EventName["present_service"] = "OnPresentService events";
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
        uriTemplate: 'wowok://objects/{?objects*, showType, showContent, showOwner, no_cache}',
        name: ToolName.QUERY_OBJECTS,
        description: "query wowok objects",
        mimeType: 'text/plain'
    },
    {
        uriTemplate: 'wowok://permissions/{?permission_object,address}',
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
        description: "query records of table data owned by the wowok object",
        mimeType: 'text/plain'
    },
    {
        uriTemplate: 'wowok://table_item/arb/{?object, address}',
        name: ToolName.QUERY_ARB_VOTING,
        description: "query voting infomation for an address in the Arb object.",
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
        description: "query node infomation in the Machine object.",
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
        description: "query voting infomation for an address in the Arb object.",
        inputSchema: zodToJsonSchema(QueryArbVotingSchema),
    },
    {
        name: ToolName.QUERY_DEMAND_SERVICE,
        description: "query service recommendation information in the Demand object.",
        inputSchema: zodToJsonSchema(QueryDemandServiceSchema),
    },
    {
        name: ToolName.QUERY_MACHINE_NODE,
        description: "query node infomation in the Machine object.",
        inputSchema: zodToJsonSchema(QueryMachineNodeSchema),
    },
    {
        name: ToolName.QUERY_MARK_TAGS,
        description: "query name and tags for an address in the PersonalMark object",
        inputSchema: zodToJsonSchema(QueryMarkTagSchema),
    },
    {
        name: ToolName.QUERY_PERMISSION_ENTITY,
        description: "query permissions for an address in the Permission object.",
        inputSchema: zodToJsonSchema(QueryPermissionEntitySchema),
    },
    {
        name: ToolName.QUERY_REPOSITORY_DATA,
        description: "query data in the Repository object.",
        inputSchema: zodToJsonSchema(QueryRepositoryDataSchema),
    },
    {
        name: ToolName.QUERY_PROGRESS_HISTORY,
        description: "query historical sessions data in the Progress object.",
        inputSchema: zodToJsonSchema(QueryProgressHistorySchema),
    },
    {
        name: ToolName.QUERY_TREASURY_HISTORY,
        description: "query historical flows data in the Treasury object.",
        inputSchema: zodToJsonSchema(QueryTreasuryHistorySchema),
    },
    {
        name: ToolName.QUERY_SERVICE_SALE,
        description: "query the current information of the item for sale in the Service object.",
        inputSchema: zodToJsonSchema(QueryServiceSaleSchema),
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
];
async function main() {
    const transport = new StdioServerTransport();
    server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => {
        return { resourceTemplates: RESOURCES };
    });
    server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
        const uri = request.params.uri;
        if (uri.startsWith("wowok://objects/")) {
            var query = parseUrlParams(uri);
            query.objects = query.objects.filter(v => WOWOK.IsValidAddress(v));
            const r = await query_objects(query);
            const content = Object.assign(RESOURCES.find(v => v.name === ToolName.QUERY_OBJECTS), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.startsWith("wowok://permissions/")) {
            const query = parseUrlParams(uri);
            const r = await query_permission(query);
            const content = Object.assign(RESOURCES.find(v => v.name === ToolName.QUERY_PERMISSIONS), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.startsWith("wowok://personal/")) {
            const query = parseUrlParams(uri);
            const r = await queryTableItem_Personal(query);
            const content = Object.assign(RESOURCES.find(v => v.name === ToolName.QUERY_PERSONAL), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.startsWith("wowok://table_items/")) {
            const query = parseUrlParams(uri);
            const r = await query_table(query);
            const content = Object.assign(RESOURCES.find(v => v.name === ToolName.QUERY_TABLE_ITEMS), { uri: uri, text: JSON.stringify(r) });
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
            const content = Object.assign(RESOURCES.find(v => v.name === ToolName.QUERY_DEMAND_SERVICE), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.startsWith("wowok://table_item/service/")) {
            const query = parseUrlParams(uri);
            const r = await queryTableItem_ServiceSale(query);
            const content = Object.assign(RESOURCES.find(v => v.name === ToolName.QUERY_SERVICE_SALE), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.startsWith("wowok://table_item/machine/")) {
            const query = parseUrlParams(uri);
            const r = await queryTableItem_MachineNode(query);
            const content = Object.assign(RESOURCES.find(v => v.name === ToolName.QUERY_MACHINE_NODE), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.startsWith("wowok://table_item/repository/")) {
            const query = parseUrlParams(uri);
            const r = await queryTableItem_RepositoryData(query);
            const content = Object.assign(RESOURCES.find(v => v.name === ToolName.QUERY_REPOSITORY_DATA), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.startsWith("wowok://table_item/permission/")) {
            const query = parseUrlParams(uri);
            const r = await queryTableItem_PermissionEntity(query);
            const content = Object.assign(RESOURCES.find(v => v.name === ToolName.QUERY_PERMISSION_ENTITY), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.startsWith("wowok://table_item/personalmark/")) {
            const query = parseUrlParams(uri);
            const r = await queryTableItem_MarkTag(query);
            const content = Object.assign(RESOURCES.find(v => v.name === ToolName.QUERY_MARK_TAGS), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.startsWith("wowok://table_item/treasury/")) {
            const query = parseUrlParams(uri);
            const r = await queryTableItem_TreasuryHistory(query);
            const content = Object.assign(RESOURCES.find(v => v.name === ToolName.QUERY_TREASURY_HISTORY), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.startsWith("wowok://table_item/progress/")) {
            const query = parseUrlParams(uri);
            const r = await queryTableItem_ProgressHistory(query);
            const content = Object.assign(RESOURCES.find(v => v.name === ToolName.QUERY_PROGRESS_HISTORY), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.toLocaleLowerCase().startsWith("wowok://events/onnewarb/")) {
            const query = parseUrlParams(uri);
            const r = await query_events({ type: 'OnNewArb',
                cursor: query.cursor_eventSeq && query.cursor_txDigest ? { eventSeq: query.cursor_eventSeq, txDigest: query.cursor_txDigest } : undefined,
                limit: query.limit, order: query.order === 'descending' || query.order === 'desc' ? 'descending' : 'ascending' });
            const content = Object.assign(RESOURCES.find(v => v.name === EventName.new_arb), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.toLocaleLowerCase().startsWith("wowok://events/onpresentservice/")) {
            const query = parseUrlParams(uri);
            const r = await query_events({ type: 'OnPresentService',
                cursor: query.cursor_eventSeq && query.cursor_txDigest ? { eventSeq: query.cursor_eventSeq, txDigest: query.cursor_txDigest } : undefined,
                limit: query.limit, order: query.order === 'descending' || query.order === 'desc' ? 'descending' : 'ascending' });
            const content = Object.assign(RESOURCES.find(v => v.name === EventName.present_service), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.toLocaleLowerCase().startsWith("wowok://events/onnewprogress/")) {
            const query = parseUrlParams(uri);
            const r = await query_events({ type: 'OnNewProgress',
                cursor: query.cursor_eventSeq && query.cursor_txDigest ? { eventSeq: query.cursor_eventSeq, txDigest: query.cursor_txDigest } : undefined,
                limit: query.limit, order: query.order === 'descending' || query.order === 'desc' ? 'descending' : 'ascending' });
            const content = Object.assign(RESOURCES.find(v => v.name === EventName.new_progress), { uri: uri, text: JSON.stringify(r) });
            return { tools: [], contents: [content] };
        }
        else if (uri.toLocaleLowerCase().startsWith("wowok://events/onneworder/")) {
            const query = parseUrlParams(uri);
            const r = await query_events({ type: 'OnNewOrder',
                cursor: query.cursor_eventSeq && query.cursor_txDigest ? { eventSeq: query.cursor_eventSeq, txDigest: query.cursor_txDigest } : undefined,
                limit: query.limit, order: query.order === 'descending' || query.order === 'desc' ? 'descending' : 'ascending' });
            const content = Object.assign(RESOURCES.find(v => v.name === EventName.new_order), { uri: uri, text: JSON.stringify(r) });
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
                    const r = await queryTableItem_Personal(args);
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
                    const args = QueryArbVotingSchema.parse(request.params.arguments);
                    const r = await queryTableItem_ArbVoting(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.QUERY_MACHINE_NODE: {
                    const args = QueryMachineNodeSchema.parse(request.params.arguments);
                    const r = await queryTableItem_MachineNode(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.QUERY_MARK_TAGS: {
                    const args = QueryMarkTagSchema.parse(request.params.arguments);
                    const r = await queryTableItem_MarkTag(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.QUERY_PERMISSION_ENTITY: {
                    const args = QueryPermissionEntitySchema.parse(request.params.arguments);
                    const r = await queryTableItem_PermissionEntity(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.QUERY_PROGRESS_HISTORY: {
                    const args = QueryProgressHistorySchema.parse(request.params.arguments);
                    const r = await queryTableItem_ProgressHistory(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.QUERY_TREASURY_HISTORY: {
                    const args = QueryTreasuryHistorySchema.parse(request.params.arguments);
                    const r = await queryTableItem_TreasuryHistory(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.QUERY_REPOSITORY_DATA: {
                    const args = QueryRepositoryDataSchema.parse(request.params.arguments);
                    const r = await queryTableItem_RepositoryData(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.QUERY_SERVICE_SALE: {
                    const args = QueryServiceSaleSchema.parse(request.params.arguments);
                    const r = await queryTableItem_ServiceSale(args);
                    return {
                        content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                    };
                }
                case ToolName.QUERY_DEMAND_SERVICE: {
                    const args = QueryDemandServiceSchema.parse(request.params.arguments);
                    const r = await queryTableItem_DemandService(args);
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
    //console.log(JSON.stringify('WoWok MCP server started.'))  
    await server.connect(transport);
    // Cleanup on exit
    process.on("SIGINT", async () => {
        await cleanup();
        await server.close();
        process.exit(0);
    });
}
async function cleanup() {
    // console.log({content:'WoWok MCP server closed.'})  
}
main().catch((error) => {
    //console.log("Server error:", error);
    //console.log('WoWok MCP server exited.') 
    process.exit(1);
});
process.stdin.on("close", async () => {
    await cleanup();
    await server.close();
    process.exit(0);
});
