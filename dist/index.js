import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport, } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, ToolSchema } from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import { QueryObjectsSchema, QueryEventSchema, QueryPermissionSchema, QueryTableItemsSchema, QueryPersonalSchema, QueryTableItemSchema, } from './query.js';
import { CallArbitrationDataSchema, CallDemandDataSchema, CallGuardDataSchema, CallMachineDataSchema, CallObjectPermissionDataSchema, CallPermissionDataSchema, CallPersonalDataSchema, CallRepositoryDataSchema, CallServiceDataSchema, CallTreasuryDataSchema, } from "./call.js";
const ToolInputSchema = ToolSchema.shape.inputSchema;
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
async function main() {
    const transport = new StdioServerTransport();
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        const tools = [
            {
                name: 'query objects',
                description: "query wowok objects",
                inputSchema: zodToJsonSchema(QueryObjectsSchema),
            },
            {
                name: 'query events',
                description: "query wowok events",
                inputSchema: zodToJsonSchema(QueryEventSchema),
            },
            {
                name: 'query permissions',
                description: "query permissions of an address from the wowok Permission object",
                inputSchema: zodToJsonSchema(QueryPermissionSchema),
            },
            {
                name: 'query table items',
                description: "query records of table data owned by the wowok object",
                inputSchema: zodToJsonSchema(QueryTableItemsSchema),
            },
            {
                name: 'query a table item',
                description: "query a record of table data owned by the wowok object",
                inputSchema: zodToJsonSchema(QueryTableItemSchema),
            },
            {
                name: 'query presonal infomation',
                description: "query personal information for an address",
                inputSchema: zodToJsonSchema(QueryPersonalSchema),
            },
            {
                name: 'operations on the wowok Personal object',
                description: "personal information operations",
                inputSchema: zodToJsonSchema(CallPersonalDataSchema),
            },
            {
                name: 'operations on the wowok Permission object',
                description: "permission operations",
                inputSchema: zodToJsonSchema(CallPermissionDataSchema),
            },
            {
                name: 'operations on the wowok Repository object',
                description: "repository operations",
                inputSchema: zodToJsonSchema(CallRepositoryDataSchema),
            },
            {
                name: 'operations on the wowok Machine object',
                description: "machine operations",
                inputSchema: zodToJsonSchema(CallMachineDataSchema),
            },
            {
                name: 'operations on the wowok Guard object',
                description: "guard operations",
                inputSchema: zodToJsonSchema(CallGuardDataSchema),
            },
            {
                name: 'operations on the wowok Service object',
                description: "service operations",
                inputSchema: zodToJsonSchema(CallServiceDataSchema),
            },
            {
                name: 'operations on the wowok Arbitration object',
                description: "arbitration operations",
                inputSchema: zodToJsonSchema(CallArbitrationDataSchema),
            },
            {
                name: 'operations on the wowok Treasury object',
                description: "treasury operations",
                inputSchema: zodToJsonSchema(CallTreasuryDataSchema),
            },
            {
                name: 'operations on the wowok Demand object',
                description: "demand operations",
                inputSchema: zodToJsonSchema(CallDemandDataSchema),
            },
            {
                name: 'replace Permission object for the wowok objects',
                inputSchema: zodToJsonSchema(CallObjectPermissionDataSchema),
                description: 'Batch modify the Permission object of wowok objects.' +
                    'Transaction signers need to be the owner of the original Permission object in these wowok objects in order to succeed.'
            },
        ];
        return { tools };
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
