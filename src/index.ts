import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport,} from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListResourcesRequestSchema, ListResourceTemplatesRequestSchema, ListToolsRequestSchema, 
    ReadResourceRequestSchema, ResourceTemplate, Tool, ToolSchema, Resource } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import * as A from 'wowok_agent';

const ToolInputSchema = ToolSchema.shape.inputSchema;
type ToolInput = z.infer<typeof ToolInputSchema>;

A.WOWOK.Protocol.Instance().use_network(A.WOWOK.ENTRYPOINT.testnet);
// Create server instance
const server = new Server({
    name: "wowok",
    version: "1.3.30",
    description: `WoWok is a web3 collaboration protocol that enables users to create, collaborate, and transact on their own terms. It provides a set of tools and services that allow users to build and manage their own decentralized applications (dApps) and smart contracts.
    This server provides a set of tools and resources for querying and managing on-chain objects, events, and permissions in the WoWok protocol. It allows users to interact with the blockchain and perform various operations such as querying objects, events, permissions, and personal information, as well as performing on-chain operations like creating or updating objects, managing permissions, and more.
    It also provides local operations for managing your accounts and personal marks and information, allowing users to store and retrieve personal data securely on their devices.`,
  },{
    capabilities: {
      prompts: { },
      resources: {},
      tools: { },
      logging: {},
      tokensOptimized: true, // Optimize tokens for better performance and efficiency.
    },
},);

const RESOURCES: Resource[] = [
    {
        uri: 'wowok://account/list',
        name: A.ToolName.QUERY_ACCOUNT_LIST,
        description: A.AccountListSchemaDescription,
        mimeType:'text/plain'
    },
    {
        uri: 'wowok://local_info/list',
        name: A.ToolName.QUERY_LOCAL_INFO_LIST,
        description: A.LocalInfoListSchemaDescription,
        mimeType:'text/plain'
    },
    {
        uri: 'wowok://local_mark/list',
        name: A.ToolName.QUERY_LOCAL_MARK_LIST,
        description: A.localMarkListDescription,
        mimeType:'text/plain'
    },
    {
        uri: `wowok://${A.ToolName.QUERY_WOWOK_PROTOCOL}`,
        name: A.ToolName.QUERY_WOWOK_PROTOCOL,
        description: A.QueryWowokProtocolSchemaDescription,
        mimeType:'text/plain'
    },
];

const RESOURCES_TEMPL: ResourceTemplate[] = [
    {
        uriTemplate: 'wowok://objects/{?objects*, no_cache}',
        name:A.ToolName.QUERY_OBJECTS,
        description: A.QueryObjectsSchemaDescription,
        mimeType:'text/plain'
    },
    {
        uriTemplate: 'wowok://permissions/{?permission_object, address}',
        name: A.ToolName.QUERY_PERMISSIONS,
        description: A.QueryPermissionSchemaDescription,
        mimeType:'text/plain'
    },
    {
        uriTemplate: 'wowok://personal/{?address, no_cache}',
        name: A.ToolName.QUERY_PERSONAL,
        description: A.QueryPersonalSchemaDescription,
        mimeType:'text/plain'
    },
    {
        uriTemplate: 'wowok://account/{?name_or_address, balance_or_coin, token_type}',
        name:A.ToolName.QUERY_ACCOUNT,
        description:  A.QueryAccountSchemaDescription,
        mimeType:'text/plain'
    },
    {
        uriTemplate: 'wowok://local_mark/{?name}',
        name: A.ToolName.QUERY_LOCAL_MARK,
        description: A.QueryLocalMarkSchemaDescription,
        mimeType:'text/plain'
    },
    {
        uriTemplate: 'wowok://local_info/{?name}',
        name: A.ToolName.QUERY_LOCAL_INFO,
        description: A.QueryLocalInfoSchemaDescription,
        mimeType:'text/plain'
    },
    {
        uriTemplate: 'wowok://local_mark/filter/{?name, tags*, object}',
        name: A.ToolName.QUERY_LOCAL_MARK_FILTER,
        description: A.LocalMarkFilterSchemaDescription,
        mimeType:'text/plain'
    },
    {
        uriTemplate: `wowok://${A.ToolName.QUERY_TABLE_ITEMS_LIST}/{?parent, cursor, limit, no_cache}`,
        name: A.ToolName.QUERY_TABLE_ITEMS_LIST,
        description: A.Query_TableItems_List_Description,
        mimeType:'text/plain'
    },
    {
        uriTemplate: 'wowok://table_item/arb/{?object, address, no_cache}',
        name: A.ToolName.QUERY_ARB_VOTING,
        description: A.Arb_TableItem_Description,
        mimeType:'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/demand/{?object, address, no_cache}',
        name: A.ToolName.QUERY_DEMAND_SERVICE,
        description: A.Demand_TableItem_Description,
        mimeType:'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/machine/{?object, node, no_cache}',
        name: A.ToolName.QUERY_MACHINE_NODE,
        description: A.Machine_TableItem_Description,
        mimeType:'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/personalmark/{?object, address, no_cache}',
        name: A.ToolName.QUERY_PERSONAL_MARK,
        description: A.PersonalMark_TableItem_Description,
        mimeType:'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/permission/{?object, address, no_cache}',
        name: A.ToolName.QUERY_PERMISSION_ENTITY,
        description: A.Permission_TableItem_Description,
        mimeType:'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/repository/{?object, address, name, no_cache}',
        name: A.ToolName.QUERY_REPOSITORY_DATA,
        description: A.Repository_TableItem_Description,
        mimeType:'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/progress/{?object, index, no_cache}',
        name: A.ToolName.QUERY_PROGRESS_HISTORY,
        description: A.Progress_TableItem_Description,
        mimeType:'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/treasury/{?object, index, no_cache}',
        name: A.ToolName.QUERY_TREASURY_HISTORY,
        description: A.Treasury_TableItem_Description,
        mimeType:'text/plain',
    },
    {
        uriTemplate: 'wowok://table_item/service/{?object, name, no_cache}',
        name: A.ToolName.QUERY_SERVICE_SALE,
        description: A.Service_TableItem_Description,
        mimeType:'text/plain',
    },
    {
        uriTemplate: 'wowok://events/{?type, cursor_eventSeq, cursor_txDigest, limit, order}',
        name: A.ToolName.QUERY_EVENTS,
        description: A.QueryEventSchemaDescription,
        mimeType:'text/plain'
    },
    {
        uriTemplate: 'wowok://received/{?object, limit, order}',
        name: A.ToolName.QUERY_RECEIVED,
        description: A.QueryEventSchemaDescription,
        mimeType:'text/plain'
    }
];



type EventParam = {
    type: 'onNewArb' | 'OnNewProgress' | 'OnNewOrder' | 'OnPresentService';
    cursor_eventSeq?: string | null;
    cursor_txDigest?: string | null;
    limit?: number | null; 
    order?: 'ascending' | 'descending' | null | string;
}

async function main() {
    const TOOLS: Tool[] = [
        {
            name: A.ToolName.QUERY_WOWOK_PROTOCOL,
            description: A.QueryWowokProtocolSchemaDescription,
            inputSchema: A.QueryWowokProtocolSchemaInput()  as ToolInput,
        }, 
        {
            name: A.ToolName.QUERY_OBJECTS,
            description: A.QueryObjectsSchemaDescription,
            inputSchema: A.QueryObjectsSchemaInput()  as ToolInput,
        },    
        {
            name: A.ToolName.QUERY_LOCAL,
            description: A.QueryLocalSchemaDescription,
            inputSchema: A.QueryLocalSchemaInput()  as ToolInput,
        },
        {
            name: A.ToolName.QUERY_PERMISSIONS,
            description: A.QueryPermissionSchemaDescription,
            inputSchema: A.QueryPermissionSchemaInput()  as ToolInput,
        },
        {
            name: A.ToolName.QUERY_TABLE_ITEMS_LIST,
            description: A.Query_TableItems_List_Description,
            inputSchema: A.QueryTableItemsSchemaInput() as ToolInput,
        },
        {
            name: A.ToolName.QUERY_EVENTS,
            description: A.QueryEventSchemaDescription,
            inputSchema: A.QueryEventSchemaInput()  as ToolInput,
        },
        {
            name: A.ToolName.QUERY_PERSONAL,
            description: A.QueryPermissionSchemaDescription,
            inputSchema: A.QueryPersonalSchemaInput()  as ToolInput,
        },
        {
            name: A.ToolName.QUERY_RECEIVED,
            description: A.ReceivedObject_Description,
            inputSchema: A.QueryReceivedSchemaInput()  as ToolInput,
        },    
        {
            name: A.ToolName.QUERY_TABLE_ITEM,
            description: A.QueryTableItemSchemaDescription,
            inputSchema: A.QueryTableItemSchemaInput()  as ToolInput,
        },
        {
            name: A.ToolName.OP_LOCAL_INFO,
            description: A.LocalInfoOperationSchemaDescription,
            inputSchema: A.LocalInfoOperationSchemaInput()  as ToolInput,

        },
        {
            name: A.ToolName.OP_LOCAL_MARK,
            description: A.LocalMarkOperationSchemaDescription,
            inputSchema: A.LocalMarkOperationSchemaInput()  as ToolInput,

        },
        {
            name: A.ToolName.OP_ACCOUNT,
            description: A.AccountOperationSchemaDescription,
            inputSchema: A.AccountOperationSchemaInput()  as ToolInput,

        },
        {
            name: A.ToolName.OP_PERMISSION,
            description: A.CallPermissionSchemaDescription,
            inputSchema: A.CallPermissionSchemaInput()  as ToolInput,
        },
        {
            name: A.ToolName.OP_MACHINE,
            description: A.CallMachineSchemaDescription,
            inputSchema: A.CallMachineSchemaInput()  as ToolInput,
        },
        {
            name: A.ToolName.OP_SERVICE,
            description: A.CallServiceSchemaDescription,
            inputSchema: A.CallServiceSchemaInput()  as ToolInput,
        },
        {
            name: A.ToolName.OP_PERSONAL,
            description: A.CallPersonalSchemaDescription,
            inputSchema: A.CallPersonalSchemaInput() as ToolInput,
        },
        {
            name: A.ToolName.OP_ARBITRATION,
            description: A.CallArbitrationSchemaDescription,
            inputSchema: A.CallArbitrationSchemaInput()  as ToolInput,
        },
        {
            name: A.ToolName.OP_REPLACE_PERMISSION_OBJECT,
            description: A.CallObejctPermissionSchemaDescription,
            inputSchema: A.CallObejctPermissionSchemaInput()  as ToolInput,
        },
        {
            name: A.ToolName.OP_TREASURY,
            description: A.CallTreasurySchemaDescription,
            inputSchema: A.CallTreasurySchemaInput()  as ToolInput,
        },
        {
            name: A.ToolName.OP_REPOSITORY,
            description: A.CallRepositorySchemaDescription,
            inputSchema: A.CallRepositorySchemaInput()  as ToolInput,
        },
        {
            name: A.ToolName.OP_DEMAND,
            description: A.CallDemandSchemaDescription,
            inputSchema: A.CallDemandSchemaInput()  as ToolInput,
        },
        {
            name: A.ToolName.OP_GUARD,
            description: A.CallGuardSchemaDescription,
            inputSchema: A.CallGuardSchemaInput() as ToolInput,
        },
    ]

    const transport = new StdioServerTransport();
    server.setRequestHandler(ListResourcesRequestSchema, async () => {
        return {resources:RESOURCES}
    });

    server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => {
        return {resourceTemplates:RESOURCES_TEMPL}
    });

    server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
        const uri: string = request.params.uri;
        const uri_lower = uri.toLocaleLowerCase();

        if (uri_lower.startsWith("wowok://${toolName.QUERY_WOWOK_PROTOCOL}")) {
            const ret = {built_in_permissions: A.WOWOK.PermissionInfo, guard_query_commands: A.WOWOK.GUARD_QUERIES};
            return {tools:[], contents:[{uri:uri, text:JSON.stringify(ret)}]}
        } else if (uri_lower.startsWith("wowok://objects/")) {
            var query = A.parseUrlParams<A.ObjectsQuery>(uri);
            query.objects = query.objects.filter(v => A.WOWOK.IsValidAddress(v));
            const r = await A.query_objects(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===A.ToolName.QUERY_OBJECTS)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri_lower.startsWith("wowok://permissions/")) {
            const query = A.parseUrlParams<A.PermissionQuery>(uri);
            const r = await A.query_permission(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===A.ToolName.QUERY_PERMISSIONS)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri_lower.startsWith("wowok://personal/")) {
            const query = A.parseUrlParams<A.PersonalQuery>(uri);
            const r = await A.query_personal(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===A.ToolName.QUERY_PERSONAL)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri_lower.startsWith(`wowok://${A.ToolName.QUERY_TABLE_ITEMS_LIST}`)) {
            const query = A.parseUrlParams<A.TableQuery>(uri);
            const r = await A.query_table(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===A.ToolName.QUERY_TABLE_ITEMS_LIST)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri_lower.startsWith("wowok://table_item/arb/")) {
            const query = A.parseUrlParams<A.QueryTableItem_Address>(uri);
            const r = await A.queryTableItem_ArbVoting(query);
            return {tools:[], content:[JSON.stringify(r)]}
        } else if (uri.startsWith("wowok://table_item/demand/")) {
            const query = A.parseUrlParams<A.QueryTableItem_Address>(uri);
            const r = await A.queryTableItem_DemandService(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===A.ToolName.QUERY_DEMAND_SERVICE)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri_lower.startsWith("wowok://table_item/service/")) {
            const query = A.parseUrlParams<A.QueryTableItem_Name>(uri);
            const r = await A.queryTableItem_ServiceSale(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===A.ToolName.QUERY_SERVICE_SALE)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri_lower.startsWith("wowok://table_item/machine/")) {
            const query = A.parseUrlParams<A.QueryTableItem_Name>(uri);
            const r = await A.queryTableItem_MachineNode(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===A.ToolName.QUERY_MACHINE_NODE)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri_lower.startsWith("wowok://table_item/repository/")) {
            const query = A.parseUrlParams<A.QueryTableItem_AddressName>(uri);
            const r = await A.queryTableItem_RepositoryData(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===A.ToolName.QUERY_REPOSITORY_DATA)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri_lower.startsWith("wowok://table_item/permission/")) {
            const query = A.parseUrlParams<A.QueryTableItem_Address>(uri);
            const r = await A.queryTableItem_PermissionEntity(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===A.ToolName.QUERY_PERMISSION_ENTITY)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri_lower.startsWith("wowok://table_item/personalmark/")) {
            const query = A.parseUrlParams<A.QueryTableItem_Address>(uri);
            const r = await A.queryTableItem_MarkTag(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===A.ToolName.QUERY_PERSONAL_MARK)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri_lower.startsWith("wowok://table_item/treasury/")) {
            const query = A.parseUrlParams<A.QueryTableItem_Index>(uri);
            const r = await A.queryTableItem_TreasuryHistory(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===A.ToolName.QUERY_TREASURY_HISTORY)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri_lower.startsWith("wowok://table_item/progress/")) {
            const query = A.parseUrlParams<A.QueryTableItem_Index>(uri);
            const r = await A.queryTableItem_ProgressHistory(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===A.ToolName.QUERY_PROGRESS_HISTORY)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri_lower.startsWith("wowok://events/")) {
            const query = A.parseUrlParams<EventParam>(uri);
            const r = await A.query_events({type:query.type as any, 
                cursor:query.cursor_eventSeq && query.cursor_txDigest ? {eventSeq:query.cursor_eventSeq, txDigest:query.cursor_txDigest} : undefined,
                limit:query.limit, order: query.order === 'descending' || query.order === 'desc' ? 'descending' : 'ascending'});
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===A.ToolName.QUERY_EVENTS)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri_lower.startsWith("wowok://local_mark/list")) {
            return {tools:[], contents:[{uri:uri, text:JSON.stringify(await A.query_local_mark_list())}]}
        } else if (uri_lower.startsWith("wowok://local_info/list")) {
            return {tools:[], contents:[{uri:uri, text:JSON.stringify(await A.query_local_info_list())}]} 
        } else if (uri_lower.startsWith("wowok://account/list")) {
            return {tools:[], contents:[{uri:uri, text:JSON.stringify(await A.query_account_list())}]}    
        } else if (uri_lower.startsWith("wowok://treasury_received/")) {
            const query = A.parseUrlParams<A.QueryReceived>(uri);  
            return {tools:[], contents:[{uri:uri, text:JSON.stringify(await A.query_received(query))}]}    
        } else if (uri_lower.startsWith('wowok://local_mark/filter/')) {
            const query = A.parseUrlParams<A.LocalMarkFilter>(uri);  
            server.sendLoggingMessage({level:'info', message:JSON.stringify(query)})
            const r = await A.query_local_mark_list(query)
            return {tools:[], contents:[{uri:uri, text:JSON.stringify(r)}]}
        } else if (uri_lower.startsWith("wowok://local_mark/")) {
            const query = A.parseUrlParams<{name:string}>(uri);   
            const r = await A.query_local_mark(query.name);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===A.ToolName.QUERY_LOCAL_MARK)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri_lower.startsWith("wowok://local_info/")) {     
            const query = A.parseUrlParams<{name:string}>(uri);   
            const r = await A.query_local_info(query.name);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===A.ToolName.QUERY_LOCAL_INFO)!, {uri:uri, text:JSON.stringify(r)});
            return {tools:[], contents:[content]}
        } else if (uri_lower.startsWith("wowok://account/")) {
            const query = A.parseUrlParams<A.QueryAccount>(uri); 
            const r = await A.query_account(query);
            const content = Object.assign(RESOURCES_TEMPL.find(v=>v.name===A.ToolName.QUERY_ACCOUNT)!, {uri:uri, text:JSON.stringify(r)});    
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
            case A.ToolName.QUERY_WOWOK_PROTOCOL: {
                const r = A.QueryWowokProtocolSchema.parse(request.params.arguments);
                if (r.name === A.WOWOK_PROTOCOL_INFO.BuiltInPermissions) {
                    return { content: [{ type: "text", text: JSON.stringify(A.WOWOK.PermissionInfo) }],}
                } else if (r.name === A.WOWOK_PROTOCOL_INFO.GuardQueryCommands) {   
                    return { content: [{ type: "text", text: JSON.stringify(A.WOWOK.PermissionInfo) }],}
                }

                return {
                    content: [{ type: "text", text: 'Invalid query name for WOWOK protocol: ' + r.name }],
                };
            }

            case A.ToolName.QUERY_OBJECTS: {
              const args = A.QueryObjectsSchema.parse(request.params.arguments);
              const r = await A.query_objects(args);
              return {
                content: [{ type: "text", text: JSON.stringify(r) }],
              };
            }
      
            case A.ToolName.QUERY_EVENTS: {
                const args = A.QueryEventSchema.parse(request.params.arguments);
                const r = await A.query_events(args);
                return {
                  content: [{ type: "text", text: JSON.stringify(r) }],
                };
            }
      
            case A.ToolName.QUERY_PERMISSIONS: {
                const args = A.QueryPermissionSchema.parse(request.params.arguments);
                const r = await A.query_permission(args);
                return {
                  content: [{ type: "text", text: JSON.stringify(r) }],
                };
            }

            case A.ToolName.QUERY_PERSONAL: {
                const args = A.QueryPersonalSchema.parse(request.params.arguments);
                const r = await A.query_personal(args);
                return {
                    content: [{ type: "text", text: JSON.stringify(r) }],
                };
            }
            
            case A.ToolName.QUERY_TABLE_ITEMS_LIST: {
                const args = A.QueryTableItemsSchema.parse(request.params.arguments);
                const r = await A.query_table(args);
                return {
                    content: [{ type: "text", text: JSON.stringify(r) }],
                };
            }
            
            case A.ToolName.QUERY_TABLE_ITEM: {
                const args = A.QueryTableItemSchema.parse(request.params.arguments);
                switch (args.query.name) {
                    case 'arb': 
                        const arb = A.QueryByAddressSchema.parse(args.query.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await A.queryTableItem_ArbVoting(arb)) }],
                        };
                    case "treasury":
                        const treasury = A.QueryByIndexSchema.parse(args.query.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await A.queryTableItem_TreasuryHistory(treasury)) }],
                        };
                    case "service":
                        const service = A.QueryByNameSchema.parse(args.query.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await A.queryTableItem_ServiceSale(service)) }],
                        };
                    case "demand":
                        const demand = A.QueryByAddressSchema.parse(args.query.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await A.queryTableItem_DemandService(demand)) }],
                        };
                    case "machine":
                        const machine = A.QueryByNameSchema.parse(args.query.data);
                        return {
                          content: [{ type: "text", text: JSON.stringify(await A.queryTableItem_MachineNode(machine)) }],
                        };
                    case "personalmark":
                        const personalmark = A.QueryByAddressSchema.parse(args.query.data);
                        return {
                          content: [{ type: "text", text: JSON.stringify(await A.queryTableItem_MarkTag(personalmark)) }],
                        };
                    case "permission":
                        const permission = A.QueryByAddressSchema.parse(args.query.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await A.queryTableItem_PermissionEntity(permission)) }],
                        };
                    case "repository":
                        const repository = A.QueryByAddressNameSchema.parse(args.query.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await A.queryTableItem_RepositoryData(repository)) }],
                        };
                    case "progress":
                        const progress = A.QueryByIndexSchema.parse(args.query.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await A.queryTableItem_ProgressHistory(progress)) }],
                        };
                    default: 
                        A.WOWOK.ERROR(A.WOWOK.Errors.InvalidParam, 'Invalid table item query name')
                }
            }

            case A.ToolName.QUERY_RECEIVED: {
                const args = A.QueryReceivedSchema.parse(request.params.arguments);
                const r = await A.query_received(args);
                return {
                    content: [{ type: "text", text: JSON.stringify(r) }],
                };
            }

            case A.ToolName.QUERY_LOCAL: {
                const args = A.QueryLocalSchema.parse(request.params.arguments);
                switch(args.query.name) {
                    case "account_list": 
                        const account_list = A.AccountListSchema.parse(args.query.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await A.query_account_list(account_list?.showSuspendedAccount)) }],
                        };
                    case "info_list":
                        return {
                            content: [{ type: "text", text: JSON.stringify(await A.query_local_info_list()) }],
                        };
                    case "mark_list":
                        const mark_list = A.LocalMarkFilterSchema.parse(args.query.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await A.query_local_mark_list(mark_list)) }],
                        };
                    case "account":
                        const account = A.QueryAccountSchema.parse(args.query.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await A.query_account(account)) }],
                        }
                    case "mark":
                        const mark = A.QueryLocalMarkSchema.parse(args.query.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await A.query_local_mark(mark.name)) }],
                        }
                    case "info":
                        const info = A.QueryLocalInfoSchema.parse(args.query.data);
                        return {
                            content: [{ type: "text", text: JSON.stringify(await A.query_local_info(info.name)) }],
                        }
                    default:
                        A.WOWOK.ERROR(A.WOWOK.Errors.InvalidParam, 'Invalid local query name')
                }
            }    
             
            case A.ToolName.OP_PERSONAL: {
                const args = A.CallPersonalSchema.parse(request.params.arguments);
                return {
                    content: [{ type: "text", text: JSON.stringify(await A.call_personal(args)) }],
                };
            }

            case A.ToolName.OP_MACHINE: {
                const args = A.CallMachineSchema.parse(request.params.arguments);
                return {
                    content: [{ type: "text", text: JSON.stringify(await A.call_machine(args)) }],    
                };
            }

            case A.ToolName.OP_SERVICE: {
                const args = A.CallServiceSchema.parse(request.params.arguments);
                return {
                    content: [{ type: "text", text: JSON.stringify(await A.call_service(args)) }],
                };
            }

            case A.ToolName.OP_PERMISSION: {
                const args = A.CallPermissionSchema.parse(request.params.arguments);
                return {
                    content: [{ type: "text", text: JSON.stringify(await A.call_permission(args)) }],
                };
            }

            case A.ToolName.OP_ARBITRATION: {
                const args = A.CallArbitrationSchema.parse(request.params.arguments);
                return {
                    content: [{ type: "text", text: JSON.stringify(await A.call_arbitration(args)) }],
                };
            }

            case A.ToolName.OP_REPLACE_PERMISSION_OBJECT: {
                const args = A.CallObejctPermissionSchema.parse(request.params.arguments);
                return {
                    content: [{ type: "text", text: JSON.stringify(await A.call_transfer_permission(args)) }],
                };
            }

            case A.ToolName.OP_TREASURY: {
                const args = A.CallTreasurySchema.parse(request.params.arguments);
                return {
                    content: [{ type: "text", text: JSON.stringify(await A.call_treasury(args)) }],
                };
            }

            case A.ToolName.OP_REPOSITORY: {
                const args = A.CallRepositorySchema.parse(request.params.arguments);
                return {
                    content: [{ type: "text", text: JSON.stringify(await A.call_repository(args)) }],
                };
            }

            case A.ToolName.OP_DEMAND: {
                const args = A.CallDemandSchema.parse(request.params.arguments);
                return {
                    content: [{ type: "text", text: JSON.stringify(await A.call_demand(args)) }],
                };
            }

            case A.ToolName.OP_GUARD: {
                const args = A.CallGuardSchema.parse(request.params.arguments);
                return {
                    content: [{ type: "text", text: JSON.stringify(await A.call_guard(args)) }],
                };
            }

            case A.ToolName.OP_ACCOUNT: {
                const args = A.AccountOperationSchema.parse(request.params.arguments);
                return {
                    content: [{ type: "text", text: JSON.stringify(await A.account_operation(args)) }],
                };
            }

            case A.ToolName.OP_LOCAL_MARK: {
                const args = A.LocalMarkOperationSchema.parse(request.params.arguments);
                await A.local_mark_operation(args);
                return {
                    content: [{ type: "text", text: 'success'}],
                };
            }

            case A.ToolName.OP_LOCAL_INFO: {
                const args = A.LocalInfoOperationSchema.parse(request.params.arguments);
                await A.local_info_operation(args);       
                return {
                    content: [{ type: "text", text: 'success'}],
                };  
            }

            default:
              throw new Error(`Unknown tool: ${request.params.name}`);
          }
        } catch (error) { 
            throw new Error(`Invalid input: ${JSON.stringify(error)}`);
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