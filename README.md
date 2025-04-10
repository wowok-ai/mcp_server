# mcp_server
MCP Server for WoWok:  ‌Maximization of utility and optimization of talent.

Github: [https://github.com/wowok-ai/wowok](https://github.com/wowok-ai/wowok)   
Wowok Agent for AI: [https://github.com/wowok-ai/wowok_agent](https://github.com/wowok-ai/wowok_agent)   
MCP Server: [https://github.com/wowok-ai/mcp_server](https://github.com/wowok-ai/mcp_server)   
Website: [https://wowok.net/](https://wowok.net/)   
Docs: [https://github.com/wowok-ai/wowok/wiki](https://github.com/wowok-ai/wowok/wiki)   
X: [https://x.com/Wowok_Ai](https://x.com/Wowok_Ai)

## Tools
- **query objects**
  - query wowok objects
  - Input: array of objects
    - Each object contains:
      - `objects` (string[], required): Wowok object addresses to query.
      - `showType` (boolean): Whether to show the type of the objects.
      - `showContent` (boolean): Whether to show the content of the objects.
      - `showOwner` (boolean): Whether to show the owner of the objects.
      - `no_cache` (boolean): Whether to not use local cache data.

- **query events**
  - query wowok events
  - Input: 
      - `type` (string, required): 'OnNewArb' | 'OnPresentService'| 'OnNewProgress' | 'OnNewOrder'
      - `cursor` (object): Paging cursor that can be returned from the query result
        - `eventSeq`: (string): Event sequence.
        - `txDigest`: (string): Transaction Digest.
      - `limit` (number): Mmaximum number of items per page, default to 50 if not specified.
      - `order` (string): 'ascending'(default), 'descending'

- **query permissions**
  - query permissions of an address from the wowok Permission object
  - Input: 
      - `permission_object` (string, required): Wowok Permission object address.
      - `address` (string): Address you want to query permissions.


- **query table items**
  - query records of table data owned by the wowok object(Demand, Repository, Progress, Service, Treasury, Arb, Permission, Machine, PersonalMark)
  - Input: 
      - `parent` (string, required): Wowok object address that owns the table.
      - `cursor` (string): An optional paging cursor. 
      - `limit` (number): Maximum item returned per page, default to 50 if not specified.

- **query a table item**  
  - query a record of table data owned by the wowok object(Demand, Repository, Progress, Service, Treasury, Arb, Permission, Machine, PersonalMark)  
  - Input:  
      - `parent` (string, required): Wowok object address that owns the table. 
      - `key` (object, required): The query key 
        - `type` (string): Type of the value. 
        - `value` (unknown): Value.  

- **query presonal infomation**  
  - query personal information for an address   
  - Input:   
      - `address` (string, required): Personal address to query.   
      - `no_cache` (boolean): Whether to not use local cache data.  

- **query arb object** 
  - query voting infomation for an address in the Arb object  
  - Input:  
      - `object` (string, required): The address of the Arb object.   
      - `address` (string, required): The address has voted.  

- **query demand object**    
  - query service recommendation information by anyone in the Demand object.  
  - Input: 
      - `object` (string, required): The address of the Demand object.
      - `address` (string, required): The address of the Service object recommended by anyone.   

- **query permission object**   
  - query permissions for an address in the Permission object.  
  - Input: 
      - `object` (string, required): The address of the Permission object.  
      - `address` (string, required): The address to query permissions.  

- **query personalmark object**
  - query name and tags for an address in the PersonalMark object
  - Input: 
      - `object` (string, required): The address of the PersonalMark object that privately owned by a user.
      - `address` (string, required): The address to query the name and tags.

- **query treasury object**
  - query historical flows data in the Treasury object.  
  - Input: 
      - `object` (string, required): The address of the Treasury object.
      - `number` (string, required): Historical data index. Start at 0 and add 1 for each new record.
- **query progress object**
  - query historical sessions data in the Progress object.
  - Input: 
      - `object` (string, required): The address of the Progress object.
      - `number` (string, required): Historical data index. Start at 0 and add 1 for each new record.

- **query machine object**
  - query node infomation in the Machine object.
  - Input: 
      - `object` (string, required): The address of the Machine object.
      - `name` (string, required): The node name.

- **query service object**
  - query the current information of the item for sale in the Service object.
  - Input: 
      - `object` (string, required): The address of the Service object.
      - `name` (string, required): The sales item name.

- **query repository object**
  - query data in the Repository object.
  - Input: 
      - `object` (string, required): The address of the Repository object.
      - `address` (string | number, required): The address(or number converted to address, such as time) that own the data.
      - `name` (string, required): Data field name.
      
- **personal operations**
  - operations on the wowok Personal object
  - Input: 


- **machine operations**
  - operations on the wowok Machine object
  - Input: 

- **service operations**
  - operations on the wowok Service object
  - Input: 

- **permission operations**
  - operations on the wowok Permission object
  - Input: 

- **treasury operations**
  - operations on the wowok Treasury object
  - Input: 

- **arbitration operations**
  - operations on the wowok Arbitration object
  - Input: 

- **repository operations**
  - operations on the wowok Repository object
  - Input: 

- **guard operations**
  - operations on the wowok Guard object
  - Input: 

- **demand operations**
  - operations on the wowok Demand object
  - Input: 

- **replace permission object**
  - Batch modify the Permission object of wowok objects.
  - Input: 
      - `objects` (string[], required): The address of the wowok objects(Machine,  Service, Demand, Arbitration, Treasury, Repository).
      - `new_permission` (string): The address of the Permission object that Replaces the original Permission object.

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