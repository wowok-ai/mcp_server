import { z } from "zod";
export const Demand_TableItems_List_Description = `Retrieves paginated table data records from an on-chain Demand object. 
Input parameters include: parent (address or name of the Demand object), cursor (optional pagination cursor to start from a specific position), limit (maximum number of records per page, default 50), and no_cache (boolean flag to bypass local cache for fresh data). 
Returns an array of table items containing detailed record information such as timestamps, transaction digests, and associated entity details, structured for efficient data retrieval and processing.`;
export const Arb_TableItems_List_Description = `Retrieves paginated table data records from an on-chain Arb object.
Input parameters include: parent (address or name of the Arb object), cursor (optional pagination cursor to start from a specific position), limit (maximum number of records per page, default 50), and no_cache (boolean flag to bypass local cache for fresh data).
Returns a list of arbitration vote entries, each including the voter address, voting weight, and list of voting claims, structured to enable transparent tracking of the arbitration voting process.`;
export const Machine_TableItems_List_Description = `Retrieves paginated table data records from an on-chain Progress object.
Input parameters include: parent (address or name of the Machine object), cursor (optional pagination cursor to start from a specific position), limit (maximum number of records per page, default 50), and no_cache (boolean flag to bypass local cache for fresh data). 
Returns a list of node entries, where each entry contains detailed information such as node name, a list of all operation paths from the previous node to the current node, and other relevant metadata for comprehensive node tracking and analysis.`;
export const PersonalMark_TableItems_List_Description = `Retrieves paginated table data records from an on-chain PersonalMark object.
Input parameters include: parent (address or name of the PersonalMark object), cursor (optional pagination cursor to start from a specific position), limit (maximum number of records per page, default 50), and no_cache (boolean flag to bypass local cache for fresh data).
Returns a list of address entries, where each entry contains the assigned name (human-readable string) and associated tags (array of categorical strings) for the queried address, enabling clear address labeling and efficient organization.`;
export const Permission_TableItems_List_Description = `Retrieves paginated table data records from an on-chain Permission object.
Input parameters include: parent (address or name of the Permission object), cursor (optional pagination cursor to start from a specific position), limit (maximum number of records per page, default 50), and no_cache (boolean flag to bypass local cache for fresh data).
Returns a list of permissions, where each entry includes: the entity address, its permission list (comprising both wowok-defined permissions and custom permissions), and optional additional Guard verification constraints.`;
export const Repository_TableItems_List_Description = `Retrieves paginated table data records from an on-chain Repository object.
Input parameters include: parent (address or name of the Repository object), cursor (optional pagination cursor to start from a specific position), limit (maximum number of records per page, default 50), and no_cache (boolean flag to bypass local cache for fresh data).
Returns a list of stored data entries, where each entry contains: data fields (with the first character indicating Wowok-defined base data type codes), searchable data address, and field name (as specified by the Repository's policy for consistent data identification).`;
export const Progress_TableItems_List_Description = `Retrieves paginated table data records from an on-chain Progress object.
Input parameters include: parent (address or name of the Progress object), cursor (optional pagination cursor to start from a specific position), limit (maximum number of records per page, default 50), and no_cache (boolean flag to bypass local cache for fresh data).
Returns an array of workflow node entries, where each entry contains: previous node name, next node name, occurrence timestamp, and a list of session records (each including operator address and detailed operation behavior logs).`;
export const Service_TableItems_List_Description = `Retrieves paginated table data records from an on-chain Service object.
Input parameters include: parent (address or name of the Service object), cursor (optional pagination cursor to start from a specific position), limit (maximum number of records per page, default 50), and no_cache (boolean flag to bypass local cache for fresh data).
Returns a list of product items, each containing product name, optional info endpoint URL, price, and stock quantity.`;
export const Treasury_TableItems_List_Description = `Retrieves paginated table data records from an on-chain Treasury object.
Input parameters include: parent (address or name of the Treasury object), cursor (optional pagination cursor to start from a specific position), limit (maximum number of records per page, default 50), and no_cache (boolean flag to bypass local cache for fresh data).
Returns a list of financial transaction records, each containing operation code, operator, the Payment address (bill details), total amount, and transaction timestamp.`;
export const Query_TableItems_List_Description = `Retrieves paginated table data records from an on-chain object. 
Input parameters include: parent (address or name of the object), cursor (optional pagination cursor to start from a specific position), limit (maximum number of records per page, default 50), and no_cache (boolean flag to bypass local cache for fresh data).
The query automatically identifies the object type (one of Permission, Machine, Treasury, Repository, Service, Progress, Arb, PersonalMark or Demand) and returns data equivalent to the table data list query for that specific object type. It is applicable when the object type of the given address or name is unknown, with the query result's metadata containing the object's type information.`;
export const QueryObjectsSchemaDescription = `Query the on-chain data of specified wowok objects. 
Input parameters include an array of object addresses and a no-cache flag (to bypass local cache). 
Returns detailed on-chain content data(excluding table data) for each queried object, enabling accurate and up-to-date data retrieval`;
export const QueryObjectsSchema = z.object({
    objects: z.array(z.string()).describe("Wowok object addresses."),
    no_cache: z.boolean().optional().describe("Whether to not use local cache data."),
}).describe(QueryObjectsSchemaDescription);
export const QueryPersonalSchemaDescription = `Query the on-chain personal data by its address.
    The Personal object contains public information such as the user's homepage URL, social media accounts, avatar, likes and favorites, and object naming tags.`;
export const QueryPersonalSchema = z.object({
    address: z.string().describe("Personal address to query."),
    no_cache: z.boolean().optional().describe("Whether to not use local cache data."),
}).describe(QueryPersonalSchemaDescription);
export const QueryTableItemsSchema = z.object({
    parent: z.string().describe("The address or name of the on-chain object that owns the table."),
    cursor: z.string().optional().nullable().describe("An optional paging cursor. " +
        "If provided, the query will start from the next item after the specified cursor. " +
        "Default to start from the first item if not specified."),
    limit: z.number().optional().nullable().describe("Maximum item returned per page, default to 50 if not specified."),
    no_cache: z.boolean().optional().describe("Whether to not use local cache data."),
}).describe(Query_TableItems_List_Description);
export const QueryDemandTableItemsSchema = QueryTableItemsSchema.describe(Demand_TableItems_List_Description);
export const QueryArbTableItemsSchema = QueryTableItemsSchema.describe(Arb_TableItems_List_Description);
export const QueryMachineTableItemsSchema = QueryTableItemsSchema.describe(Machine_TableItems_List_Description);
export const QueryPersonalMarkTableItemsSchema = QueryTableItemsSchema.describe(PersonalMark_TableItems_List_Description);
export const QueryPermissionTableItemsSchema = QueryTableItemsSchema.describe(Permission_TableItems_List_Description);
export const QueryRepositoryTableItemsSchema = QueryTableItemsSchema.describe(Repository_TableItems_List_Description);
export const QueryProgressTableItemsSchema = QueryTableItemsSchema.describe(Progress_TableItems_List_Description);
export const QueryServiceTableItemsSchema = QueryTableItemsSchema.describe(Service_TableItems_List_Description);
export const QueryTreasuryTableItemsSchema = QueryTableItemsSchema.describe(Treasury_TableItems_List_Description);
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
export const QueryEventSchemaDescription = `Retrieves paginated on-chain event data using an optional cursor, including event type, timestamp, transaction digest, and associated entity details. Supports no-cache flag for fresh data retrieval. Event type definitions: - OnNewArb: Triggered when a new arbitration request (corresponding to a new Arb object) is created in the Wowok protocol. - OnPresentService: Triggered when a new service is recommended to a Demand object in the Wowok protocol. - OnNewProgress: Triggered when a new task progress record (corresponding to a new Progress object) is created in the Wowok protocol. - OnNewOrder: Triggered when a new order (corresponding to a new Order object) is created in the Wowok protocol. These events are global to the Wowok protocol. For querying events specific to a certain object, directly use the table items list query for that object (refer to the table items list query documentation for details). Event generation and querying do not replace actual operations. For user requests involving operations, always initiate the corresponding operation to the target object first (refer to the operation documentation of relevant objects).`;
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
