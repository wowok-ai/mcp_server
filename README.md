# wowok_mcp (MCP Server for WoWok)
Unlock Co-Creation: Right Talent, Perfect Purpose.

Github: [https://github.com/wowok-ai/wowok](https://github.com/wowok-ai/wowok)   
Wowok Agent for AI: [https://github.com/wowok-ai/wowok_agent](https://github.com/wowok-ai/wowok_agent)   
MCP Server: [https://github.com/wowok-ai/mcp_server](https://github.com/wowok-ai/mcp_server)   
Website: [https://wowok.net/](https://wowok.net/)   
Docs: [https://github.com/wowok-ai/wowok/wiki](https://github.com/wowok-ai/wowok/wiki)   
X: [https://x.com/Wowok_Ai](https://x.com/Wowok_Ai)

## Tools
### Query Wowok Objects
  Query on-chain data of Wowok objects.
  Input Parameters:
  - `objects` (string[], required): Array of Wowok object addresses to query (e.g., delivery object address).
  - `showType` (boolean, optional): Whether to display the type name, tags, and object details.
  - `showContent` (boolean, optional): Whether to show the content of the objects.
  - `showOwner` (boolean, optional): Whether to retrieve and display the owners of the objects by name or address.
  - `no_cache` (boolean, optional): Whether to not use local cache data.

### Query Wowok Events
  Query on-chain event data.
  Input Parameters:
  - `type` (string, required): Event type (must be one of: 'OnNewArb', 'OnPresentService', 'OnNewProgress', 'OnNewOrder').
  - `cursor` (object, optional): Paging cursor returned from previous query results, containing:
    - `eventSeq` (string): Event sequence number.
    - `txDigest` (string): Transaction digest.
  - `limit` (number, optional): Maximum number of items to fetch per page (default: 50).
  - `order` (string, optional): Result ordering ('ascending' or 'descending', default: 'ascending').    - `limit` (number): Maximum number of items per page, default to 50 if not specified.
    - `order` (string): 'ascending'(default), 'descending'

- **permissions**   
  Query permissions of an address from the wowok Permission object.  
  Input: 
    - `permission_object` (string, required): Wowok Permission object address.
    - `address` (string): Address you want to query permissions.


- **table_items**    
  Query records of table data owned by the wowok object (Demand, Repository, Progress, Service, Treasury, Arb, Permission, Machine, PersonalMark)  
  Input: 
    - `parent` (string, required): Wowok object address that owns the table.
    - `cursor` (string): An optional paging cursor. 
    - `limit` (number): Maximum item returned per page, default to 50 if not specified.

- **presonal_information**   
  Query personal information for an address     
  Input: 
    - `address` (string, required): Personal address to query.  
    - `no_cache` (boolean): Whether to not use local cache data.  

- **arb_table_item**   
  Query voting information for an address in the Arb object.   
  Input: 
    - `object` (string, required): The address of the Arb object.  
    - `address` (string, required): The address has voted.  

- **demand_table_item**   
  Query service recommendation information in the Demand object.   
  Input: 
    - `object` (string, required): The address of the Demand object.
    - `address` (string, required): The address of the Service object recommended by anyone.   

- **permission_table_item**   
  Query permissions for an address in the Permission object.   
  Input: 
    - `object` (string, required): The address of the Permission object.  
    - `address` (string, required): The address to query permissions.  

- **personalmark_table_item**    
  Query name and tags for an address in the PersonalMark object.   
  Input:   
    - `object` (string, required): The address of the PersonalMark object that privately owned by a user.
    - `address` (string, required): The address to query the name and tags.

- **treasury_table_item**   
  Query historical flows data in the Treasury object.   
  Input: 
    - `object` (string, required): The address of the Treasury object.
    - `number` (string, required): Historical data index. Start at 0 and add 1 for each new record.

- **qprogress_table_item**   
  Query historical sessions data in the Progress object.   
  Input:  
    - `object` (string, required): The address of the Progress object.
    - `number` (string, required): Historical data index. Start at 0 and add 1 for each new record.

- **machine_table_item**   
  Query node information in the Machine object.    
  Input: 
    - `object` (string, required): The address of the Machine object.
    - `name` (string, required): The node name.

- **service_table_item**   
  Query the current information of the item for sale in the Service object.   
  Input:   
    - `object` (string, required): The address of the Service object.
    - `name` (string, required): The sales item name.
  
- **repository_table_item**   
  Query data in the Repository object.   
  Input:   
    - `object` (string, required): The address of the Repository object.
    - `address` (string | number, required): The address(or number converted to address, such as time) that owns the data.
    - `name` (string, required): Data field name.
      
- **personal_operations**   
  Operations on the wowok Personal object  
  Input: *CallPersonalDataSchema*

- **machine_operations**   
  Operations on the wowok Machine object   
  Input: *CallMachineDataSchema*

- **service_operations**   
  Operations on the wowok Service object   
  Input: *CallServiceDataSchema*

- **permission_operations**    
  Operations on the wowok Permission object   
  Input: *CallPermissionDataSchema*

- **treasury_operations**   
  Operations on the wowok Treasury object   
  Input: *CallTreasuryDataSchema*

- **arbitration_operations**   
  Operations on the wowok Arbitration object  
  Input: *CallArbitrationDataSchema*

- **repository_operations**    
  Operations on the wowok Repository object   
  Input: *CallRepositoryDataSchema*

- **guard_operations**   
  Operations on the wowok Guard object   
  Input：*CallGuardDataSchema*


- **demand_operations**   
  Operations on the wowok Demand object   
  Input: *CallDemandDataSchema*

- **replace_permission_object**   
  Batch modifies the Permission object of wowok objects.   
  Input: *CallObjectPermissionDataSchema*   
      - `objects` (string[], required): The address of the wowok objects(Machine,  Service, Demand, Arbitration, Treasury, Repository).
      - `new_permission` (string): The address of the Permission object that Replaces the original Permission object.

- **local_mark_operations**   
  Local mark operation, such as add or set local marks, remove local marks or remove all local marks.   
  Input: *LocalMarkOperationSchema*

- **local_info_operations**    
  Local info operation, such as add local info or remove local info.   
  Input: *LocalInfoOperationSchema*

- **account_operations**    
  Account operation, such as generate a new account or transfer token from one account to another.   
  Input: *AccountOperationSchema*

## Resources
- **the list of accounts**   
  Retrieve all locally stored accounts    
  *wowok://account/list*    

- **the list of marks locally**    
  Retrieve all locally stored marks    
  *wowok://local_mark/list*    

- **the list of local personal infomation**   
  Retrieve all locally stored personal data (e.g. address of delivery)    
  *wowok://local_info/list* 

- **account**    
  Retrieve balance or coins of the token type by the name or address    
  *wowok://account/{?name_or_address, balance_or_coin, token_type}*

- **address locally marked**    
  Retrieve the address by the marked name.    
  *wowok://local_mark/{?name}*

- **addresses locally marked**    
  Retrieve the addresses filtered by the name, tags and address.    
  *wowok://local_mark/filter/{?name, tags\*, object}*

- **personal infomation locally**    
  Retrieve the personal infomation by the name (e.g. 'address of delivery')   
  *wowok://local_info/{?name}*

- **objects**  
  Query wowok objects     
  *wowok://objects/{?objects*, no_cache}*    

- **permissions**   
  Query permissions of an address from the wowok Permission object   
  *wowok://permissions/{?permission_object, address}*

- **personal_information**    
  Query personal information for an address    
  *wowok://personal/{?address, no_cache}*

- **table_items**    
  Query records of table data owned by the wowok object   
  *wowok://table_items/{?parent, cursor, limit}*

- **arb_table_item**    
  Query voting information for an address in the Arb object    
  *wowok://table_item/arb/{?object, address}*

- **machine_table_item**    
  Query node information in the Machine object.   
  *wowok://table_item/machine/{?object, node}*

- **demand_table_item**   
  Query service recommendation information in the Demand object.   
  *wowok://table_item/demand/{?object, address}*  

- **personalmark_table_item**  
  Query name and tags for an address in the PersonalMark object.     
  *wowok://table_item/personalmark/{?object, address}*  

- **permission_table_item**    
  Query permissions for an address in the Permission object.   
  *wowok://table_item/permission/{?object, address}*

- **repository_table_item**     
  Query node information in the Machine object.
  *wowok://table_item/repository/{?object, address, name}*

- **progress_table_item**   
  Query historical sessions data in the Progress object.   
  *wowok://table_item/progress/{?object, index}*

- **treasury_table_item**
  Query historical flows data in the Treasury object.
  Endpoint: *wowok://table_item/treasury/{?parent, index, no_cache}*
  Parameters:
  - `parent` (string, required): Address of the Treasury object that owns the table.
  - `index` (number, required): Auto-incrementing index of the item to query (starts at 0).
  - `no_cache` (boolean, optional): Whether to not use local cache data.

- **service_table_item**
  Query the current information of the item for sale in the Service object.
  Endpoint: *wowok://table_item/service/{?parent, name, no_cache}*
  Parameters:
  - `parent` (string, required): Address of the Service object that owns the table.
  - `name` (string, required): Name of the item to query.
  - `no_cache` (boolean, optional): Whether to not use local cache data.

- **new_arb_events**
  Query node information in the Machine object.
  Endpoint: *wowok://table_item/repository/{?parent, address, name, no_cache}*
  Parameters:
  - `parent` (string, required): Address of the Repository object that owns the table.
  - `address` (string, required): Address of the node to query.
  - `name` (string, required): Name of the node to query.
  - `no_cache` (boolean, optional): Whether to not use local cache data.

- **present_service_events**
  Query 'OnPresentService' events.
  Endpoint: *wowok://events/OnPresentService/{?type, cursor, limit, order}*
  Parameters:
  - `type` (string, required): Event type (must be 'OnPresentService').
  - `cursor` (object, optional): Paging cursor containing `eventSeq` (event sequence) and `txDigest` (transaction digest).
  - `limit` (number, optional): Maximum number of items per page (default: 50).
  - `order` (string, optional): Result ordering ('ascending' or 'descending', default: 'ascending').

- **new_progress_events**
  Query 'OnNewProgress' events.
  Endpoint: *wowok://events/OnNewProgress/{?type, cursor, limit, order}*
  Parameters:
  - `type` (string, required): Event type (must be 'OnNewProgress').
  - `cursor` (object, optional): Paging cursor containing `eventSeq` (event sequence) and `txDigest` (transaction digest).
  - `limit` (number, optional): Maximum number of items per page (default: 50).
  - `order` (string, optional): Result ordering ('ascending' or 'descending', default: 'ascending').

- **new_order_events**
  Query 'OnNewOrder' events.
  Endpoint: *wowok://events/OnNewOrder/{?type, cursor, limit, order}*
  Parameters:
  - `type` (string, required): Event type (must be 'OnNewOrder').
  - `cursor` (object, optional): Paging cursor containing `eventSeq` (event sequence) and `txDigest` (transaction digest).
  - `limit` (number, optional): Maximum number of items per page (default: 50).
  - `order` (string, optional): Result ordering ('ascending' or 'descending', default: 'ascending').




## Setup   
#### NPX   
```json
{
  "mcpServers": {
    "wowok": {
      "command": "npx",
      "args": [
        "-y",
        "wowok_mcp"
      ]
    }
  }
}
```