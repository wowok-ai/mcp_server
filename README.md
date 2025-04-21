# wowok_mcp (MCP Server for WoWok)
Unlock Co-Creation: Right Talent, Perfect Purpose.

Github: [https://github.com/wowok-ai/wowok](https://github.com/wowok-ai/wowok)   
Wowok Agent for AI: [https://github.com/wowok-ai/wowok_agent](https://github.com/wowok-ai/wowok_agent)   
MCP Server: [https://github.com/wowok-ai/mcp_server](https://github.com/wowok-ai/mcp_server)   
Website: [https://wowok.net/](https://wowok.net/)   
Docs: [https://github.com/wowok-ai/wowok/wiki](https://github.com/wowok-ai/wowok/wiki)   
X: [https://x.com/Wowok_Ai](https://x.com/Wowok_Ai)

## Tools
- **account_list**   
  Retrieve all locally stored accounts.    

- **local_info_list**    
  Retrieve all locally stored personal infomation (e.g. address of delivery).    

- **local_mark**   
  Retrieve locally stored marks by the name, tags and object filters.    
    - `name`: the name of the mark
    - `tags`: tags of the mark
    - `object`: the object address   

- **account**    
  Retrieve balance or coins of the token type by the name or address.   
    - `name_or_address` : personal address or its mark name.
    - `token_type` : token type 
    - `balance_or_coin` : 'balance' or 'coin' to fetch.    

- **local_info**    
  Retrieve the personal infomation by the name (e.g. 'address of delivery').  
  - `name`: the name of infomation (e.g. 'address of delivery')

- **objects**    
  Query wowok objects   
  Input: array of objects, Each object contains:  
    - `objects` (string[], required): Wowok object addresses to query.
    - `showType` (boolean): Whether to show the type of the objects.
    - `showContent` (boolean): Whether to show the content of the objects.
    - `showOwner` (boolean): Whether to show the owner of the objects.
    - `no_cache` (boolean): Whether to not use local cache data.

- **events**    
  Query wowok events.
  Input: 
    - `type` (string, required): 'OnNewArb' | 'OnPresentService'| 'OnNewProgress' | 'OnNewOrder'
    - `cursor` (object): Paging cursor that can be returned from the query result
      - `eventSeq`: (string): Event sequence.
      - `txDigest`: (string): Transaction Digest.
    - `limit` (number): Maximum number of items per page, default to 50 if not specified.
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
  Input: *CallGuardDataSchema*

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
  *wowok://table_item/treasury/{?object, index}*

- **service_table_item**   
  Query the current information of the item for sale in the Service object.    
  *wowok://table_item/service/{?object, name}*

- **new_arb_events**   
  Query node information in the Machine object.   
  *wowok://table_item/repository/{?object, address, name}*

- **present_service_events**   
  Query 'OnPresentService' events   
  *wowok://events/OnPresentService/{?cursor_eventSeq, cursor_txDigest, limit, order}*

- **new_progress_events**   
  Query 'OnNewProgress' events   
  *wowok://events/OnNewProgress/{?cursor_eventSeq, cursor_txDigest, limit, order}*

- **new_order_events**   
  Query 'OnNewOrder' events   
  *wowok://events/OnNewOrder/{?cursor_eventSeq, cursor_txDigest, limit, order}*




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