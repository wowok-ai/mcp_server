
import { z } from "zod";
import { WOWOK } from "wowok_agent";
import { AccountOrMarkNameDescription, AccountOrMarkNameSchema, MarkName_Address_Description, MarkNameSchema } from "./query.js";

const PermissioIndexArray = WOWOK.PermissionInfo.filter(i => i.index !== WOWOK.PermissionIndex.user_defined_start)
    .map(v => z.literal(v.index).describe(`module:${v.module}.name:${v.name}.description:${v.description}`));
const PermissionIndexSchema = z.union([z.literal(WOWOK.PermissionIndex.user_defined_start), z.number().int().min(WOWOK.PermissionIndex.user_defined_start+1),  ...PermissioIndexArray])
    .describe(`All permission numbers of the Wowok protocol. 
        The built-in permission number is smaller than ${WOWOK.PermissionIndex.user_defined_start}, 
        and the biz permission number that user defined is greater than or equal to ${WOWOK.PermissionIndex.user_defined_start}`);

const SafeUint8ArraySchema = z.custom<Uint8Array>((val) => 
    Object.prototype.toString.call(val) === "[object Uint8Array]"
);

const NamedObjectSchema = z.object({
    name: z.string().optional().describe('The name of the new object.'),
    tags: z.array(z.string().nonempty()).optional().describe('A list of tags for the new object.'),
    useAddressIfNameExist: z.boolean().optional().describe('While a naming conflict occurs, prioritize the address as the identifier(If true); otherwise, use this name and change the original name to its address.'),
    onChain: z.boolean().optional().describe('If true, the name and tags of the object will be made visible on-chain.'),
}).describe(`This configuration adds names and tags to object addresses (long random strings that are hard to remember and reference) within the local mark (privately visible only on the current device), enabling users to search or operate on objects via names/tags. If the 'onChain' property is set to 'true', the names and tags will be recorded in the on-chain PersonalMark object, making them publicly visible through users' personal on-chain pages.`);


const NamedObjectWithDescriptionSchema = NamedObjectSchema.extend({
    description: z.string().optional().describe('Description of the newly named wowok object.')
});

const ObjectParamSchema = z.union([
    z.string().nonempty().describe(MarkName_Address_Description),
    NamedObjectWithDescriptionSchema
]).describe('The on-chain object to be operated on, which can be an existing object referenced by address or a newly created on-chain object (marked with a name and tags).');

const NamedObjectWithPermissionSchema = NamedObjectSchema.extend({
    permission: ObjectParamSchema.optional().describe('The object that has the permission to operate on the object.')
}); 

const TypeNamedObjectWithPermissionSchema = NamedObjectWithPermissionSchema.extend({
    type_parameter: z.string().nonempty().describe('The generic type parameter of the on-chain object.')
}).describe('Specifies the generic type parameter for newly created objects. For example, setting a Treasury object to use the generic type (e.g., 0x2::sui::SUI) indicates it will only handle vault operations for this specific token type; setting a Service object to a token type means its products/services can only be purchased using tokens of this type.')

const ObjectTypedMainSchema = z.union([
    z.string().nonempty().describe(MarkName_Address_Description),
    TypeNamedObjectWithPermissionSchema
]).describe('The on-chain object with generic parameters to be operated on, which can be an existing object referenced by address, or a newly created on-chain object where operation permissions are set, generic parameters are specified, and its address is named and tagged.');

const ObjectMainSchema = z.union([
    z.string().nonempty().describe(MarkName_Address_Description),
    NamedObjectWithPermissionSchema
]).describe('The on-chain object to be operated on, which can be an existing object referenced by address, or a newly created on-chain object where operation permissions are set, and its address is named and tagged.');

const ValueTypeSchema = z.nativeEnum(WOWOK.ValueType).describe('The value of the underlying data type of the Wowok protocol.');
const GuardIndentifierSchema = z.number().int().min(1).max(255);

const TokenBalanceSchema = z.union([z.string(), z.number().int().min(0)]).describe('The number of tokens.');

const ObjectsOperationSchema = z.union([
    z.object({
        op: z.union([z.literal('set'), z.literal('remove'), z.literal('add')]),
        objects: z.array(MarkNameSchema).describe(`Addresses of the objects to be operated on.`),
    }).describe('Set, remove, or add objects to the list.'),
    z.object({
        op: z.literal('removeall')
    }).describe('Remove all objects from the list.')
]);

const GuardNodeSchema: z.ZodType = z.lazy(() => z.union([
    z.object({
        identifier: GuardIndentifierSchema.describe('Data from the Guard table corresponding to the identifier.')
    }).describe('Data from the Guard table corresponding to the identifier.'), 
    z.object({
        query: z.number().int().describe('Data query ID. The query_id field of GuardQuery structure.'),
        object: z.union([z.string().describe('The address of the object to query.'), 
            GuardIndentifierSchema.describe('The address of the object to query from the Guard table corresponding to the identifier.')
        ]).describe('The object to query'),
        parameters: z.array(GuardNodeSchema).describe('All the child nodes.'+ 
            'The data return type of the query child node must be consistent with the parameters field of GuardQuery structure.')
    }).describe('Data from querying the wowok object.'), 
    z.object({
        logic: z.union([z.literal(WOWOK.OperatorType.TYPE_LOGIC_AS_U256_GREATER).describe(`${WOWOK.LogicsInfo.find(v => v[0]===WOWOK.OperatorType.TYPE_LOGIC_AS_U256_GREATER)![1]}. ${WOWOK.LogicsInfo.find(v => v[0]===WOWOK.OperatorType.TYPE_LOGIC_AS_U256_GREATER)![2]}.`), 
            z.literal(WOWOK.OperatorType.TYPE_LOGIC_AS_U256_GREATER_EQUAL).describe(`${WOWOK.LogicsInfo.find(v => v[0]===WOWOK.OperatorType.TYPE_LOGIC_AS_U256_GREATER_EQUAL)![1]}. ${WOWOK.LogicsInfo.find(v => v[0]===WOWOK.OperatorType.TYPE_LOGIC_AS_U256_GREATER_EQUAL)![2]}.`),
            z.literal(WOWOK.OperatorType.TYPE_LOGIC_AS_U256_LESSER).describe(`${WOWOK.LogicsInfo.find(v => v[0]===WOWOK.OperatorType.TYPE_LOGIC_AS_U256_LESSER)![1]}. ${WOWOK.LogicsInfo.find(v => v[0]===WOWOK.OperatorType.TYPE_LOGIC_AS_U256_LESSER)![2]}.`),
            z.literal(WOWOK.OperatorType.TYPE_LOGIC_AS_U256_LESSER_EQUAL).describe(`${WOWOK.LogicsInfo.find(v => v[0]===WOWOK.OperatorType.TYPE_LOGIC_AS_U256_LESSER_EQUAL)![1]}. ${WOWOK.LogicsInfo.find(v => v[0]===WOWOK.OperatorType.TYPE_LOGIC_AS_U256_LESSER_EQUAL)![2]}.`),
            z.literal(WOWOK.OperatorType.TYPE_LOGIC_AS_U256_EQUAL).describe(`${WOWOK.LogicsInfo.find(v => v[0]===WOWOK.OperatorType.TYPE_LOGIC_AS_U256_EQUAL)![1]}. ${WOWOK.LogicsInfo.find(v => v[0]===WOWOK.OperatorType.TYPE_LOGIC_AS_U256_EQUAL)![2]}.`),
            z.literal(WOWOK.OperatorType.TYPE_LOGIC_EQUAL).describe(`${WOWOK.LogicsInfo.find(v => v[0]===WOWOK.OperatorType.TYPE_LOGIC_EQUAL)![1]}. ${WOWOK.LogicsInfo.find(v => v[0]===WOWOK.OperatorType.TYPE_LOGIC_EQUAL)![2]}.`),
            z.literal(WOWOK.OperatorType.TYPE_LOGIC_HAS_SUBSTRING).describe(`${WOWOK.LogicsInfo.find(v => v[0]===WOWOK.OperatorType.TYPE_LOGIC_HAS_SUBSTRING)![1]}. ${WOWOK.LogicsInfo.find(v => v[0]===WOWOK.OperatorType.TYPE_LOGIC_HAS_SUBSTRING)![2]}.`),
            z.literal(WOWOK.OperatorType.TYPE_LOGIC_NOT).describe(`${WOWOK.LogicsInfo.find(v => v[0]===WOWOK.OperatorType.TYPE_LOGIC_NOT)![1]}. ${WOWOK.LogicsInfo.find(v => v[0]===WOWOK.OperatorType.TYPE_LOGIC_NOT)![2]}.`),
            z.literal(WOWOK.OperatorType.TYPE_LOGIC_AND).describe(`${WOWOK.LogicsInfo.find(v => v[0]===WOWOK.OperatorType.TYPE_LOGIC_AND)![1]}. ${WOWOK.LogicsInfo.find(v => v[0]===WOWOK.OperatorType.TYPE_LOGIC_AND)![2]}.`),
            z.literal(WOWOK.OperatorType.TYPE_LOGIC_OR).describe(`${WOWOK.LogicsInfo.find(v => v[0]===WOWOK.OperatorType.TYPE_LOGIC_OR)![1]}. ${WOWOK.LogicsInfo.find(v => v[0]===WOWOK.OperatorType.TYPE_LOGIC_OR)![2]}.`),
        ]).describe('Logical judgment of all child nodes.'),
        parameters: z.array(GuardNodeSchema).describe('All the child nodes.'+ 
            `The data return type of the child node should be ${WOWOK.ValueType.TYPE_U8} or ${WOWOK.ValueType.TYPE_U64} or ${WOWOK.ValueType.TYPE_U128} or ${WOWOK.ValueType.TYPE_U256}, 
            if logic is "Unsigned Integer >", "Unsigned Integer >=", "Unsigned Integer <", "Unsigned Integer <=", "Unsigned Integer =" one of these.
            The data return type of the child node should be ${WOWOK.ValueType.TYPE_BOOL}, if logic is "And", "Or", "Not" one of these.
            The data return type of the child node should be ${WOWOK.ValueType.TYPE_STRING}, if logic is "Has Sub String".
            `)
    }).describe(`Data from logic operation. The returned type value is always ${WOWOK.ValueType.TYPE_BOOL}`),
    z.object({
        calc: z.union([z.literal(WOWOK.OperatorType.TYPE_NUMBER_ADD).describe(`Mathematical operation:+. The sum of the numbers of all child nodes.`), 
            z.literal(WOWOK.OperatorType.TYPE_NUMBER_DEVIDE).describe(`Mathematical operation:/.`),
            z.literal(WOWOK.OperatorType.TYPE_NUMBER_MOD).describe(`Mathematical operation:%.`), 
            z.literal(WOWOK.OperatorType.TYPE_NUMBER_ADDRESS).describe(`Mathematical operation:convert number from type(${WOWOK.ValueType.TYPE_U8} or ${WOWOK.ValueType.TYPE_U64} or ${WOWOK.ValueType.TYPE_U128} or ${WOWOK.ValueType.TYPE_U256}) to address type(${WOWOK.ValueType.TYPE_ADDRESS}).`),
            z.literal(WOWOK.OperatorType.TYPE_NUMBER_MULTIPLY).describe(`Mathematical operation:*`), 
            z.literal(WOWOK.OperatorType.TYPE_NUMBER_SUBTRACT).describe(`Mathematical operation:-`),
        ]).describe('Perform mathematical operations or type conversions on numeric values.'),
        parameters: z.array(GuardNodeSchema).describe('All the child nodes.'+ 
            `The data return type of the child node should be ${WOWOK.ValueType.TYPE_U8} or ${WOWOK.ValueType.TYPE_U64} or 
            ${WOWOK.ValueType.TYPE_U128} or ${WOWOK.ValueType.TYPE_U256}.
            `)
    }).describe('Data from performing mathematical operations or type conversions on numeric values.'),
    z.object({
        value_type: ValueTypeSchema,
        value: z.any().describe('Value of data.')
    }).describe('Data from value with its type specified in the value_type field.'),
    z.object({
        context: z.union([z.literal(WOWOK.ContextType.TYPE_SIGNER).describe(`Address of the signer of the current transaction.Type is ${WOWOK.ValueType.TYPE_ADDRESS} `), 
            z.literal(WOWOK.ContextType.TYPE_CLOCK).describe(`On-chain time of the current transaction. Type is ${WOWOK.ValueType.TYPE_U64} `),
            z.literal(WOWOK.ContextType.TYPE_GUARD).describe(`The Guard address to which the condition belongs is currently being verified.Type is ${WOWOK.ValueType.TYPE_ADDRESS} `),
        ]).describe('Data from transaction context.')
    })
]).describe('Generates data for a Guard node'));

const MachineNode_ForwardSchema = z.object({
    name:z.string().nonempty().describe('Operation name. Uniquely identifies an operation between the same two nodes.'),
    namedOperator:z.string().nonempty().optional().describe('The namespace with the operation permission. '+
        'This namespace allows different Progresses to manage addresses within this namespace.'),
    permission:PermissionIndexSchema.optional(),
    weight: z.number().int().min(1).optional().describe('Operation weights'),
    guard: z.string().optional().describe('The address of the Guard object. ' + 
        'If it is set, this operation must be performed to meet both permission requirements and Guard condition verification.'),
    suppliers: z.array(z.object({
        object: z.string().nonempty().describe('The address of the Service object.'),
        pay_token_type: z.string().nonempty().describe('The payment token type of the service.'),
        bRequired:z.boolean().optional().describe('If True, at least one purchase order for the service is required to complete the operation.')
    })).optional().describe('If set, an order from at least one vendor service is required to complete the operation.')
}).describe('A data definition of an operation.');

const MachineNodeSchema = z.object({
    name: z.string().nonempty().describe('The name of the node.This name uniquely identifies a node in Machine.'),
    pairs: z.array(z.object({
        prior_node:z.string().describe('Name of the previous node. The initial node name is "".'),
        threshold: z.number().int().min(0).describe("Threshold. " + 
            "If the Machine's Progress reaches or exceeds this threshold for all operation weights from the previous node to this node, its progress transitions to this node."),
        forwards: z.array(MachineNode_ForwardSchema).describe('All operations from the previous node to this node.')
    })).describe('All previous nodes to this node.')
}).describe('Operation data of a machine node.');

const ProgressOperationSchema = z.object({
    next_node_name: z.string().nonempty().describe('The name of the next node to go to.'),
    forward: z.string().nonempty().describe('The operation name of the next work node to go to.'),
}).describe('The operation goes to the next node.');

const GuardPercentSchema = z.union([
    z.object({
        op: z.union([z.literal('add'), z.literal('set')]),
        guards: z.array(z.object({
            guard: MarkNameSchema.describe('The address of the Guard object'),
            percent: z.number().int().min(0).max(100).describe(' Numeric value without the percent sign')
        }).describe('The address of Guard object and the corresponding value.'))
    }).describe('Add the guards.'), 
    z.object({
        op: z.literal('remove'), 
        guards: z.array(MarkNameSchema.describe('The address of the Guard object'))
    }).describe('Remove the guards.'),
    z.object({
        op: z.literal('removeall'), 
    }).describe('Remove all the guards.')
])

const RepositoryValueTypeSchema = z.union([
    z.literal(WOWOK.RepositoryValueType.Address).describe(`Object or Personal address.`),
    z.literal(WOWOK.RepositoryValueType.Address_Vec).describe('Vector of address.'),
    z.literal(WOWOK.RepositoryValueType.String).describe('String.'),
    z.literal(WOWOK.RepositoryValueType.String_Vec).describe('Vector of string.'),
    z.literal(WOWOK.RepositoryValueType.PositiveNumber).describe('Unsigned integer'),
    z.literal(WOWOK.RepositoryValueType.PositiveNumber_Vec).describe('Vector of unsigned integer'),
    z.literal(WOWOK.RepositoryValueType.Bool).describe('True or False'),
]).describe('The Repository object stores supported data types.');

export const CallDemandDataSchema = z.object({
    object: ObjectTypedMainSchema,
    present:z.object({
        service:MarkNameSchema.optional().describe(`${MarkName_Address_Description} The address of the Service object.`),
        recommend_words:z.string().describe('Service recommendation words.'),
    }).optional().describe('Recommend service to the Demand object. '),
    description: z.string().optional().describe('Description of the Demand object'),
    time_expire: z.union([z.object({
            op:z.literal('duration').describe('Set by duration time'),
            minutes:z.number().int().min(1).describe('The number of minutes of duration')
        }), z.object({
            op:z.literal('time').describe('Set by specified time'),
            time:z.number().int().min(1).describe('The number of milliseconds of the moment.')
        })]).optional().describe('The deadline by which demand rewards can be earned.'+
            'Prior to this deadline, the Demand bounties can only be increased and not decreased. ' + 
            'After to this deadline, the Demand bounties can be retrieved by the relevant authority of the Demand.'),
    bounty:z.union([z.object({
        op:z.literal('add').describe('Add new bounty'),
        object:z.union([z.object({
            address:z.string().nonempty().describe(`${MarkName_Address_Description} The object address (supporting both FT and NFT objects) owned by the transaction signer.`)}), 
            z.object({balance:TokenBalanceSchema}).describe('The token quantity owned by the transaction signer. This parameter is valid only if the Demand generic type is FT (0x2::coin::Coin<...>); if the Demand generic type is not FT, using this parameter will fail.')
            ]).describe('Specify the address of an existing object or generate a new object address (which includes the specified quantity of tokens).'),  
        }).describe('Add the object owned by the transaction signer to the bounty pool of the Demand'), 
        z.object({
            op:z.literal('reward').describe('Reward all bounties to the service recommender.'),
            service:z.string().describe('The address of the Service object.')
        }), z.object({
            op:z.literal('refund').describe('Retrieve the bounty. ' + 
                'If no service meets the Demand, the demand-related authority can retrieve the bounty after the promised time (time_expire).')
        })]).optional().describe('Operation on bounty'),
    guard:z.object({
        address: z.string().describe(`${MarkName_Address_Description} The address of the Guard object.`),
        service_id_in_guard:GuardIndentifierSchema.optional().describe('Identifier in the Guard object. When a service is recommended to Demand, the service object is validated with the Identifier, if specified.')
    }).optional().describe(`Recommend to Demand the Guard condition validation that any service needs to meet. Such as service rating, service referrer history, etc. 
        Once Guard is set, the service is recommended to Demand only after the Guard condition is verified.`)
    }).describe('Data definition that operates on the Demand object. The operations are performed one after the other in the field order.'); 

export const CallGuardDataSchema = z.object({
    root:GuardNodeSchema,
    namedNew: NamedObjectSchema.optional().describe('Newly named Guard object.'),
    description: z.string().optional().describe('Description of the Guard object.'),
    table:z.array(z.object({
        identifier:GuardIndentifierSchema.describe('Identifier for a constant or a witness'),
        bWitness:z.boolean().describe('Whether the data is witness. True for a witness data, false for a const data.'),
        value_type: ValueTypeSchema,
        value: z.any().optional().describe('Data value for a constant, Ignored if the data is a witness.')
    })).optional().describe('Data table for Const or Witness'),
}).describe('Data definition that operates on the on-chain Guard object. The operations are performed one after the other in the field order.');

const OptionProgressObjectSchema = z.string().optional().describe(`${MarkName_Address_Description} The Progress object for the operation; if undefined, indicates that the operation uses a Progress newly created by the progress_new field`);
const ProgressObjectSchema = z.string().describe(`${MarkName_Address_Description} The Progress object for the operation.`);

export const CallMachineDataSchema = z.object({
    object: ObjectMainSchema,
    progress_new: z.object({
        task_address:z.string().nonempty().optional().describe(`${MarkName_Address_Description} The address of the task object(such as an Order).`),
        namedNew: NamedObjectSchema.optional().describe('Newly named Progress object.'),
        }).optional().describe('Create a new Progress object for the Machine object. ' + 
            'The new Progress uses the processes, operations, and permissions already defined by the Machine object.' + 
            'If the Machine Object is not published, the creation fails.'),
    progress_context_repository: z.object({
        progress:OptionProgressObjectSchema,
        repository:z.string().optional().describe(`${MarkName_Address_Description} The address of the Repository object.`),
    }).optional().describe('Set or unset the context repository for the Progress object.'),
    progress_namedOperator: z.object({
        progress:OptionProgressObjectSchema,
        data:z.array(z.object({
            name:z.string().nonempty().describe('The namespace defined in the Machine node.'),
            operators:z.array(AccountOrMarkNameSchema).describe('Operator addresses.')
        })).describe('A list of operator addresses for different namespaces')
    }).optional().describe("Add the operator addresses to the namespace defined by the Machine node, " + 
        "so that these operators have corresponding operation permissions in the Progress. " + 
        "The namespace of each Progress created by Machine is independent, and its operator Settings are independent of each other."),
    progress_parent: z.object({
        progress:OptionProgressObjectSchema,
        parent:z.object({
            parent_id: z.string().nonempty().describe(`${MarkName_Address_Description} The address of the parent Progress object.`),
            parent_session_id: z.number().int().min(0).describe(`A number in the parent Progress object session list. 
                The session number of each node of the Progress object is different. Each number corresponds sequentially to each of its working nodes.
                The initial node session number is 0, and its value increases by 1 for each working node.`
            ),
            operation: ProgressOperationSchema
        }).optional().describe('The parent Progress object and the session operation it performs.')
    }).optional().describe(`Set the parent Progress object for the Progress object to determine its relationship graph.`),
    progress_hold: z.object({
        progress:OptionProgressObjectSchema,
        operation:ProgressOperationSchema,
        bHold: z.boolean().describe('If True, make sure that only the current transaction signer completes the operation; ' + 
            'If False, other authorized operators can complete the operation.'),
        adminUnhold: z.boolean().optional().describe('If the signer of the current transaction is the relevant authority in the Machine, '+
            'it can cancel the operation that is uniformly owned by one operator.'),
    }).optional().describe('Sole possession or unpossession of the current operation of the Progress object. ' + 
        'It is used when an operation may take a long time and does not require the participation of more people.' + 
        'Simple and quick operations ignore this setting.'), 
    progress_task: z.object({
        progress:ProgressObjectSchema,
        task_address:z.string().nonempty().describe(`The task that the Progress object performs, such as an Order object address.
            Once a task for the Progress object is set, it cannot be changed again.`
        ),
    }).optional().describe("Set the task of a Progress object. A Progress object can be set only once, for example, an Order object."),   
    progress_next: z.object({
        progress: ProgressObjectSchema,
        operation:ProgressOperationSchema,
        deliverable: z.object({
            msg: z.string().describe('The log or message that completes the operation.'),
            orders: z.array(MarkNameSchema).describe('List of purchase orders in the supply chain.')
        }).describe('Submission information to complete the operation.'),
    }).optional().describe('Complete a process step in the Progress and submit the corresponding deliverables.'),    

    description: z.string().optional().describe('Description of the Machine object'),
    endpoint: z.string().optional().describe('HTTPS endpoint of the Machine object.' + 
        "The Endpoint provides a view that allows the Machine's Progress to integrate complex operations at each node to complete a commit. " + 
        "If there are complex Guard condition validations, it is recommended to use an Endpoint to simplify operator operations.",
    ),
    consensus_repository: ObjectsOperationSchema.optional().describe('Set and manage consensus repositories for data sharing. Note: The parameter must be a Repository object address.'),
    nodes: z.union([
        z.object({
            op:z.literal('add'),
            data: z.array(MachineNodeSchema),
        }).describe('Add nodes to the Machine object'),
        z.object({
            op:z.literal('remove'),
            names: z.array(z.string().nonempty()).describe('Names of the nodes.'),
            bTransferMyself: z.boolean().optional().describe("Whether to transfer the deleted node data to the transaction signer's account")
        }).describe('Remove nodes from the Machine object.'),
        z.object({
            op:z.literal('rename node'),
            data: z.array(z.object({
                old:z.string().nonempty().describe('The original name of the node.'),
                new:z.string().nonempty().describe('The new name of the node. The new name of the node cannot be the same as the name of the other nodes.'),
            })).describe('Rename the nodes.')
        }),
        z.object({
            op:z.literal('add from myself'),
            addresses:z.array(z.string().describe('The address of the node owned by the transaction signer.'))
        }).describe('Adds nodes owned by the transaction signer to the Machine object.'),
        z.object({
            op:z.literal('remove pair'),
            pairs:z.array(z.object({
                prior_node_name: z.string().describe('The name of the previous node'),
                node_name: z.string().nonempty().describe('The name of the latter node'),
            })).describe('Node pairs.')
        }).describe('Remove all operations defined in node pairs.'),
        z.object({
            op:z.literal('add forward'),
            data: z.array(z.object({
                prior_node_name: z.string().describe('The name of the previous node'),
                node_name: z.string().nonempty().describe('The name of the latter node'),
                forward: MachineNode_ForwardSchema,
                threshold: z.number().int().min(0).optional().describe("Threshold. " + 
                    "If the Machine's Progress reaches or exceeds this threshold for all operation weights from the previous node to this node, its progress transitions to this node."),        
                remove_old_forward: z.string().nonempty().optional().describe('The name of the foward to remove.'),
            }))
        }).describe('Add operations to the Machine object.'),
        z.object({
            op:z.literal('remove forward'),
            data: z.array(z.object({
                prior_node_name: z.string().describe('The name of the previous node.'),
                node_name: z.string().nonempty().describe('The name of the latter node.'),
                forward_name: z.string().nonempty().describe('Operation name '),
            }).describe('The operation between the previous node and the latter node.'))
        }).describe('Remove operations from the Machine object.')
    ]).optional().describe('Nodes and their operations.'),
    bPublished:z.boolean().optional().describe('Publish the Machine object. ' + 
        'If True, Machine will allow its Progress object to be created, and data such as Machine nodes cannot be changed again. If False, it is ignored.'),
    bPaused: z.boolean().optional().describe('If Machine is already published, the creation of new Progress is paused if True, and new Progress is allowed if False. ' + 
        'The generated Progress is not affected.'),
    clone_new: z.object({
        namedNew: NamedObjectSchema.optional().describe('Newly named Machine object.'),
    }).optional().describe('The promised Settings cannot be changed after the Machine is published. ' + 
        'Clone allows it to be retained to copy a new Machine, inherit its Settings, and can be modified and released at any time.'),
}).describe('Data definition that operates on the on-chain Machine object. The operations are performed one after the other in the field order.'); 

export const CallPermissionDataSchema = z.object({
    object: z.union([MarkNameSchema, NamedObjectSchema]).describe(`'The on-chain object to be operated on, which can be an existing object referenced by address, or a newly created on-chain object with its address is named and tagged.'`),
    description: z.string().optional().describe('Description of the Permission object.'),
    biz_permission: z.union([
        z.object({
            op: z.literal('add'),
            data: z.array(z.object({
                index: z.number().int().min(WOWOK.PermissionIndex.user_defined_start).describe('User-defined permission number'),
                name: z.string().nonempty().describe('The name of the permission.')
            }))
        }).describe('Add user-defined permissions.'), 
        z.object({
            op: z.literal('remove'),
            permissions: z.array(
                z.number().int().min(WOWOK.PermissionIndex.user_defined_start).describe('User-defined permission number')
            )
        }).describe('Remove user-defined permissions.')
    ]).optional().describe('Add or Remove user-defined permissions.'),
    permission:z.union([
        z.object({
            op:z.literal('add entity'),
            entities:z.array(z.object({
                address: AccountOrMarkNameSchema,
                permissions: z.array(z.object({
                    index: PermissionIndexSchema,
                    guard: z.string().nonempty().optional().describe('The address of the Guard object.' + 
                        'If set, the exercise of this permission must also meet guard authentication conditions.'
                    )
                }).describe('Add operation permissions to an address.'))
            }))
        }).describe('Give permissions to addresses'),
        z.object({
            op:z.literal('add permission'),
            permissions:z.array(z.object({
                index: PermissionIndexSchema,
                entities: z.array(z.object({
                    address: AccountOrMarkNameSchema,
                    guard: z.string().nonempty().optional().describe('The address of the Guard object.' + 
                        'If set, to exercise of this permission, the address must also meet guard authentication conditions.'
                    )
                }).describe('Add addresses for a permission that can be exercised'))
            }))
        }).describe('Add addresses for permissions'),
        z.object({
            op:z.literal('remove entity'),
            addresses:z.array(AccountOrMarkNameSchema).describe('Delete addresses and its permissions from the Permission Object.' )
        }).describe('Delete addresses and its permissions from the Permission Object. Administrator addresses is not affected.'),
        z.object({
            op:z.literal('remove permission'),
            address:AccountOrMarkNameSchema,
            index: z.array(PermissionIndexSchema),
        }).describe('Remove some permissions for an address'),
        z.object({
            op:z.literal('transfer permission'),
            from: AccountOrMarkNameSchema,
            to: AccountOrMarkNameSchema,
        }).describe('Transfer all permissions from one address to another. ' + 
            'The address for receiving permissions must be the new address of the Permission object.'),
    ]).optional().describe('Personnel address and permission assignment.'),
    admin: z.union([
        z.object({
            op: z.union([z.literal('add'), z.literal('remove'), z.literal('set')]),
            addresses:z.array(AccountOrMarkNameSchema)
        }).describe('Add, delete, and set an administrator address list.'),
        z.object({
            op:z.literal('removeall')
        }).describe('Delete all Administrators')
    ]).optional().describe('To manage the administrator list, only the builder of the Permission object has permission to operate it.'),
    builder: AccountOrMarkNameSchema.describe('Modify the builder address.' + 
        'The Builder is the highest Permission object owner and has only one address.' + 
        'The default is the address of the signer of the transaction that created the Permission object.')
}).describe('Data definition that operates on the  on-chain Permission object. The operations are performed one after the other in the field order.');

export const RepositoryAddressID = z.union([
    z.number().int().min(0).describe(`A positive integer that can be converted to an address (e.g., time number)`),
    z.bigint().describe('A positive integer that can be converted to an address (e.g., time number)'),
    AccountOrMarkNameSchema
]).describe('The AddressID used to query Repository data, which can be an address, an address corresponding to the name of a local account or local mark, or an address converted from a positive integer (e.g., a time number).');

export const PayParamSchema = z.object({
    index: z.union([
        z.number().int().min(0).describe(''),
        z.bigint(),
        z.string().nonempty(),
    ]).describe('The index of the payment record.'),
    remark: z.string().describe(`The notes for the payment.`),
    for_object: z.string().nonempty().optional().describe(`${MarkName_Address_Description} The address of the object related to the purpose of the payment.`),
    for_guard: z.string().nonempty().optional().describe(`${MarkName_Address_Description} The address of the Guard object associated with the payment purpose.`),
}).describe('Payment parameters.');

export const CallRepositoryDataSchema = z.object({
    object: ObjectMainSchema,
    description: z.string().optional().describe('Description of the Repository object.'),
    reference: ObjectsOperationSchema.optional().describe('Declare the list of other objects that use this Repository. '),
    mode:z.union([
        z.literal(WOWOK.Repository_Policy_Mode.POLICY_MODE_FREE).describe('Relax mode'),
        z.literal(WOWOK.Repository_Policy_Mode.POLICY_MODE_STRICT).describe('Strict mode'),
    ]).optional().describe('Mode. ' + 
        'Relax mode: Allows data fields outside the policy definition to join the Repository.' + 
        'Strict mode: Data fields outside the policy definition are not allowed to join the Repository.'),
    policy: z.union([
        z.object({
            op: z.union([z.literal('add'), z.literal('set')]),
            data: z.array(z.object({
                key: z.string().nonempty().describe('The name of the data field.'),
                description: z.string().describe('The meaning and description of data fields, generation rules, etc.'),
                dataType: RepositoryValueTypeSchema,
                permissionIndex: PermissionIndexSchema.optional().nullable(),
            }).describe('a Policy'))
        }).describe('Add or set policies.'), 
        z.object({
            op: z.literal('remove'),
            keys: z.array(
                z.string().nonempty().describe('Key filed of a Policy.')
            )
        }).describe('Remove policies'),
        z.object({
            op: z.literal('removeall'),
        }).describe('Remove all policies'),
        z.object({
            op: z.literal('rename'),
            data: z.array(z.object({
                old: z.string().nonempty().describe('Original key field value'),
                new: z.string().nonempty().describe('New key field value')
            }))
        }).describe('Modify the key field value of the policies.'),
    ]).optional().describe('Policy setting. Policy is a data field with a consensus on its meaning, management, and value.'),
    data: z.union([
        z.object({
            op:z.literal('add'),
            data: z.union([
                z.object({
                    key: z.string().nonempty().describe('The field name'),
                    data: z.array(z.object({
                        address: RepositoryAddressID,
                        bcsBytes: SafeUint8ArraySchema.describe('The data.'),
                        value_type: ValueTypeSchema.optional()
                    }).describe('Under the data field, the data corresponding to the address. If value_type is defined, bcsBytes is the raw data. ' + 
                        'If value_type is not defined, the first byte of bscBytes represents value_type, followed by the raw data.'))
                }).describe('Under the data field, different data(including wowok data type:ValueTypeSchema) corresponding to different addresses.'),
                z.object({
                    address: RepositoryAddressID,
                    data: z.array(z.object({
                        key:z.string().nonempty().describe('The field name'),
                        bcsBytes: SafeUint8ArraySchema.describe('The data.'),
                    })),
                    value_type: ValueTypeSchema.optional()
                }).describe('Data under one address and different data fields. If value_type is defined, bcsBytes is the raw data. ' + 
                        'If value_type is not defined, the first byte of bscBytes represents value_type, followed by the raw data.')
            ])
        }).describe('Add data to the Repository object. Each piece of data is uniquely identified by a field name and an address.'),
        z.object({
            op:z.literal('remove'),
            data: z.array(z.object({
                key: z.string().nonempty().describe('The field name'),
                address: RepositoryAddressID
            }))
        }).describe('Remove data from the Repository object. Each piece of data is uniquely identified by a field name and an address.')
    ]).optional().describe('Add or remove data to the Repository object.' + 
        'Each piece of data is uniquely identified by a field name and an address, which must be specified for querying, adding, and removing data.')
}).describe('Data definition that operates on the on-chain Repository object. The operations are performed one after the other in the field order.');

export const CallArbitrationDataSchema = z.object({
    object: ObjectTypedMainSchema,
    arb_new: z.object({
        data: z.object({
            order: z.string().nonempty().describe('The address of the Order object.'),
            description:  z.string().describe('Bifurcation description.'),
            votable_proposition: z.array(z.string()).describe('Claim of rights and interests.'+
                'Each interest and claim shall be as clear as possible to facilitate the arbitration body to vote on them separately.'),
            max_fee: TokenBalanceSchema.optional().describe('The maximum amount of arbitration fees that can be paid by the singer of the transaction. undefined means paying the arbitration fees as declared in the Arbitration.'),
        }),
        namedNew: NamedObjectSchema.optional().describe('Naming the address of a newly created Arb object.'),
    }).optional().describe('Create a new Arb object.'),
    arb_withdraw_fee:z.object({
        arb:z.string().describe(`${MarkName_Address_Description} The address of the Arb object.`),
        data: PayParamSchema.describe('Withdraw parameters.'),
    }).optional().describe(`Extract arbitration fees from the Arb object to the specific Treasury object(Arbitration's fee_treasury field).`),
    arb_vote:z.object({
        arb:z.string().optional().describe('The address of the Arb object.' + 
            'If undefined, the newly created Arb object in the current transaction is used.'
        ),
        voting_guard: z.string().nonempty().optional().describe('The address of the Guard object.'),
        agrees: z.array(z.number().int().min(0).max(255).describe('Proposition index number')),
    }).optional().describe('Vote on the claims of the Arb object.' + 
        'If the voting_guard field of the Arbitration object is set, voting must specify the address of one of the Guard objects in the voting_guard field.'),
    arb_arbitration:z.object({
        arb:z.string().optional().describe('The address of the Arb object.' + 
            'If undefined, the newly created Arb object in the current transaction is used.'
        ),
        feedback: z.string().describe('A written description or feedback of the arbitration result.'),
        indemnity: z.union([z.number().int().min(0), z.string().nonempty()]).optional().describe('Indemnity determined by arbitration')
    }).optional().describe('Arbitrate the Arb object. ' + 
        'The order holder may withdraw the corresponding amount from the Order object with indemnity of the Arb object.'),
    
    description: z.string().optional().describe('Description of the Arbitration object'),
    endpoint: z.string().optional().describe('HTTPS endpoint of the Arbitration object.' + 
        "Used to exchange non-public information or large-capacity information in some special scenarios."
    ),
    fee: TokenBalanceSchema.optional().describe('The cost of initiating the arbitration. 0 or undefined means the arbitration is free of charge.'),
    fee_treasury: ObjectParamSchema.optional().describe('Specify a Treasury object to receive arbitration fees, or create a new Treasury object.'),
    guard:z.string().nonempty().optional().describe('The address of the Guard object.' + 
        'If set, the authentication conditions of this Guard must be met when an Arb object is created.'),
    voting_guard: z.union([
        z.object({
            op:z.union([z.literal('add'), z.literal('set')]),
            data: z.array(z.object({
                guard: z.string().nonempty().describe(`${MarkName_Address_Description} The address of the Guard object.`),
                voting_weight: z.union([z.number().int().min(1), z.string().nonempty()]).describe('Voting weight.').default(1)
            })).describe('Each Guard object corresponds to a vote weight.' + 
                'If a certain Guard authentication is passed, the vote weight corresponding to the Guard is cast.')
        }).describe('Adds or sets the vote Guard and its vote weight.'),
        z.object({
            op:z.literal('remove'),
            guards: z.array(z.string().nonempty()).describe('Addresses of the Guard objects')
        }).describe('Remove voting guards.'),
        z.object({
            op:z.literal('removeall'),
        }).describe('Remove all the voting guards.')
    ]).optional().describe('Manage voting guards and their vote weights. ' + 
        'If a certain Guard authentication is passed, the vote weight corresponding to the Guard is cast.'
    ),
    bPaused:z.boolean().optional().describe('If True, new Arb objects are allowed to be created; if False, no new Arb objects are allowed to be created.'),
}).describe('Data definition that operates on the on-chain Arbitration object. The operations are performed one after the other in the field order.'); 

export const ReceiverParamSchema = z.object({
    address: AccountOrMarkNameSchema,
    amount: TokenBalanceSchema,
}).describe(`The recipient's address and payment amount.`);

export const TreasuryWithdrawParamSchema = PayParamSchema.extend({
    receiver: z.array(ReceiverParamSchema),
    withdraw_guard: MarkNameSchema.optional().describe(`${MarkName_Address_Description} Use this Withdraw Guard for withdrawal. undefined indicates using the signer's account permissions for withdrawal.`)
});

export const CallTreasuryDataSchema = z.object({
    object: ObjectTypedMainSchema,
    deposit: z.object({
        balance:TokenBalanceSchema,
        param: PayParamSchema.optional().describe('deposit parameters.'),
    }).optional().describe('Deposit to the Treasury'),
    receive: z.union([
        z.object({
            received_objects: z.array(MarkNameSchema),
        }).describe(`Lists of the Treasury_ReceivedObject objects that received by the Treasury object.`),
        z.literal('recently').describe('Lists of the Treasury_ReceivedObject objects that received by the Treasury object in the last 50 transactions.')
    ]).describe(`Deposit the received payment objects into the Treasury.`),
    withdraw: TreasuryWithdrawParamSchema.describe(`Perform withdrawal operations via Withdraw Guard verification, or via the signer's withdrawal authority.`),

    description: z.string().optional().describe('Description of the Treasury object'),
    deposit_guard: MarkNameSchema.optional().describe('The address of the Guard object. ' + 
        'If set, a deposit to the Treasury object needs to be authenticated by this Guard to succeed.'
    ),
    withdraw_guard: z.union([
        z.object({
            op:z.union([z.literal('add'), z.literal('set')]),
            data: z.array(z.object({
                guard: MarkNameSchema.describe('The address of the Guard object.'),
                amount: TokenBalanceSchema
            })).describe('Each Guard object corresponds to a maximum withdrawal amount.')
        }).describe('Adds or sets the withdraw Guard and its maximum withdrawal amount.'),
        z.object({
            op:z.literal('remove'),
            guards: z.array(MarkNameSchema).describe('Addresses of the Guard objects')
        }).describe('Remove withdraw guards.'),
        z.object({
            op:z.literal('removeall'),
        }).describe('Remove all the withdraw guards.')
    ]).optional().describe('Manage withdraw guards and their maximum withdrawal amount. '),
    withdraw_mode:z.union([
        z.literal(WOWOK.Treasury_WithdrawMode.PERMISSION)
            .describe('Withdrawals can only be made if the corresponding operation Permission requirements in the Permission object are met.'),
        z.literal(WOWOK.Treasury_WithdrawMode.GUARD_ONLY_AND_IMMUTABLE)
            .describe('The corresponding money can be withdrawn only when the Guard object is authenticated. This setting is not reversible' + 
                'Guards are set in the withdraw_guard field of the Treasury object.'),
        z.literal(WOWOK.Treasury_WithdrawMode.BOTH_PERMISSION_AND_GUARD)
            .describe(`All withdrawal methods are supported(${WOWOK.Treasury_WithdrawMode.PERMISSION} and ${WOWOK.Treasury_WithdrawMode.GUARD_ONLY_AND_IMMUTABLE}).` ),
    ]),
}).describe('Data definition that operates on the on-chain Treasury object. The operations are performed one after the other in the field order.'); 

const ServiceWithdrawSchema = PayParamSchema.extend({
    withdraw_guard: MarkNameSchema.describe(`${MarkName_Address_Description} Use this Withdraw Guard for withdrawal.`)
});
export const CallServiceDataSchema = z.object({
    object: ObjectTypedMainSchema,
    order_new:z.object({
        buy_items: z.array(z.object({
            item: z.string().nonempty().describe('Goods name'),
            max_price: z.union([z.string(), z.number().int().min(0)]).describe('Max price of the goods'),
            count: z.union([z.string(), z.number().int().min(0)]).describe('Quantity of goods to be purchased'),
        })).describe('Goods to be purchased.'),
        discount_object: MarkNameSchema.optional().describe('The address of the Discount object that signer owned.'),
        customer_info_required: z.string().nonempty().optional().describe('customer information required for the order. '),
        namedNewOrder:NamedObjectSchema.optional().describe('Newly named Order object.'),
        namedNewProgress: NamedObjectSchema.optional().describe('Newly named Progress object.'),
    }).optional().describe('Purchase products/services, complete payment to generate an Order.'),
    order_agent: z.object({
        order: MarkNameSchema.optional().describe('The address of the Order object.' + 
            'If undefined, the newly created Order object in the current transaction is used.'
        ),
        agents: z.array(AccountOrMarkNameSchema).describe('Set the order operation agents, who will be granted order operation permissions.'),
    }).optional().describe('Set up an agent for the order. The agent may exercise the power on behalf of the order owner.'),
    order_required_info: z.object({
        order: MarkNameSchema.describe('The address of the Order object.' + 
            'If undefined, the newly created Order object in the current transaction is used.'
        ),
        customer_info_required: z.string().nonempty().optional().describe('customer information required for the order. '),
    }).optional().describe('Set or change encrypted order-sensitive information.'),
    order_refund: z.union([
        z.object({
                order: MarkNameSchema.describe('The address of the Order object.' ),
                arb: MarkNameSchema.describe('The address of the Arb object.'),
            }).describe('Refund through the Arb object'), 
        z.object({
            order: MarkNameSchema.describe('The address of the Order object.' ),
            refund_guard: MarkNameSchema.describe('The address of the refund Guard object'),
        }).describe('Refund from the order. If the Arb field is specified, refund based on the Arb arbitration result; if the refund_guard field is specified, withdraw after passing the refund_guard verification.'), 
    ]).optional().describe('Refund from the order. If the Arb field is specified, refund based on the Arb arbitration result; if the refund_guard field is specified, withdraw after passing the refund_guard verification.'),
    order_withdrawl: z.object({
        order: MarkNameSchema.describe('The address of the Order object.'),
        data: ServiceWithdrawSchema.describe('Withdraw parameters.'),
    }).optional().describe('Service provider withdraws funds from the order after passing withdraw_guard verification.'),
    order_payer: z.object({
        order: MarkNameSchema.optional().describe('The address of the Order object.' + 
            'If undefined, the newly created Order object in the current transaction is used.'
        ),
        payer_new: AccountOrMarkNameSchema,
    }).optional().describe('Set the new owner of the order, who will have all the rights to the order. This operation must be performed by the original owner of the order to succeed.'),

    description: z.string().optional().describe('Description of the Service object'),
    endpoint: z.string().optional().describe('HTTPS endpoint of the Service object.' + 
        "Used to Provide additional information for the product."),
    payee_treasury: ObjectParamSchema.optional().describe('Specify a Treasury object to receive sales revenue, or create a new Treasury object.'),
    gen_discount: z.array(z.object({
        receiver: AccountOrMarkNameSchema.describe(`${AccountOrMarkNameDescription} The address to receive the discount coupon.`),
        count: z.number().int().min(1).default(1).describe('The number of discount coupons.'),
        discount: z.object({
            name: z.string().default('').describe('The name of the coupon.'),
            type: z.union([
                z.literal(WOWOK.Service_Discount_Type.ratio).describe('Percentage-off coupon.'),
                z.literal(WOWOK.Service_Discount_Type.minus).describe('Flat-rate coupon.'),
            ]).describe('Discount type'),
            off: z.number().int().min(0).describe('Discount value. If Percentage-off coupon, -off%; If Flat-rate coupon, -off.'),
            duration_minutes: z.number().int().min(1).default(30*24*60).describe('The duration of the coupon validity period, in minutes.'),
            time_start: z.number().int().optional().describe('Discount coupon effective time(ms). undefined if the current time.'),
            price_greater: z.union([z.number().int().min(0), z.string()]).optional().describe('Discount effective condition: the amount is greater than or equal to this value.')
        })
    })).optional().describe('Send discount coupons to the addresses.'),
    repository: ObjectsOperationSchema.optional().describe('Set and manage consensus repositories for data sharing. Note: The parameter must be Repository object address.'),
    extern_withdraw_treasury: ObjectsOperationSchema.optional().describe(`Manage external withdrawal treasuries for the Service object. Note: The parameter must be Treasury object address. 
        The mode of these treasuries must be ${WOWOK.Treasury_WithdrawMode.GUARD_ONLY_AND_IMMUTABLE}, that is, withdrawals can only be made through guards. 
        These treasuries can be used for Service object default payouts, additional rewards, and other scenarios.`),
    machine: MarkNameSchema.optional().describe('The address of the Machine object, used to provide process consensus for a Service object.'),
    arbitration: ObjectsOperationSchema.optional().describe(`Set and manage Arbitrations, stating that when a dispute occurs in an order, the service provider complies with the compensation rulings of these Arbitrations. Note: The parameter must be Arbitration object address.`),
    customer_required_info: z.object({
        pubkey: z.string().nonempty().describe('The public key for encrypting the order information.'),
        required_info: z.array(z.union([
            z.literal(WOWOK.BuyRequiredEnum.address).describe('User address'),
            z.literal(WOWOK.BuyRequiredEnum.phone).describe('The phone number of the user'),
            z.literal(WOWOK.BuyRequiredEnum.postcode).describe("The postcode of the user's address"),
            z.literal(WOWOK.BuyRequiredEnum.name).describe('User name'),
            z.string().nonempty().describe('Other user information'),
        ])).describe('The type of user information to be encrypted')
    }).optional().describe(''),
    sales: z.union([
        z.object({
            op:z.literal('add'),
            sales: z.array(z.object({
                item: z.string().nonempty().describe('Goods name'),
                price: z.union([z.string(), z.number().int().min(0)]).describe('Goods price'),
                stock: z.union([z.string(), z.number().int().min(0)]).describe('Goods stock'),
                endpoint: z.string().nonempty().optional().describe('Goods endpoint')
            }).describe('Goods infomation'))
        }).describe('Shelf goods to sell'),
        z.object({
            op:z.literal('remove'),
            sales_name: z.array(z.string().nonempty().describe('Goods name'))
        }).describe('Remove goods')
    ]).optional().describe('Manage the sale of goods'),
    withdraw_guard:GuardPercentSchema.optional().describe('Management withdraw guards.'),
    refund_guard: GuardPercentSchema.optional().describe('Management refund guards.'),
    bPublished:z.boolean().optional().describe('Publish the Service object. ' + 
        'If True, The Service object will allow its Order object to be created, and data such as the Machine, Withdraw guards, Refund guards, etc. cannot be changed again. If False, it is ignored.'),
    buy_guard: MarkNameSchema.optional().describe('The address of the Guard object. ' + 
        'If set, generating new orders must be authenticated by this Guard to succeed.'),
    bPaused:z.boolean().optional().describe('If True, new Order objects are allowed to be created; if False, no new Order objects are allowed to be created.'),
    clone_new: z.object({
        token_type_new: z.string().optional().describe("The new type of token for the Service object."),
        namedNew:NamedObjectSchema.optional().describe('Newly named Service object.'),
    }).optional().describe('Clone a new Service object. Inheriting the original Settings (but not published yet), and could change the type of payment token.'),
}).describe('Data definition that operates on the on-chain Service object. The operations are performed one after the other in the field order.'); 

export const CallPersonalDataSchema = z.object({
    information: z.object({
        name: z.string().describe('The name of the personal.'),
        description: z.string().optional().describe('Personal introduction.'),
        avatar: z.string().optional().describe('Personal avatar URL.'),
        twitter: z.string().optional().describe('Personal twitter.'),
        discord: z.string().optional().describe('Personal discord.'),
        homepage: z.string().optional().describe('Personal homepage.'),
    }).optional().describe('Personal social information. including name, description, avatar, twitter, discord, and homepage.'),
    mark: z.union([
        z.object({
            op: z.literal('add'),
            data: z.array(z.object({
                address: AccountOrMarkNameSchema,
                name: z.string().optional().describe('The name for the address.'),
                tags: z.array(z.string().nonempty().describe('Tags for the address.')).optional()
            }).describe('Name and Tag an address.'))
        }).describe('Add or set a name and tags for the addresses'),
        z.object({
            op: z.literal('remove'),
            data: z.array(z.object({
                address: AccountOrMarkNameSchema,
                tags: z.array(z.string().nonempty().describe('Tags for the address.')).optional()
            }))
        }).describe('Remove tags for the addresses'),
        z.object({
            op: z.literal('removeall'),
            addresses: z.array(AccountOrMarkNameSchema)
        }).describe('These addresses are no longer marked.'),
        z.object({
            op: z.literal('transfer'),
            to: AccountOrMarkNameSchema.describe('The address that will receive my marked address information.')
        }).describe('Transfer my marked addresses information to someone else'),
        z.object({
            op: z.literal('replace'),
            mark_object: MarkNameSchema.describe('The address of the Resource object.')
        }).describe('Replace new marked addresses information by the owner.'),
        z.object({
            op: z.literal('destroy'),
        }).describe('Delete all marked addresses information, and destory the current Resource object.'),
    ]).optional().describe('Naming and management of personal marks for addresses.'),
}).describe('Data definition that operates on the on-chain Personal object. The operations are performed one after the other in the field order.'); 

export const CallObjectPermissionDataSchema = z.object({
    objects: z.array(z.string().nonempty().describe('The names or addresses of the wowok objects.')),
    new_permission: z.string().nonempty().describe('The name or address of the Permission object that Replaces the original Permission object.')
}).describe('Batch modify the on-chain Permission object of wowok objects.' + 
    'Transaction signers need to be the owner of the original Permission object in these wowok objects in order to succeed.' 
);

export const GuardWitness = z.object({
    guard: z.array(z.string().nonempty().describe('The address of the Guard object.')).describe('All addresses of Guards.'),
    witness: z.array(z.object({
        guard: z.string().nonempty().describe('The address of the Guard object.'),
        witness: z.any().describe('Value of this witness.'),
        cmd: z.array(z.number().int().min(1)).describe('The witness is used in the query command.'),
        cited: z.number().describe('Number of times the witness is cited'),
        type: ValueTypeSchema.describe('The Value type of the witness'),
        identifier: GuardIndentifierSchema.describe("The witness id in the Guard"),
    })).describe('All the witnesses.')
});

export const AccountSchema = z.string().optional().nullable().describe('The account name or address that initiated the operation.');
export const WitnessSchema = GuardWitness.optional().nullable().describe('If Guard sets witness data, it needs to be provided immediately by the transaction signer when Guard is verified.');

export const CallDemandSchemaDescription = `Operate the on-chain Demand object using the local account signatures.
The Demand object is an on-chain service requirement manager, enabling users to publish, modify, or cancel service demands via local account signatures. Core functions include defining demand types (e.g., logistics, medical consultation), setting parameters (e.g., location, symptom details), specifying execution conditions, tracking status, and assigning rewards to preferred service referrers.
Scenarios :
- Logistics : A user publishes a logistics demand with pickup/dropoff details, and sets a reward for referrers who recommend qualified delivery companies.
- Medical Consultation : A patient creates a demand for specialist consultation, including rewards for referrers who suggest verified clinics.
Key Details :

- Operated via local account signatures to ensure ownership.
- Structured fields (type, parameters, deadline, status) enable automated service matching.
- Supports lifecycle management (update, fulfill) and reward assignment to incentivize quality referrals.`; 
export const CallDemandSchema = z.object({
    data:CallDemandDataSchema,
    account: AccountSchema,
    witness: WitnessSchema,
}).describe(CallDemandSchemaDescription);

export const CallRepositorySchemaDescription = `Operate the on-chain Repository object using the local account signatures.
The Repository serves as an on-chain data warehouse, storing and managing consensus data items retrievable and maintained via a dual identifier system: an address (physical locator) and a policy (semantic name defined by multi-party consensus). It can be referenced by Guards for data validation—e.g., verifying an address's medical data in a named medical Repository to release insurance payouts from a Treasury, or using daily weather data from a named weather Repository to adjust service workflows (e.g., sport recommendations). Permissions can be flexibly configured per policy to enhance data comprehension, adoption, and maintenance.`;
export const CallRepositorySchema = z.object({
    data:CallRepositoryDataSchema,
    account: AccountSchema,
    witness: WitnessSchema,
}).describe(CallRepositorySchemaDescription);

export const CallMachineSchemaDescription = `Operate the on-chain Machine object using the local account signatures. 
    The Machine object is a core workflow management entity in the wowok protocol, designed to enable multi-user collaboration by providing three key capabilities: 
    1. **Process Orchestration**: Define multi-stage service execution flows (e.g., requirement confirmation → development → testing → acceptance) with clear step sequences and triggers, ensuring collaborative tasks proceed in a structured manner. 
    2. **Permission Governance**: Assign granular operation permissions to participating roles (e.g., only service providers can execute development steps; only purchasers can approve acceptance steps), preventing unauthorized modifications to the workflow. 
    3. **Delivery Verification**: Configure automatic validation rules via Guard conditions (e.g., verifying that deliverable hashes match predefined values or that timestamps meet deadlines), ensuring objective assessment of task completion. 
    When integrated with Service objects, Machine enforces binding constraints on service providers and payers: service providers define the collaborative process, permissions, and verification rules in the Machine when publishing services. Once a purchaser places an order, these rules are immutably recorded on-chain, ensuring both parties' commitments are enforced programmatically without arbitrary changes, thereby maintaining trust in service execution.`;
export const CallMachineSchema = z.object({
    data:CallMachineDataSchema,
    account: AccountSchema,
    witness: WitnessSchema,
}).describe(CallMachineSchemaDescription);

export const CallServiceSchemaDescription = `Operate the on-chain Service object using the local account signatures.
    Service Object enables service providers to:
        Provide products/services (including descriptions, interfaces, pricing, inventory, etc.),
        Define service processes,
        Specify arbitration commitments,
        Establish payment collection and refund commitments,
        Configure order incentives/rewards,
        Set purchaser requirements, etc..
        And the Process and delivery commitments cannot be arbitrarily modified post-purchase. 
        Through the Service Object, a purchaser's procurement and payment for services triggers the creation of a new Order instance, where the Order entity is contractually vested with the corresponding service entitlements.`;
export const CallServiceSchema = z.object({
    data:CallServiceDataSchema,
    account: AccountSchema,
    witness: WitnessSchema,
}).describe(CallServiceSchemaDescription);

export const CallTreasurySchemaDescription = `Operate the on-chain Treasury object using the local account signatures. The Treasury object serves as a centralized fund management hub for wowok protocol, supporting multi-scenario financial operations including service incentives distribution, dispute compensation execution, and operational reward disbursement.
- **Service Reward Mode**: Automatically disburses predefined incentives to service providers via smart contract triggers upon successful completion of service orders (e.g., e-commerce transaction fulfillment, travel service delivery).
- **Dispute Compensation Mode**: Executes compensation payments to order payers based on valid Arbitration results, ensuring timely fund transfer as ruled by the arbitration panel within 24 hours of result confirmation.
- **Operational Reward Mode**: Provides Guard-based fund withdrawal mechanisms for different operational personnel, with predefined withdrawal limits. For example, after completing a computational task, if the submitted result data meets the on-chain verification requirements (via Guard conditions), the operator can withdraw a designated reward amount up to the set limit.

All operations (deposit, withdrawal, transfer) are governed by the associated Permission object, ensuring authorized access and compliant fund flows. All transaction records are permanently stored on-chain for full transparency.`
export const CallTreasurySchema = z.object({
    data:CallTreasuryDataSchema,
    account: AccountSchema,
    witness: WitnessSchema,
}).describe(CallTreasurySchemaDescription);

export const CallPermissionSchemaDescription = `Operate the on-chain Permission object using the local account signatures. The Permission object is designed to manage access control for core wowok protocol entities (e.g., Machine, Service, Repository, Treasury). It defines granular operation permissions (e.g., read, write, management) for specific entities or addresses, ensuring only authorized subjects can perform designated actions on the associated on-chain objects (such as data modification, fund transfer, or configuration updates). This mechanism safeguards the security and compliance of protocol resource operations.`
export const CallPermissionSchema = z.object({
    data:CallPermissionDataSchema,
    account: AccountSchema,
    witness: WitnessSchema,
}).describe(CallPermissionSchemaDescription);

export const CallArbitrationSchemaDescription = `Operate the on-chain Arbitration object using the local account signatures. 
The Arbitration object is designed to handle order disputes, particularly those involving off-chain data, evidence, and proofs. A public arbitration panel reviews the dispute, votes, and determines the compensation amount. If the order's Service object declares support for this Arbitration, the determined compensation amount allows the order payer to immediately withdraw funds from the order.
The arbitration process and results are stored as on-chain data, which may be referenced as Guard conditions to grant the order payer additional rights, such as obtaining additional incentives or compensation commitments from the Treasury for the Service.`;
export const CallArbitrationSchema = z.object({
    data:CallArbitrationDataSchema,
    account: AccountSchema,
    witness: WitnessSchema,
}).describe(CallArbitrationSchemaDescription);

export const CallPersonalSchemaDescription = `Operate the on-chain Personal object using local account signatures, including managing public personal information (e.g., avatar URL, personal homepage address, social media accounts like Twitter/Discord, personal introduction) and named tags for addresses/wowok entity objects. The tag management facilitates self/others to understand and manage these addresses/entities, and supports operations such as liking (favoriting) or disliking specific addresses/entity objects.`;
export const CallPersonalSchema = z.object({
    data:CallPersonalDataSchema,
    account: AccountSchema,
}).describe(CallPersonalSchemaDescription);

export const CallGuardSchemaDescription = `Generate the on-chain Guard object using local account signatures. Guard is designed for conditional verification before critical on-chain operations (e.g., time-based triggers or process completion checks), leveraging Wowok's tools for querying/verifying on-chain data (including entity object content, table data, and oracle inputs).
Distinct from Permission, Guard provides finer-grained and more flexible permission validation. Once generated, its verification logic is immutable and publicly auditable, enabling reuse across various Wowok object operations.
During transaction submission requiring Guard verification, validation executes directly within the transaction using on-chain data or prover-provided evidence. Failed verification aborts the transaction; success allows execution.`;
export const CallGuardSchema = z.object({
    data:CallGuardDataSchema,
    account: AccountSchema,
}).describe(CallGuardSchemaDescription);

export const CallObejctPermissionSchemaDescription = `Batch replace on-chain Permission objects for core wowok protocol entities (Machine, Service, Repository, Treasury, Arbitration, Demand) using local account cryptographic signatures. This operation facilitates centralized access control management by replacing existing Permission objects with new ones, which define granular access rules (e.g., read/write permissions, operation authorizations) for these entity types. Transaction validity requires signers to be the original owners of the target Permission objects, ensuring alignment with wowok protocol's ownership verification mechanism.`; 
export const CallObejctPermissionSchema = z.object({
    data:CallObjectPermissionDataSchema,
    account: AccountSchema,
    witness: WitnessSchema,
}).describe(CallObejctPermissionSchemaDescription);