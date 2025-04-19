import { z } from "zod";
export const QueryObjectsSchema = z.object({
    objects: z.array(z.string()).describe("Wowok object addresses."),
    no_cache: z.boolean().optional().describe("Whether to not use local cache data."),
}).describe('Query the data of a wowok object.');
export const QueryPersonalSchema = z.object({
    address: z.string().describe("Personal address to query."),
    no_cache: z.boolean().optional().describe("Whether to not use local cache data."),
}).describe('Query the personal/user address data.');
export const QueryTableItemsSchema = z.object({
    parent: z.string().describe("Wowok object address that owns the table."),
    cursor: z.string().optional().nullable().describe("An optional paging cursor. " +
        "If provided, the query will start from the next item after the specified cursor. " +
        "Default to start from the first item if not specified."),
    limit: z.number().optional().nullable().describe("Maximum item returned per page, default to 50 if not specified."),
    no_cache: z.boolean().optional().describe("Whether to not use local cache data."),
}).describe('Query table data for a wowok object (parent field definition).');
export const QueryTableItemSchema = z.object({
    parent: z.string().describe("Wowok object address that owns the table item."),
    key: z.object({
        type: z.string().describe("Type of the value."),
        value: z.unknown().describe('Value.')
    }).describe('The query key'),
    no_cache: z.boolean().optional().describe("Whether to not use local cache data."),
}).describe("Query a piece of data in a wowok object (parent field definition) data table by using the query key.");
export const QueryPermissionSchema = z.object({
    permission_object: z.string().describe("Wowok Permission object address."),
    address: z.string().describe("Address you want to query permission.")
}).describe('Query all permissions for an address from the Permission object.');
export const EventCursorSchema = z.object({
    eventSeq: z.string().describe('Event sequence.'),
    txDigest: z.string().describe('Transaction Digest.'),
}).describe('Event retrieval cursor');
export const QueryEventSchema = z.object({
    type: z.enum(['OnNewArb', 'OnPresentService', 'OnNewProgress', 'OnNewOrder']).describe("Type of Events: OnNewArb, OnPresentService, OnNewProgress, OnNewOrder"),
    cursor: EventCursorSchema.optional().nullable().describe('Paging cursor.'),
    limit: z.number().optional().nullable().describe('Mmaximum number of items per page, default to 50 if not specified.'),
    order: z.enum(['ascending', 'descending']).optional().nullable().describe('Query result ordering, default to "ascending order", oldest record first.')
}).describe('Query event data');
export const QueryByAddressSchema = z.object({
    parent: z.string().nonempty().describe("The address of the parent object that owns the table."),
    address: z.string().nonempty().describe('The query key(address) of the table item.'),
    no_cache: z.boolean().optional().describe("Whether to not use local cache data."),
}).describe("Query the Service object recommended by someone from the Demand object.");
export const QueryByNameSchema = z.object({
    parent: z.string().nonempty().describe("The address of the parent object that owns the table."),
    name: z.string().nonempty().describe('The query key(name) of the table item.'),
    no_cache: z.boolean().optional().describe("Whether to not use local cache data."),
}).describe('Query the table item by name from the object.');
export const QueryByIndexSchema = z.object({
    parent: z.string().nonempty().describe("The address of the parent object that owns the table."),
    index: z.number().int().min(0).describe('The query key(index) of the table item. Auto-incrementing index starting at 0.'),
    no_cache: z.boolean().optional().describe("Whether to not use local cache data."),
}).describe("Query the table item by index from the object.");
export const QueryByAddressNameSchema = z.object({
    parent: z.string().nonempty().describe("The Repository object that owns the table."),
    address: z.union([
        z.string().nonempty().describe('The address that own the data. '),
        z.number().int().min(0).describe('number converted to address, such as time.')
    ]),
    name: z.string().nonempty().describe('Data field name.'),
    no_cache: z.boolean().optional().describe("Whether to not use local cache data."),
}).describe('Query the data by the address and the name from the Repository object.');
