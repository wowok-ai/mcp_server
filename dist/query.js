import { z } from "zod";
export const QueryObjectsSchema = z.object({
    objects: z.array(z.string()).describe("Wowok object address."),
    showType: z.boolean().optional().describe("Whether to show the type of the object."),
    showContent: z.boolean().optional().describe("Whether to show the content of the object."),
    showOwner: z.boolean().optional().describe("Whether to show the owner of the object."),
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
}).describe('Query table data for a wowok object (parent field definition).');
export const QueryTableItemSchema = z.object({
    parent: z.string().describe("Wowok object address that owns the table item."),
    key: z.object({
        type: z.string().describe("Type of the value."),
        value: z.unknown().describe('Value.')
    }).describe('The query key'),
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
    type: z.enum(['OnNewArb', 'OnPresentService', 'OnNewProgress', 'OnNewOrder']).describe("Type of Events."),
    cursor: EventCursorSchema.optional().nullable().describe('Paging cursor.'),
    limit: z.number().optional().nullable().describe('Mmaximum number of items per page, default to 50 if not specified.'),
    order: z.enum(['ascending', 'descending']).optional().nullable().describe('Query result ordering, default to "ascending order", oldest record first.')
}).describe('Query event data');
