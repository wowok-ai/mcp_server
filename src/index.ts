import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport,  } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, Tool, ToolSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { query_objects, WOWOK, query_events, query_permission, query_table, call_guard, call_demand, call_machine, call_service, call_treasury, 
  call_arbitration, call_permission, call_personal, call_transfer_permission, call_repository,  } from 'wowok_agent';
import { QueryObjectsSchema, QueryEventSchema, QueryPermissionSchema, QueryTableItemsSchema, QueryPersonalSchema, QueryTableItemSchema,
} from './query.js';
import { CallArbitrationDataSchema, CallArbitrationSchema, CallDemandDataSchema, CallDemandSchema, CallGuardDataSchema, CallGuardSchema, CallMachineDataSchema, CallMachineSchema, CallObejctPermissionSchema, CallObjectPermissionDataSchema,
    CallPermissionDataSchema, CallPermissionSchema, CallPersonalDataSchema, CallPersonalSchema, CallRepositoryDataSchema, CallRepositorySchema, CallServiceDataSchema, CallServiceSchema, CallTreasuryDataSchema,
    CallTreasurySchema,
 } from "./call.js";

const ToolInputSchema = ToolSchema.shape.inputSchema;
type ToolInput = z.infer<typeof ToolInputSchema>;

export enum ToolName {
    QUERY_OBJECTS = 'query objects',
    QUERY_EVENTS = 'query events',
    QUERY_PERMISSIONS = 'query permissions',
    QUERY_TABLE_ITEMS = 'query table items', 
    QUERY_TABLE_ITEM = 'query a table item',
    QUERY_PERSONAL = 'query presonal infomation',
    OP_PERSONAL = 'personal operations',
    OP_MACHINE = 'machine operations',
    OP_SERVICE = 'service operations',
    OP_PERMISSION = 'permission operations',
    OP_TREASURY = 'treasury operations',
    OP_ARBITRATION = 'arbitration operations',
    OP_REPOSITORY = 'repository operations',
    OP_GUARD = 'guard operations',
    OP_DEMAND = 'demand operations',
    OP_REPLACE_PERMISSION_OBJECT = 'replace permission object'
}

// Create server instance
const server = new Server({
    name: "wowok",
    version: "1.0.0",
  },{
    capabilities: {
      prompts: {},
      resources: { subscribe: true },
      tools: {},
      logging: {},
    },
},);

async function main() {
    const transport = new StdioServerTransport();
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        const tools: Tool[] = [
            {
                name: ToolName.QUERY_OBJECTS,
                description: "query wowok objects",
                inputSchema: zodToJsonSchema(QueryObjectsSchema)  as ToolInput,
            },
            {
                name: ToolName.QUERY_EVENTS,
                description: "query wowok events",
                inputSchema: zodToJsonSchema(QueryEventSchema)  as ToolInput,
            },
            {
                name: ToolName.QUERY_PERMISSIONS,
                description: "query permissions of an address from the wowok Permission object",
                inputSchema: zodToJsonSchema(QueryPermissionSchema)  as ToolInput,
            },
            {
                name: ToolName.QUERY_TABLE_ITEMS,
                description: "query records of table data owned by the wowok object",
                inputSchema: zodToJsonSchema(QueryTableItemsSchema)  as ToolInput,
            },
            {
                name: ToolName.QUERY_TABLE_ITEM,
                description: "query a record of table data owned by the wowok object",
                inputSchema: zodToJsonSchema(QueryTableItemSchema)  as ToolInput,
            },
            {
                name: ToolName.QUERY_PERSONAL,
                description: "query personal information for an address",
                inputSchema: zodToJsonSchema(QueryPersonalSchema)  as ToolInput,
            },
            {
                name: ToolName.OP_PERSONAL,
                description: "operations on the wowok Personal object",
                inputSchema: zodToJsonSchema(CallPersonalDataSchema)  as ToolInput,
            },
            {
                name: ToolName.OP_PERMISSION,
                description: "operations on the wowok Permission object",
                inputSchema: zodToJsonSchema(CallPermissionDataSchema)  as ToolInput,
            },
            {
                name: ToolName.OP_REPOSITORY,
                description: "operations on the wowok Repository object",
                inputSchema: zodToJsonSchema(CallRepositoryDataSchema)  as ToolInput,
            },
            {
                name: ToolName.OP_MACHINE,
                description: "operations on the wowok Machine object",
                inputSchema: zodToJsonSchema(CallMachineDataSchema)  as ToolInput,
            },
            {
                name: ToolName.OP_GUARD,
                description: "operations on the wowok Guard object",
                inputSchema: zodToJsonSchema(CallGuardDataSchema)  as ToolInput,
            },
            {
                name: ToolName.OP_SERVICE,
                description: "operations on the wowok Service object",
                inputSchema: zodToJsonSchema(CallServiceDataSchema)  as ToolInput,
            },
            {
                name: ToolName.OP_ARBITRATION,
                description: "operations on the wowok Arbitration object",
                inputSchema: zodToJsonSchema(CallArbitrationDataSchema)  as ToolInput,
            },
            {
                name: ToolName.OP_TREASURY,
                description: "operations on the wowok Treasury object",
                inputSchema: zodToJsonSchema(CallTreasuryDataSchema)  as ToolInput,
            },
            {
                name: ToolName.OP_DEMAND,
                description: "operations on the wowok Demand object",
                inputSchema: zodToJsonSchema(CallDemandDataSchema)  as ToolInput,
            },
            {
                name: ToolName.OP_REPLACE_PERMISSION_OBJECT,
                inputSchema: zodToJsonSchema(CallObjectPermissionDataSchema)  as ToolInput,
                description: 'Batch modify the Permission object of wowok objects.' + 
                    'Transaction signers need to be the owner of the original Permission object in these wowok objects in order to succeed.'
            },
        ]
        return {tools};
    });

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        try {
          if (!request.params.arguments) {
            throw new Error("Arguments are required");
          }
      
          switch (request.params.name) {
            case ToolName.QUERY_OBJECTS: {
              const args = QueryObjectsSchema.parse(request.params.arguments);
              console.log(args);
              const r = await query_objects(args);
              return {
                content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
              };
            }
      
            case ToolName.QUERY_EVENTS: {
                const args = QueryEventSchema.parse(request.params.arguments);
                console.log(args);
                const r = await query_events(args);
                return {
                  content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                };
            }
      
            case ToolName.QUERY_PERMISSIONS: {
                const args = QueryPermissionSchema.parse(request.params.arguments);
                console.log(args);
                const r = await query_permission(args);
                return {
                  content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                };
            }

            case ToolName.QUERY_PERSONAL: {
                const args = QueryPermissionSchema.parse(request.params.arguments);
                console.log(args);
                const r = await query_permission(args);
                return {
                    content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                };
            }
      
            case ToolName.QUERY_TABLE_ITEMS: {
                const args = QueryTableItemsSchema.parse(request.params.arguments);
                console.log(args);
                const r = await query_table(args);
                return {
                    content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                };
            }
      
            case ToolName.QUERY_TABLE_ITEM: {
                const args = QueryTableItemSchema.parse(request.params.arguments);
                console.log(args);
                const r = await query_table(args);
                return {
                    content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                };
            }
      
            case ToolName.OP_GUARD: {
                const args = CallGuardSchema.parse(request.params.arguments);
                console.log(args);
                const r = await call_guard(args);
                return {
                    content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                };
            }
      
            case ToolName.OP_DEMAND: {
                const args = CallDemandSchema.parse(request.params.arguments);
                console.log(args);
                const r = await call_demand(args);
                return {
                    content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                };
            }
      
            case ToolName.OP_MACHINE: {
                const args = CallMachineSchema.parse(request.params.arguments);
                console.log(args);
                const r = await call_machine(args);
                return {
                    content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                };
            }

            case ToolName.OP_SERVICE: {
                const args = CallServiceSchema.parse(request.params.arguments);
                console.log(args);
                const r = await call_service(args);
                return {
                    content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                };
            }

            case ToolName.OP_TREASURY: {
                const args = CallTreasurySchema.parse(request.params.arguments);
                console.log(args);
                const r = await call_treasury(args);
                return {
                    content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                };
            }

            case ToolName.OP_ARBITRATION: {
                const args = CallArbitrationSchema.parse(request.params.arguments);
                console.log(args);
                const r = await call_arbitration(args);
                return {
                    content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                };
            }

            case ToolName.OP_PERMISSION: {
                const args = CallPermissionSchema.parse(request.params.arguments);
                console.log(args);
                const r = await call_permission(args);
                return {
                    content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                };
            }
      
            case ToolName.OP_PERSONAL: {
                const args = CallPersonalSchema.parse(request.params.arguments);
                console.log(args);
                const r = await call_personal(args);
                return {
                    content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                };
            }

            case ToolName.OP_REPLACE_PERMISSION_OBJECT: {
                const args = CallObejctPermissionSchema.parse(request.params.arguments);
                console.log(args);
                const r = await call_transfer_permission(args);
                return {
                    content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                };
            }

            case ToolName.OP_REPOSITORY: {
                const args = CallRepositorySchema.parse(request.params.arguments);
                console.log(args);
                const r = await call_repository(args);
                return {
                    content: [{ type: "text", text: JSON.stringify(r, null, 2) }],
                };
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
    console.error("Server error:", error);
    process.exit(1);
});
