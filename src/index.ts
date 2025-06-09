import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport,  } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListResourcesRequestSchema, ListResourceTemplatesRequestSchema, ListToolsRequestSchema, 
    ReadResourceRequestSchema, ResourceTemplate, Tool, ToolSchema, Resource } from "@modelcontextprotocol/sdk/types.js";
import { date, z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { query_objects, WOWOK, query_events, query_permission, query_table, call_guard, call_demand, call_machine, 
  call_service, call_treasury, queryTableItem_ServiceSale, queryTableItem_DemandService,  
  call_arbitration, call_permission, call_personal, call_transfer_permission, call_repository,
  queryTableItem_ArbVoting, queryTableItem_MachineNode, queryTableItem_MarkTag, queryTableItem_PermissionEntity,
  queryTableItem_ProgressHistory, queryTableItem_TreasuryHistory, queryTableItem_RepositoryData, ObjectsQuery,
  PermissionQuery, PersonalQuery, TableQuery, query_personal,
  QueryTableItem_Address, QueryTableItem_Name, QueryTableItem_AddressName, QueryTableItem_Index,
  local_mark_operation, local_info_operation, account_operation, query_local_mark_list, query_local_info_list, query_account, 
  query_account_list, query_local_mark, query_local_info, QueryAccount, LocalMarkFilter, query_treasury_received,
  QueryTreasuryReceived
  } from 'wowok_agent';
import { QueryObjectsSchema, QueryEventSchema, QueryPermissionSchema, QueryTableItemsSchema, QueryPersonalSchema, QueryTableItemSchema, 
  QueryByAddressNameSchema, QueryByIndexSchema, QueryByNameSchema, QueryByAddressSchema,
  QueryObjectsSchemaDescription, QueryPermissionSchemaDescription, QueryPersonalSchemaDescription, QueryEventSchemaDescription,
  Query_TableItems_List_Description, Arb_TableItem_Description, Demand_TableItem_Description,
  Machine_TableItem_Description, PersonalMark_TableItem_Description, Permission_TableItem_Description,
  Repository_TableItem_Description, Progress_TableItem_Description, Service_TableItem_Description,
  Treasury_TableItem_Description,
  QueryTreasuryReceivedSchema,
  Treasury_ReceivedObject_Description,
  QueryTableItemSchemaDescription, 
} from './query.js';
import { CallArbitrationSchema, CallArbitrationSchemaDescription, CallDemandSchema, CallDemandSchemaDescription, CallGuardSchema, CallGuardSchemaDescription, CallMachineSchema, CallMachineSchemaDescription, CallObejctPermissionSchema,
    CallObejctPermissionSchemaDescription,
    CallPermissionSchema, CallPermissionSchemaDescription, CallPersonalSchema, CallPersonalSchemaDescription, CallRepositorySchema, CallRepositorySchemaDescription, CallServiceSchema, CallServiceSchemaDescription, CallTreasurySchema,
    CallTreasurySchemaDescription,
    OperateSchema,
    OperateSchemaDescription,
 } from "./call.js";
import { parseUrlParams } from "./util.js"; 
import { AccountListSchemaDescription, AccountListSchema, AccountOperationSchema, LocalInfoListSchema, LocalInfoListSchemaDescription, LocalInfoOperationSchema, LocalMarkFilterSchema, LocalMarkFilterSchemaDescription, 
    LocalMarkOperationSchema, QueryAccountSchema, QueryAccountSchemaDescription, QueryLocalInfoSchema, QueryLocalInfoSchemaDescription, QueryLocalMarkSchema, QueryLocalMarkSchemaDescription, AccountOperationSchemaDescription, LocalInfoOperationSchemaDescription, LocalMarkOperationSchemaDescription, 
    localMarkListDescription,
    LocalSchemaDescription,
    LocalSchema} from "./local.js";
import { ERROR, Errors } from "../../wowok/dist/exception.js";


const ToolInputSchema = ToolSchema.shape.inputSchema;
type ToolInput = z.infer<typeof ToolInputSchema>;

export enum ToolName {
    QUERY_OBJECTS = 'objects_query',
    QUERY_EVENTS = 'events_query',
    QUERY_PERMISSIONS = 'permissions_query',
    QUERY_PERSONAL = 'presonal_information_query',
    QUERY_LOCAL_MARK_LIST = 'local_marks_list',
    QUERY_LOCAL_INFO_LIST = 'local_information_list',
    QUERY_ACCOUNT_LIST = 'local_accounts_list',
    QUERY_LOCAL_MARK_FILTER = 'local_mark_filter',
    QUERY_LOCAL_MARK = 'local_mark_query',
    QUERY_LOCAL_INFO = 'local_info_query',
    QUERY_ACCOUNT = 'local_account_query',
    OP_PERSONAL = 'personal_operations',
    OP_MACHINE = 'machine_operations',
    OP_SERVICE = 'service_operations',
    OP_PERMISSION = 'permission_operations',
    OP_TREASURY = 'treasury_operations',
    OP_ARBITRATION = 'arbitration_operations',
    OP_REPOSITORY = 'repository_operations',
    OP_GUARD = 'guard_operations',
    OP_DEMAND = 'demand_operations',
    OP_REPLACE_PERMISSION_OBJECT = 'replace_permission_object',
    OP_ACCOUNT = 'local_account_operations',
    OP_LOCAL_MARK = 'local_mark_operations',
    OP_LOCAL_INFO = 'local_info_operations',
    QUERY_TABLE_ITEMS_LIST = 'table_items_list', 
    QUERY_ARB_VOTING_LIST = 'arb_table_items_list',
    QUERY_DEMAND_SERVICE_LIST = 'demand_table_items_list',
    QUERY_PERMISSION_ENTITY_LIST = 'permission_table_items_list',
    QUERY_MACHINE_NODE_LIST = 'machine_table_items_list',
    QUERY_SERVICE_SALE_LIST = 'service_table_items_list',
    QUERY_PROGRESS_HISTORY_LIST = 'progress_table_items_list',
    QUERY_TREASURY_HISTORY_LIST = 'treasury_table_items_list',
    QUERY_REPOSITORY_DATA_LIST = 'repository_table_items_list',
    QUERY_PERSONAL_MARK_LIST = 'personalmark_table_items_list',
    QUERY_ARB_VOTING = 'arb_table_item_query',
    QUERY_DEMAND_SERVICE = 'demand_table_item_query',
    QUERY_PERMISSION_ENTITY = 'permission_table_item_query',
    QUERY_MACHINE_NODE = 'machine_table_item_query',
    QUERY_SERVICE_SALE = 'service_table_item_query',
    QUERY_PROGRESS_HISTORY = 'progress_table_item_query',
    QUERY_TREASURY_HISTORY = 'treasury_table_item_query',
    QUERY_REPOSITORY_DATA = 'repository_table_item_query',
    QUERY_PERSONAL_MARK = 'personalmark_table_item_query',
    QUERY_TREASURY_RECEIVE = 'treasury_receive_query',
    TOOLS_OP = 'operations',
    QUERY_TABLE_ITEM = 'table_item_query',
    QUERY_LOCAL = 'local_query',
}

WOWOK.Protocol.Instance().use_network(WOWOK.ENTRYPOINT.testnet);
// Create server instance
const server = new Server({
    name: "wowok",
    version: "1.1.14",
    description: `WoWok is a web3 collaboration protocol that enables users to create, collaborate, and transact on their own terms. It provides a set of tools and services that allow users to build and manage their own decentralized applications (dApps) and smart contracts.
    This server provides a set of tools and resources for querying and managing on-chain objects, events, and permissions in the WoWok protocol. It allows users to interact with the blockchain and perform various operations such as querying objects, events, permissions, and personal information, as well as performing on-chain operations like creating or updating objects, managing permissions, and more.
    It also provides local operations for managing your accounts and personal marks and information, allowing users to store and retrieve personal data securely on their devices.`,
  },{
    capabilities: {
      prompts: { },
      resources: {},
      tools: { },
      logging: {},
    },
},);

const RESOURCES: Resource[] = [
    {
        uri: 'wowok://account/list',
        name: ToolName.QUERY_ACCOUNT_LIST,
        description: AccountListSchemaDescription,
        mimeType:'text/plain'
    },
    {
        uri: 'wowok://local_info/list',
        name: ToolName.QUERY_LOCAL_INFO_LIST,
        description: LocalInfoListSchemaDescription,
        mimeType:'text/plain'
    },
    {
        uri: 'wowok://local_mark/list',
        name: ToolName.QUERY_LOCAL_MARK_LIST,
        description: localMarkListDescription,
        mimeType:'text/plain'
    },
];

const RESOURCES_TEMPL: ResourceTemplate[] = [
    {
        uriTemplate: 'wowok://objects/{?objects*, no_cache}',
        name:ToolName.QUERY_OBJECTS,
        description:QueryObjectsSchemaDescription,
        mimeType:'text/plain'
    },
    {
        uriTemplate: 'wowok://permissions/{?permission_object, address}',
        name: ToolName.QUERY_PERMISSIONS,
        description: QueryPermissionSchemaDescription,
        mimeType:'text/plain'
    },
    {
        uriTemplate: 'wowok://personal/{?address, no_cache}',
        name: ToolName.QUERY_PERSONAL,
        description: QueryPersonalSchemaDescription,
        mimeType:'text/plain'
    },
    {
        uriTemplate: 'wowok://account/{?name_or_address, balance_or_coin, token_type}',
        name:ToolName.QUERY_ACCOUNT,
        description:  QueryAccountSchemaDescription,
        mimeType:'text/plain'
    },
    {
        uriTemplate: 'wowok://local_mark/{?name}',
        name: ToolName.QUERY_LOCAL_MARK,
        description: QueryLocalMarkSchemaDescription,
        mimeType:'text/plain'
    },
    {
        uriTemplate: 'wowok://local_info/{?name}',
        name: ToolName.QUERY_LOCAL_INFO,
        description: QueryLocalInfoSchemaDescription,
        mimeType:'text/plain'
    },
    {
        uriTemplate: 'wowok://local_mark/filter/{?name, tags*, object}',
        name: ToolName.QUERY_LOCAL_MARK_FILTER,
        description: LocalMarkFilterSchemaDescription,
        mimeType:'text/plain'
    },
    {
        uriTemplate: `wowok://${ToolName.QUERY_TABLE_ITEMS_LIST}/{?parent, cursor, limit, no_cache}`,
        name: ToolName.QUERY_TABLE_ITEMS_LIST,
        description: Query_TableItems_List_Description,
        mimeType:'text/plain'
    },
    {
        uriTemplate: `wowok://${ToolName.QUERY_TABLE_ITEMS_LIST}/{?parent, cursor, limit, no_cache}`,
        name: ToolName.QUERY_TABLE_ITEMS_LIST,
        description: Query_TableItems_List_Description,
        mimeType:'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/arb/{?object, address, no_cache}',
        name: ToolName.QUERY_ARB_VOTING,
        description: Arb_TableItem_Description,
        mimeType:'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/demand/{?object, address, no_cache}',
        name: ToolName.QUERY_DEMAND_SERVICE,
        description: Demand_TableItem_Description,
        mimeType:'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/machine/{?object, node, no_cache}',
        name: ToolName.QUERY_MACHINE_NODE,
        description: Machine_TableItem_Description,
        mimeType:'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/personalmark/{?object, address, no_cache}',
        name: ToolName.QUERY_PERSONAL_MARK,
        description: PersonalMark_TableItem_Description,
        mimeType:'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/permission/{?object, address, no_cache}',
        name: ToolName.QUERY_PERMISSION_ENTITY,
        description: Permission_TableItem_Description,
        mimeType:'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/repository/{?object, address, name, no_cache}',
        name: ToolName.QUERY_REPOSITORY_DATA,
        description: Repository_TableItem_Description,
        mimeType:'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/progress/{?object, index, no_cache}',
        name: ToolName.QUERY_PROGRESS_HISTORY,
        description: Progress_TableItem_Description,
        mimeType:'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/treasury/{?object, index, no_cache}',
        name: ToolName.QUERY_TREASURY_HISTORY,
        description: Treasury_TableItem_Description,
        mimeType:'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/service/{?object, name, no_cache}',
        name: ToolName.QUERY_SERVICE_SALE,
        description: Service_TableItem_Description,
        mimeType:'text/plain',
    },
    {
        uriTemplate: 'wowok://events/{?type, cursor_eventSeq, cursor_txDigest, limit, order}',
        name: ToolName.QUERY_EVENTS,
        description: QueryEventSchemaDescription,
        mimeType:'text/plain'
    },
    {
        uriTemplate: 'wowok://treasury_received/{?treasury_object, limit, order}',
        name: ToolName.QUERY_TREASURY_RECEIVE,
        description: QueryEventSchemaDescription,
        mimeType:'text/plain'
    }
];

const TOOLS: Tool[] = [
    {
        name: ToolName.TOOLS_OP,
        description: OperateSchemaDescription,
        inputSchema: zodToJsonSchema(OperateSchema)  as ToolInput,
    },
    {
        name: ToolName.QUERY_OBJECTS,
        description: QueryObjectsSchemaDescription,
        inputSchema: zodToJsonSchema(QueryObjectsSchema)  as ToolInput,
    },    
    {
        name: ToolName.QUERY_LOCAL,
        description: LocalSchemaDescription,
        inputSchema: zodToJsonSchema(LocalSchema)  as ToolInput,
    },
    {
        name: ToolName.QUERY_PERMISSIONS,
        description: QueryPermissionSchemaDescription,
        inputSchema: zodToJsonSchema(QueryPermissionSchema)  as ToolInput,
    },
    {
        name: ToolName.QUERY_TABLE_ITEMS_LIST,
        description: Query_TableItems_List_Description,
        inputSchema: zodToJsonSchema(QueryTableItemsSchema)  as ToolInput,
    },
    {
        name: ToolName.QUERY_EVENTS,
        description: QueryEventSchemaDescription,
        inputSchema: zodToJsonSchema(QueryEventSchema)  as ToolInput,
    },
    {
        name: ToolName.QUERY_PERSONAL,
        description: QueryPermissionSchemaDescription,
        inputSchema: zodToJsonSchema(QueryPersonalSchema)  as ToolInput,
    },
    {
        name: ToolName.QUERY_TREASURY_RECEIVE,
        description: Treasury_ReceivedObject_Description,
        inputSchema: zodToJsonSchema(QueryTreasuryReceivedSchema)  as ToolInput,
    },    
    {
        name: ToolName.QUERY_TABLE_ITEM,
        description: QueryTableItemSchemaDescription,
        inputSchema: zodToJsonSchema(QueryTableItemSchema)  as ToolInput,
    },
]

type EventParam = {
    type: 'onNewArb' | 'OnNewProgress' | 'OnNewOrder' | 'OnPresentService';
    cursor_eventSeq?: string | null;
    cursor_txDigest?: string | null;
    limit?: number | null; 
    order?: 'ascending' | 'descending' | null | string;
}

async function main() {
    const transport = new StdioServerTransport();
    server.setRequestHandler(ListResourcesRequestSchema, async () => {
        return {resources:RESOURCES}
    });

    server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => {
        return {resourceTemplates:RESOURCES_TEMPL}
    });

    server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
        const uri: string = request.params.uri;

        if (uri.startsWith("wowok://objects/")) {
            var query = parseUrlParams<ObjectsQuery>(uri);
            query.objects = query.objects.filter(v => WOWOK.IsValidAddress(v));
            const r = await query_objects(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===ToolName.QUERY_OBJECTS)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri.startsWith("wowok://permissions/")) {
            const query = parseUrlParams<PermissionQuery>(uri);
            const r = await query_permission(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===ToolName.QUERY_PERMISSIONS)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri.startsWith("wowok://personal/")) {
            const query = parseUrlParams<PersonalQuery>(uri);
            const r = await query_personal(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===ToolName.QUERY_PERSONAL)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri.startsWith(`wowok://${ToolName.QUERY_TABLE_ITEMS_LIST}`)) {
            const query = parseUrlParams<TableQuery>(uri);
            const r = await query_table(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===ToolName.QUERY_TABLE_ITEMS_LIST)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri.startsWith(`wowok://${ToolName.QUERY_DEMAND_SERVICE_LIST}`)) {
            const query = parseUrlParams<TableQuery>(uri);
            const r = await query_table(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===ToolName.QUERY_DEMAND_SERVICE_LIST)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri.startsWith(`wowok://${ToolName.QUERY_SERVICE_SALE_LIST}`)) {
            const query = parseUrlParams<TableQuery>(uri);
            const r = await query_table(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===ToolName.QUERY_SERVICE_SALE_LIST)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri.startsWith(`wowok://${ToolName.QUERY_ARB_VOTING_LIST}`)) {
            const query = parseUrlParams<TableQuery>(uri);
            const r = await query_table(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===ToolName.QUERY_ARB_VOTING_LIST)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri.startsWith(`wowok://${ToolName.QUERY_TREASURY_HISTORY_LIST}`)) {
            const query = parseUrlParams<TableQuery>(uri);
            const r = await query_table(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===ToolName.QUERY_TREASURY_HISTORY_LIST)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri.startsWith(`wowok://${ToolName.QUERY_MACHINE_NODE_LIST}`)) {
            const query = parseUrlParams<TableQuery>(uri);
            const r = await query_table(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===ToolName.QUERY_MACHINE_NODE_LIST)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri.startsWith(`wowok://${ToolName.QUERY_REPOSITORY_DATA_LIST}`)) {
            const query = parseUrlParams<TableQuery>(uri);
            const r = await query_table(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===ToolName.QUERY_REPOSITORY_DATA_LIST)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri.startsWith(`wowok://${ToolName.QUERY_PERMISSION_ENTITY_LIST}`)) {
            const query = parseUrlParams<TableQuery>(uri);
            const r = await query_table(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===ToolName.QUERY_PERMISSION_ENTITY_LIST)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri.startsWith(`wowok://${ToolName.QUERY_PERSONAL_MARK_LIST}`)) {
            const query = parseUrlParams<TableQuery>(uri);
            const r = await query_table(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===ToolName.QUERY_PERSONAL_MARK_LIST)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri.startsWith(`wowok://${ToolName.QUERY_PROGRESS_HISTORY_LIST}`)) {
            const query = parseUrlParams<TableQuery>(uri);
            const r = await query_table(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===ToolName.QUERY_PROGRESS_HISTORY_LIST)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri.startsWith("wowok://table_item/arb/")) {
            const query = parseUrlParams<QueryTableItem_Address>(uri);
            const r = await queryTableItem_ArbVoting(query);
            return {tools:[], content:[JSON.stringify(r)]}
        } else if (uri.startsWith("wowok://table_item/demand/")) {
            const query = parseUrlParams<QueryTableItem_Address>(uri);
            const r = await queryTableItem_DemandService(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===ToolName.QUERY_DEMAND_SERVICE)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri.startsWith("wowok://table_item/service/")) {
            const query = parseUrlParams<QueryTableItem_Name>(uri);
            const r = await queryTableItem_ServiceSale(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===ToolName.QUERY_SERVICE_SALE)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri.startsWith("wowok://table_item/machine/")) {
            const query = parseUrlParams<QueryTableItem_Name>(uri);
            const r = await queryTableItem_MachineNode(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===ToolName.QUERY_MACHINE_NODE)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri.startsWith("wowok://table_item/repository/")) {
            const query = parseUrlParams<QueryTableItem_AddressName>(uri);
            const r = await queryTableItem_RepositoryData(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===ToolName.QUERY_REPOSITORY_DATA)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri.startsWith("wowok://table_item/permission/")) {
            const query = parseUrlParams<QueryTableItem_Address>(uri);
            const r = await queryTableItem_PermissionEntity(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===ToolName.QUERY_PERMISSION_ENTITY)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri.startsWith("wowok://table_item/personalmark/")) {
            const query = parseUrlParams<QueryTableItem_Address>(uri);
            const r = await queryTableItem_MarkTag(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===ToolName.QUERY_PERSONAL_MARK)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri.startsWith("wowok://table_item/treasury/")) {
            const query = parseUrlParams<QueryTableItem_Index>(uri);
            const r = await queryTableItem_TreasuryHistory(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===ToolName.QUERY_TREASURY_HISTORY)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri.startsWith("wowok://table_item/progress/")) {
            const query = parseUrlParams<QueryTableItem_Index>(uri);
            const r = await queryTableItem_ProgressHistory(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===ToolName.QUERY_PROGRESS_HISTORY)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri.toLocaleLowerCase().startsWith("wowok://events/")) {
            const query = parseUrlParams<EventParam>(uri);
            const r = await query_events({type:query.type as any, 
                cursor:query.cursor_eventSeq && query.cursor_txDigest ? {eventSeq:query.cursor_eventSeq, txDigest:query.cursor_txDigest} : undefined,
                limit:query.limit, order: query.order === 'descending' || query.order === 'desc' ? 'descending' : 'ascending'});
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===ToolName.QUERY_EVENTS)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri.toLocaleLowerCase().startsWith("wowok://local_mark/list")) {
            return {tools:[], contents:[{uri:uri, text:JSON.stringify(await query_local_mark_list())}]}
        } else if (uri.toLocaleLowerCase().startsWith("wowok://local_info/list")) {
            return {tools:[], contents:[{uri:uri, text:JSON.stringify(await query_local_info_list())}]} 
        } else if (uri.toLocaleLowerCase().startsWith("wowok://account/list")) {
            return {tools:[], contents:[{uri:uri, text:JSON.stringify(await query_account_list())}]}    
        } else if (uri.toLocaleLowerCase().startsWith("wowok://treasury_received/")) {
            const query = parseUrlParams<QueryTreasuryReceived>(uri);  
            return {tools:[], contents:[{uri:uri, text:JSON.stringify(await query_treasury_received(query))}]}    
        } else if (uri.toLocaleLowerCase().startsWith('wowok://local_mark/filter/')) {
            const query = parseUrlParams<LocalMarkFilter>(uri);  
            server.sendLoggingMessage({level:'info', message:JSON.stringify(query)})
            const r = await query_local_mark_list(query)
            return {tools:[], contents:[{uri:uri, text:JSON.stringify(r)}]}
        } else if (uri.toLocaleLowerCase().startsWith("wowok://local_mark/")) {
            const query = parseUrlParams<{name:string}>(uri);   
            const r = await query_local_mark(query.name);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===ToolName.QUERY_LOCAL_MARK)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri.toLocaleLowerCase().startsWith("wowok://local_info/")) {     
            const query = parseUrlParams<{name:string}>(uri);   
            const r = await query_local_info(query.name);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===ToolName.QUERY_LOCAL_INFO)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri.toLocaleLowerCase().startsWith("wowok://account/")) {
            const query = parseUrlParams<QueryAccount>(uri); 
            const r = await query_account(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===ToolName.QUERY_ACCOUNT)!, {uri:uri, text:JSON.stringify(r)});    
            return {tools:[], contents:[content]}   
        } 

        throw new Error(`Unknown resource: ${uri}`);
    });

    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return {tools:TOOLS};
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
            
            case ToolName.QUERY_TABLE_ITEMS_LIST: {
                const args = QueryTableItemsSchema.parse(request.params.arguments);
                const r = await query_table(args);
                return {
                    content: [{ type: "text", text: JSON.stringify(r) }],
                };
            }
            
            case ToolName.QUERY_TABLE_ITEM: {
                const args = QueryTableItemSchema.parse(request.params.arguments);
                switch (args.query.name) {
                    case 'arb': 
                        const arb = QueryByAddressSchema.parse(args.query.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await queryTableItem_ArbVoting(arb)) }],
                        };
                    case "treasury":
                        const treasury = QueryByIndexSchema.parse(args.query.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await queryTableItem_TreasuryHistory(treasury)) }],
                        };
                    case "service":
                        const service = QueryByNameSchema.parse(args.query.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await queryTableItem_ServiceSale(service)) }],
                        };
                    case "demand":
                        const demand = QueryByAddressSchema.parse(args.query.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await queryTableItem_DemandService(demand)) }],
                        };
                    case "machine":
                        const machine = QueryByNameSchema.parse(args.query.data);
                        return {
                          content: [{ type: "text", text: JSON.stringify(await queryTableItem_MachineNode(machine)) }],
                        };
                    case "personalmark":
                        const personalmark = QueryByAddressSchema.parse(args.query.data);
                        return {
                          content: [{ type: "text", text: JSON.stringify(await queryTableItem_MarkTag(personalmark)) }],
                        };
                    case "permission":
                        const permission = QueryByAddressSchema.parse(args.query.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await queryTableItem_PermissionEntity(permission)) }],
                        };
                    case "repository":
                        const repository = QueryByAddressNameSchema.parse(args.query.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await queryTableItem_RepositoryData(repository)) }],
                        };
                    case "progress":
                        const progress = QueryByIndexSchema.parse(args.query.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await queryTableItem_ProgressHistory(progress)) }],
                        };
                    default: 
                        ERROR(Errors.InvalidParam, 'Invalid table item query name')
                }
            }

            case ToolName.QUERY_TREASURY_RECEIVE: {
                const args = QueryTreasuryReceivedSchema.parse(request.params.arguments);
                const r = await query_treasury_received(args);
                return {
                    content: [{ type: "text", text: JSON.stringify(r) }],
                };
            }

            case ToolName.QUERY_LOCAL: {
                const args = LocalSchema.parse(request.params.arguments);
                switch(args.query.name) {
                    case "account_list": 
                        const account_list = AccountListSchema.parse(args.query.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await query_account_list(account_list?.showSuspendedAccount)) }],
                        };
                    case "info_list":
                        return {
                            content: [{ type: "text", text: JSON.stringify(await query_local_info_list()) }],
                        };
                    case "mark_list":
                        const mark_list = LocalMarkFilterSchema.parse(args.query.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await query_local_mark_list(mark_list)) }],
                        };
                    case "account":
                        const account = QueryAccountSchema.parse(args.query.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await query_account(account)) }],
                        }
                    case "mark":
                        const mark = QueryLocalMarkSchema.parse(args.query.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await query_local_mark(mark.name)) }],
                        }
                    case "info":
                        const info = QueryLocalInfoSchema.parse(args.query.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await query_local_info(info.name)) }],
                        }
                    default:
                        ERROR(Errors.InvalidParam, 'Invalid local query name')
                }
            }

            case ToolName.TOOLS_OP: {
                const args = OperateSchema.parse(request.params.arguments);
                switch(args.call.name) {
                    case "account": 
                        const account = AccountOperationSchema.parse(args.call.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await account_operation(account)) }],
                        };
                    case 'mark':
                        const mark = LocalMarkOperationSchema.parse(args.call.data);
                        await local_mark_operation(mark);
                        return {
                            content: [{ type: "text", text: 'success'}],
                        };
                    case 'info':
                        const info = LocalInfoOperationSchema.parse(args.call.data);    
                        await local_info_operation(info);       
                        return {
                            content: [{ type: "text", text: 'success'}],
                        };  
                    case "demand":
                        const demand = CallDemandSchema.parse(args.call.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await call_demand(demand)) }],
                        };
                    case "permission":
                        const permission = CallPermissionSchema.parse(args.call.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await call_permission(permission)) }],
                        };
                    case "service":
                        const service = CallServiceSchema.parse(args.call.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await call_service(service)) }],
                        };
                    case "guard":
                        const guard = CallGuardSchema.parse(args.call.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await call_guard(guard)) }],
                        };
                    case "repository":
                        const repository = CallRepositorySchema.parse(args.call.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await call_repository(repository)) }],
                        };
                    case "machine":
                        const machine = CallMachineSchema.parse(args.call.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await call_machine(machine)) }],
                        };
                    case "arbitration":
                        const arbitration = CallArbitrationSchema.parse(args.call.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await call_arbitration(arbitration)) }],
                        };
                    case "treasury":
                        const treasury = CallTreasurySchema.parse(args.call.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await call_treasury(treasury)) }],
                        };
                    case "personal":
                        const personal = CallPersonalSchema.parse(args.call.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await call_personal(personal))}],
                        };
                    case "object_permission":
                        const object_permission = CallObejctPermissionSchema.parse(args.call.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await call_transfer_permission(object_permission)) }],
                        };
                    default:
                        ERROR(Errors.InvalidParam, 'Invalid call name')
                }
            }

            default:
              throw new Error(`Unknown tool: ${request.params.name}`);
          }
        } catch (error) { 
          if (error instanceof z.ZodError) {
            throw new Error(`Invalid input: ${JSON.stringify(error.errors)}`);
          }

          throw error; 
        }
        return {content:[]}
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
