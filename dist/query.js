import { z } from "zod";
export const QueryObjectsSchemaDescription = `Query the on-chain data of a wowok object.`;
export const QueryObjectsSchema = z.object({
    objects: z.array(z.string()).describe("Wowok object addresses."),
    no_cache: z.boolean().optional().describe("Whether to not use local cache data."),
}).describe(QueryObjectsSchemaDescription);
export const QueryPersonalSchemaDescription = `Query the on-chain personal data by its address.`;
export const QueryPersonalSchema = z.object({
    address: z.string().describe("Personal address to query."),
    no_cache: z.boolean().optional().describe("Whether to not use local cache data."),
}).describe(QueryPersonalSchemaDescription);
export const QueryTableItemsSchemaDescription = `Query the on-chain table data for a wowok object (parent field definition).`;
export const QueryTableItemsSchema = z.object({
    parent: z.string().describe("The address or name of the on-chain object that owns the table."),
    cursor: z.string().optional().nullable().describe("An optional paging cursor. " +
        "If provided, the query will start from the next item after the specified cursor. " +
        "Default to start from the first item if not specified."),
    limit: z.number().optional().nullable().describe("Maximum item returned per page, default to 50 if not specified."),
    no_cache: z.boolean().optional().describe("Whether to not use local cache data."),
}).describe(QueryTableItemsSchemaDescription);
export const QueryTableItemSchemaDescription = `Query a piece of on-chain data in a wowok object (parent field definition) data table by using the query key.`;
export const QueryTableItemSchema = z.object({
    parent: z.string().describe("The address or name of the on-chain object that owns the table."),
    key: z.object({
        type: z.string().describe("Type of the value."),
        value: z.unknown().describe('Value.')
    }).describe('The query key'),
    no_cache: z.boolean().optional().describe("Whether to not use local cache data."),
}).describe(QueryTableItemSchemaDescription);
export const QueryPermissionSchemaDescription = `Query the permission list corresponding to a specific entity from the on-chain Permission object.`;
export const QueryPermissionSchema = z.object({
    object_address_or_name: z.string().describe("The address or name of the Permission object."),
    entity_address_or_name: z.string().describe('The address or name of the entity to query.'),
}).describe(QueryPermissionSchemaDescription);
export const EventCursorSchema = z.object({
    eventSeq: z.string().describe('Event sequence.'),
    txDigest: z.string().describe('Transaction Digest.'),
}).describe('Event retrieval cursor');
export const QueryEventSchemaDescription = `Query the on-chain event data.`;
export const QueryEventSchema = z.object({
    type: z.enum(['OnNewArb', 'OnPresentService', 'OnNewProgress', 'OnNewOrder']).describe("Type of Events: OnNewArb, OnPresentService, OnNewProgress, OnNewOrder"),
    cursor: EventCursorSchema.optional().nullable().describe('Paging cursor.'),
    limit: z.number().optional().nullable().describe('Mmaximum number of items per page, default to 50 if not specified.'),
    order: z.enum(['ascending', 'descending']).optional().nullable().describe('Query result ordering, default to "ascending order", oldest record first.')
}).describe(QueryEventSchemaDescription);
export const QueryByAddressSchema = z.object({
    parent: z.string().describe("The address or name of the on-chain object that owns the table."),
    address: z.string().nonempty().describe('The query key(address) of the table item.'),
    no_cache: z.boolean().optional().describe("Whether to not use local cache data."),
}).describe("Query the table item by address from the on-chain object.");
export const QueryByNameSchema = z.object({
    parent: z.string().describe("The address or name of the on-chain object that owns the table."),
    name: z.string().nonempty().describe('The query key(name) of the table item.'),
    no_cache: z.boolean().optional().describe("Whether to not use local cache data."),
}).describe('Query the table item by name from the on-chain object.');
export const QueryByIndexSchema = z.object({
    parent: z.string().nonempty().describe("The address of the on-chain object that owns the table."),
    index: z.number().int().min(0).describe('The query key(index) of the table item. Auto-incrementing index starting at 0.'),
    no_cache: z.boolean().optional().describe("Whether to not use local cache data."),
}).describe("Query the table item by index from the on-chain object.");
export const QueryByAddressNameSchema = z.object({
    parent: z.string().describe("The address or name of the on-chain object that owns the table."),
    address: z.union([
        z.string().nonempty().describe('The address that own the data. '),
        z.number().int().min(0).describe('number converted to address, such as time.')
    ]),
    name: z.string().nonempty().describe('Data field name.'),
    no_cache: z.boolean().optional().describe("Whether to not use local cache data."),
}).describe('Query the data by the address and the name from the on-chain Repository object.');
