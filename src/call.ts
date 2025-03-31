
import { z } from "zod";
import { WOWOK } from 'wowok_agent';

const PermissioIndexArray = WOWOK.PermissionInfo.filter(i => i.index !== WOWOK.PermissionIndex.user_defined_start)
    .map(v => z.literal(v.index).describe(`module:${v.module}.name:${v.name}.description:${v.description}`));
const PermissionIndexSchema = z.union([z.literal(WOWOK.PermissionIndex.user_defined_start), z.number().int().min(WOWOK.PermissionIndex.user_defined_start+1),  ...PermissioIndexArray])
    .describe(`All permission numbers of the Wowok protocol. 
        The built-in permission number is smaller than ${WOWOK.PermissionIndex.user_defined_start}, 
        and the biz permission number that user defined is greater than or equal to ${WOWOK.PermissionIndex.user_defined_start}`);

const SafeUint8ArraySchema = z.custom<Uint8Array>((val) => 
    Object.prototype.toString.call(val) === "[object Uint8Array]"
);

const CallOldObjectSchema = z.object({
    address: z.string().describe('The address of the object.')
})

const NewObjectSchema = z.object({
    name: z.string().optional().describe('The name of the new object.'),
    tags: z.array(z.string()).optional().describe('A list of tags for the new object.')
})
const CallNewObjectWithDescriptionSchema = z.object({
    namedNew: NewObjectSchema.describe('Newly named wowok object.'),
    description: z.string().optional().describe('Description of the newly named wowok object.')
})
const ValueTypeSchema = z.nativeEnum(WOWOK.ValueType).describe('The value of the underlying data type of the Wowok protocol.');
const GuardIndentifierSchema = z.number().int().min(1).max(255);

const CallObjectSchema = z.union([CallOldObjectSchema, NewObjectSchema]);
const CallObjectWithDescriptionSchema = z.union([CallNewObjectWithDescriptionSchema, CallOldObjectSchema]);
const TokenBalanceSchema = z.union([z.string(), z.number().int().min(0)]).describe('The number of tokens.');

const PaymentIndexSchema = z.union([z.string(), z.number().int().min(0)]).describe('Transfer number.');
const PaymentRemarkSchema =  z.string().default('').describe('Notes for the transfer.');
const PaymentForObjectSchema = z.string().nonempty().optional().describe('The address of the object related to the purpose of the transfer.' + 
    'Such as a transfer operation in the Progress object.');
const PaymentForGuardSchema = z.string().nonempty().optional().describe('The address of the Guard object associated with the transfer purpose.' + 
    'Such as a transfer to pass a Guard verification.' );

const GuardFetchSchema = z.union([
    z.string().describe('Specify the address of the Guard object.'),
    z.literal('fetch').describe('Fetch the address of the Guard object in real time query.')
]);

const RepositoryOperationSchema = z.union([
    z.object({
        op: z.union([z.literal('set'), z.literal('remove'), z.literal('add')]),
        repositories: z.array(z.string()).describe('Addresses of the Repository object.')
    }).describe('set or remove or add repositories.'),
    z.object({
        op: z.literal('removeall')
    }).describe('remove all the repositories.')
]);

const OrderCryptoInfoSchema = z.object({
    customer_pubkey: z.string().nonempty().optional().describe('The public key for encrypting the order information'),
    customer_info_crypt: z.string().nonempty().optional().describe('Encrypted order information'),
}).optional().describe('The order sensitive information Encrypted data');

const GuardNodeSchema: z.ZodType = z.union([
    z.object({
        identifier: GuardIndentifierSchema.describe('Data from the Guard table corresponding to the identifier.')
    }).describe('Data from the Guard table corresponding to the identifier.'), 
    z.object({
        query: z.number().int().describe('Data query ID. The query_id field of GuardQuery structure.'),
        object: z.union([z.string().describe('The address of the object to query.'), 
            GuardIndentifierSchema.describe('The address of the object to query from the Guard table corresponding to the identifier.')
        ]).describe('The object to query'),
        parameters: z.lazy(() => z.array(GuardNodeSchema)).describe('All the child nodes.'+ 
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
        parameters: z.lazy(() => z.array(GuardNodeSchema)).describe('All the child nodes.'+ 
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
        parameters: z.lazy(() => z.array(GuardNodeSchema)).describe('All the child nodes.'+ 
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
]).describe('Generates data for a Guard node');

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
            guard: z.string().nonempty().describe('The address of the Guard object'),
            percent: z.number().int().min(0).max(100).describe(' Numeric value without the percent sign')
        }).describe('The address of Guard object and the corresponding value.'))
    }).describe('Add the guards.'), 
    z.object({
        op: z.literal('remove'), 
        addresses: z.array(z.string().nonempty().describe('The address of the Guard object'))
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
    type_parameter: z.string().describe("Type of Demand bounties. For example, Coin object: 0x2::coin::Coin<0x2::sui::SUI>, or NFT object: 0x1234::nft:NFT."),
    object: CallObjectSchema.optional().describe('Modify the existing Demand object or build a new one.'),
    permission: CallObjectWithDescriptionSchema.optional().describe('Specify Permission object that manages rights or build a new one'),
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
            address:z.string().describe('The object address owned by the transaction signer.')}), 
            z.object({balance:TokenBalanceSchema}).describe('The number of assets of the token type that owned by the transaction signer, If the bounty type is 0x2::coin::Coin<... >')
            ]).optional().describe('Demand bounty that transaction signature paid')    
        }), z.object({
            op:z.literal('reward').describe('Reward bounty to the service recommender'),
            service:z.string().describe('The address of the Service object.')
        }), z.object({
            op:z.literal('refund').describe('Retrieve the bounty. ' + 
                'If no service meets the Demand, the demand-related authority can retrieve the bounty after the promised time (time_expire).')
        })]).optional().describe('Operation on bounty'),
    present:z.object({
        service:z.union([GuardIndentifierSchema.describe('The Service object identifier number specified in the Guard, if had already set.'+
                'When passing Guard verification, the recommender must provide the address of the specific Service object.'),
            z.string().describe('The address of the Service object recommended.')
        ]).describe('Recommended service.'),
        recommend_words:z.string().describe('Service recommendation words.'),
        service_pay_type: z.string().describe('The payment token type of the service.'),
        guard:GuardFetchSchema.optional().describe('Specify the Guard to validate.'+
            'If the guard of the Demand object is set, the service recommender must meet the condition verification of the Guard in order to successfully recommend.')
    }).optional().describe('Recommend service to the Demand object.'),
    guard:z.object({
        address: z.string().describe('The address of the Guard object.'),
        service_id_in_guard:GuardIndentifierSchema.optional().describe('Identifier in the Guard object. When a service is recommended to Demand, the service object is validated with the Identifier, if specified.')
    }).optional().describe('Recommend to Demand the Guard condition validation that any service needs to meet. Such as service rating, service referrer history, etc. '+
        'Once Guard is set, the service is recommended to Demand only after the Guard condition is verified.')
    }).describe('Data definition that operates on the Demand object.'); 

export const CallGuardDataSchema = z.object({
    namedNew: NewObjectSchema.optional().describe('Newly named Guard object.'),
    description: z.string().optional().describe('Description of the Guard object.'),
    table:z.array(z.object({
        identifier:GuardIndentifierSchema.describe('Identifier for a constant or a witness'),
        bWitness:z.boolean().describe('Whether the data is witness. True for a witness data, false for a const data.'),
        value_type: ValueTypeSchema,
        value: z.any().optional().describe('Data value for a constant, Ignored if the data is a witness.')
    })).optional().describe('Data table for Const or Witness'),
    root:GuardNodeSchema
}).describe('Data definition that operates on the Guard object.');

export const CallMachineDataSchema = z.object({
    object: CallObjectSchema.optional().describe('Modify the existing Machine object or build a new one.'),
    permission: CallObjectWithDescriptionSchema.optional().describe('Specify Permission object that manages rights or build a new one.'),
    description: z.string().optional().describe('Description of the Machine object'),
    endpoint: z.string().optional().describe('HTTPS endpoint of the Machine object.' + 
        "The Endpoint provides a view that allows the Machine's Progress to integrate complex operations at each node to complete a commit. " + 
        "If there are complex Guard condition validations, it is recommended to use an Endpoint to simplify operator operations.",
    ),
    consensus_repository: RepositoryOperationSchema.optional().describe('consensus repository operations.'),
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
    progress_new:z.object({
        task_address:z.string().nonempty().optional().describe('The task that the Progress object performs, such as an Order object address.' + 
            'Once a task for the Progress object is set, it cannot be changed again.'
        ),
        namedNew: NewObjectSchema.optional().describe('Newly named Progress object.'),
        }).optional().describe('Create a new Progress object for the Machine object. ' + 
            'The new Progress uses the processes, operations, and permissions already defined by the Machine object.' + 
            'If the Machine Object is not published, the creation fails.'),
    progress_context_repository: z.object({
        progress:z.string().optional().describe('The address of the Progress object.' + 
            'If undefined, the newly created Progress object in the current transaction is used.'
        ),
        repository:z.string().optional().describe('The address of the Repository object.' + 
            'If undefined, unset the context repository for the Progress object.'
        ),
    }).optional().describe('Set or unset the context repository for the Progress object.'),
    progress_namedOperator: z.object({
        progress:z.string().optional().describe('The address of the Progress object.' + 
            'If undefined, the newly created Progress object in the current transaction is used.'
        ),
        data:z.array(z.object({
            name:z.string().nonempty().describe('The namespace defined in the Machine node.'),
            operators:z.array(z.string().nonempty()).describe('Operator addresses.')
        })).describe('A list of operator addresses for different namespaces')
    }).optional().describe("Add the operator addresses to the namespace defined by the Machine node, " + 
        "so that these operators have corresponding operation permissions in the Progress. " + 
        "The namespace of each Progress created by Machine is independent, and its operator Settings are independent of each other."),
    progress_parent: z.object({
        progress:z.string().optional().describe('The address of the Progress object.' + 
            'If undefined, the newly created Progress object in the current transaction is used.'
        ),
        parent:z.object({
            parent_id: z.string().nonempty().describe('The address of the parent Progress object.'),
            parent_session_id: z.number().int().min(0).describe('A number in the parent Progress object session list. '+ 
                'The session number of each node of the Progress object is different. Each number corresponds sequentially to each of its working nodes.' + 
                'The initial node session number is 0, and its value increases by 1 for each working node.'
            ),
            operation: ProgressOperationSchema
        }).optional().describe('The parent Progress object and the session operation it performs.')
    }).optional().describe("Set the parent Progress object for the Progress object to determine its relationship graph."),
    progress_task: z.object({
        progress:z.string().optional().describe('The address of the Progress object.' + 
            'If undefined, the newly created Progress object in the current transaction is used.'
        ),
        task:z.string().nonempty().describe('The task that the Progress object performs, such as an Order object address.' + 
            'Once a task for the Progress object is set, it cannot be changed again.'
        ),
    }).optional().describe("Set the task of a Progress object. A Progress object can be set only once, for example, an Order object."),   
    progress_hold: z.object({
        progress:z.string().optional().describe('The address of the Progress object.' + 
            'If undefined, the newly created Progress object in the current transaction is used.'
        ),
        operation:ProgressOperationSchema,
        bHold: z.boolean().describe('If True, make sure that only the current transaction signer completes the operation; ' + 
            'If False, other authorized operators can complete the operation.'),
        adminUnhold: z.boolean().optional().describe('If the signer of the current transaction is the relevant authority in the Machine, '+
            'it can cancel the operation that is uniformly owned by one operator.'),
    }).optional().describe('Sole possession or unpossession of the current operation of the Progress object. ' + 
        'It is used when an operation may take a long time and does not require the participation of more people.' + 
        'Simple and quick operations ignore this setting.'), 
    progress_next: z.object({
        progress:z.string().describe('The address of the Progress object.' + 
            'If undefined, the newly created Progress object in the current transaction is used.'
        ),
        operation:ProgressOperationSchema,
        deliverable: z.object({
            msg: z.string().describe('The log or message that completes the operation.'),
            orders: z.array(z.object({
                object: z.string().nonempty().describe('The address of the Order object.'),
                pay_token_type: z.string().nonempty().describe('The payment token type of the order.'),
            })).describe('The operation generates orders in the supply chain.')
        }).describe('Submission information to complete the operation.'),
        guard:GuardFetchSchema.optional().describe('Specify the Guard to validate.'+
            'If the guard of the operation is set, the operator must meet the condition verification of the Guard in order to successfully complete the operation.')
    }).optional().describe('Complete an operation.'),    
    bPaused: z.boolean().optional().describe('If Machine is already published, the creation of new Progress is paused if True, and new Progress is allowed if False. ' + 
        'The generated Progress is not affected.'),
    clone_new: z.object({
        namedNew: NewObjectSchema.optional().describe('Newly named Machine object.'),
    }).optional().describe('The promised Settings cannot be changed after the Machine is published. ' + 
        'Clone allows it to be retained to copy a new Machine, inherit its Settings, and can be modified and released at any time.'),
}).describe('Data definition that operates on the Machine object.'); 

export const CallPermissionDataSchema = z.object({
    object: CallObjectSchema.optional().describe('Modify the existing Permission object or build a new one.'),
    description: z.string().optional().describe('Description of the Permission object.'),
    admin: z.union([
        z.object({
            op: z.union([z.literal('add'), z.literal('remove'), z.literal('set')]),
            addresses:z.array(z.string()).describe('Addresses')
        }).describe('Add, delete, and set an administrator address list.'),
        z.object({
            op:z.literal('removeall')
        }).describe('Delete all Administrators')
    ]).optional().describe('To manage the administrator list, only the builder of the Permission object has permission to operate it.'),
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
                address: z.string().nonempty().describe('The address'),
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
                    address: z.string().nonempty().describe('The address'),
                    guard: z.string().nonempty().optional().describe('The address of the Guard object.' + 
                        'If set, to exercise of this permission, the address must also meet guard authentication conditions.'
                    )
                }).describe('Add addresses for a permission that can be exercised'))
            }))
        }).describe('Add addresses for permissions'),
        z.object({
            op:z.literal('remove entity'),
            addresses:z.array(z.string().nonempty().describe('The address'))
        }).describe('Delete addresses and its permissions from the Permission Object. Administrator addresses is not affected.'),
        z.object({
            op:z.literal('remove permission'),
            address:z.string().nonempty().describe('The address'),
            index: z.array(PermissionIndexSchema),
        }).describe('Remove some permissions for an address'),
        z.object({
            op:z.literal('transfer permission'),
            from_address:z.string().nonempty().describe('The address where all permissions need to be transferred'),
            to_address: z.string().nonempty().describe('The address that accepts the transferred permissions'),
        }).describe('Transfer all permissions from one address to another. ' + 
            'The address for receiving permissions must be the new address of the Permission object.'),
    ]).optional().describe('Personnel address and permission assignment.'),
    builder: z.string().nonempty().optional().describe('Modify the builder address.' + 
        'The Builder is the highest Permission object owner and has only one address.' + 
        'The default is the address of the signer of the transaction that created the Permission object.')
}).describe('Data definition that operates on the Permission object.');

export const CallRepositoryDataSchema = z.object({
    object: CallObjectSchema.optional().describe('Modify the existing Repository object or build a new one.'),
    permission: CallObjectWithDescriptionSchema.optional().describe('Specify Permission object that manages rights or build a new one.'),
    description: z.string().optional().describe('Description of the Repository object.'),
    reference: z.union([
        z.object({
            op: z.union([z.literal('add'), z.literal('remove'), z.literal('set')]),
            addresses:z.array(z.string()).describe('Addresses')
        }).describe('Add, delete, and set an reference address list.'),
        z.object({
            op:z.literal('removeall')
        }).describe('Remove all reference addresses.')
    ]).optional().describe('Manage and set the Repository object to be used by other wowok objects.'),
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
                        address: z.string().nonempty().describe('The address.'),
                        bcsBytes: SafeUint8ArraySchema.describe('The data.'),
                        value_type: ValueTypeSchema.optional()
                    }).describe('Under the data field, the data corresponding to the address. If value_type is defined, bcsBytes is the raw data. ' + 
                        'If value_type is not defined, the first byte of bscBytes represents value_type, followed by the raw data.'))
                }).describe('Under the data field, different data(including wowok data type:ValueTypeSchema) corresponding to different addresses.'),
                z.object({
                    address: z.string().nonempty().describe('The address'),
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
                address: z.string().nonempty().describe('The address'),
            }))
        }).describe('Remove data from the Repository object. Each piece of data is uniquely identified by a field name and an address.')
    ]).optional().describe('Add or remove data to the Repository object.' + 
        'Each piece of data is uniquely identified by a field name and an address, which must be specified for querying, adding, and removing data.')
}).describe('Data definition that operates on the Repository object.');

export const CallArbitrationDataSchema = z.object({
    type_parameter: z.string().describe("The type of token paid for the Arbitration object. For example, 0x2::sui::SUI."),
    object: CallObjectSchema.optional().describe('Modify the existing Arbitration object or build a new one.'),
    permission: CallObjectWithDescriptionSchema.optional().describe('Specify Permission object that manages rights or build a new one'),
    description: z.string().optional().describe('Description of the Arbitration object'),
    endpoint: z.string().optional().describe('HTTPS endpoint of the Arbitration object.' + 
        "Used to exchange non-public information or large-capacity information in some special scenarios."
    ),
    fee: TokenBalanceSchema.optional().describe('The cost of initiating the arbitration. 0 or undefined means the arbitration is free of charge.'),
    fee_treasury: CallObjectWithDescriptionSchema.optional().describe('Specify a Treasury object to receive arbitration fees, or create a new Treasury object.'),
    arb_new: z.object({
        data: z.object({
            order: z.string().nonempty().describe('The address of the Order object.'),
            order_token_type: z.string().nonempty().describe('The payment token type of the order.'),
            description:  z.string().describe('Bifurcation description.'),
            votable_proposition: z.array(z.string()).describe('Claim of rights and interests.'+
                'Each interest and claim shall be as clear as possible to facilitate the arbitration body to vote on them separately.'),
            fee: TokenBalanceSchema
        }),
        guard:GuardFetchSchema.optional().describe('Specify the Guard to validate.'),
        namedNew: NewObjectSchema.optional().describe('Newly named Arb object.'),
    }).optional().describe('Create a new Arb object.'),
    arb_withdraw_fee:z.object({
        arb:z.string().optional().describe('The address of the Arb object.' + 
            'If undefined, the newly created Arb object in the current transaction is used.'
        ),
        data: z.object({
            treasury:z.string().describe('The address of the Treasury object.' + 
                'The value must be the same as fee_treasury of Arbitration.'
            ),
            index: PaymentIndexSchema.default(0),
            remark: PaymentRemarkSchema.default(''),
            for_object: PaymentForObjectSchema,
            for_guard: PaymentForGuardSchema,
        })
    }).optional().describe('Extract arbitration fees from the Arb object to the specific Treasury object.'),
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
        indemnity: z.union([z.number().int().min(0), z.string()]).optional().describe('Indemnity determined by arbitration')
    }).optional().describe('Arbitrate the Arb object. ' + 
        'The order holder may withdraw the corresponding amount from the Order object with indemnity of the Arb object.'),
    guard:z.string().nonempty().optional().describe('The address of the Guard object.' + 
        'If set, the authentication conditions of this Guard must be met when an Arb object is created.'),
    voting_guard: z.union([
        z.object({
            op:z.union([z.literal('add'), z.literal('set')]),
            data: z.array(z.object({
                guard: z.string().nonempty().describe('The address of the Guard object.'),
                voting_weight: z.union([z.number().int().min(1), z.string()]).describe('Voting weight.')
            })).describe('Each Guard object corresponds to a vote weight.' + 
                'If a certain Guard authentication is passed, the vote weight corresponding to the Guard is cast.')
        }).describe('Adds or sets the vote Guard and its vote weight.'),
        z.object({
            op:z.literal('remove'),
            guards: z.array(z.string().nonempty()).describe('Addresses of the Guard objects')
        }).describe('Remove voting guards.'),
        z.object({
            op:z.literal('removeal'),
        }).describe('Remove all the voting guards.')
    ]).optional().describe('Manage voting guards and their vote weights. ' + 
        'If a certain Guard authentication is passed, the vote weight corresponding to the Guard is cast.'
    ),
    bPaused:z.boolean().optional().describe('If True, new Arb objects are allowed to be created; if False, no new Arb objects are allowed to be created.'),
}).describe('Data definition that operates on the Arbitration object.'); 

export const CallTreasuryDataSchema = z.object({
    type_parameter: z.string().describe("The type of token for the Treasury object. For example, 0x2::sui::SUI."),
    object: CallObjectSchema.optional().describe('Modify the existing Treasury object or build a new one.'),
    permission: CallObjectWithDescriptionSchema.optional().describe('Specify Permission object that manages rights or build a new one'),
    description: z.string().optional().describe('Description of the Treasury object'),
    deposit: z.object({
        data: z.object({
            balance:TokenBalanceSchema,
            index: PaymentIndexSchema.default(0).optional(),
            remark: PaymentRemarkSchema.optional(),
            for_object: PaymentForObjectSchema.optional(),
            for_guard: PaymentForGuardSchema.optional()
        }),
        guard: GuardFetchSchema.optional()
    }).optional().describe('Make a deposit to the Treasury object.'),
    receive: z.object({
        payment: z.string().nonempty().describe('The address of the Payment object.'),
        received_object: z.string().nonempty().describe('The address of the Receiving<CoinWrapper<T>> object that received by the Treasury object.'),
    }).describe('Records the money received by the Treasury object.'),
    withdraw: z.object({
        items: z.array(z.object({
            address: z.string().nonempty().describe('The address'),
            amount: TokenBalanceSchema
        })).describe('All addresses and the amount they received.'),
        index: PaymentIndexSchema.default(0),
        remark: PaymentRemarkSchema.default(''),
        for_object: PaymentForObjectSchema,
        for_guard: PaymentForGuardSchema,
        withdraw_guard: z.string().nonempty().optional().describe('The address of the Guard object.'),
    }).optional().describe('Transfer withdrawals from Treasury object to addresses.'),
    deposit_guard: z.string().nonempty().optional().describe('The address of the Guard object. ' + 
        'If set, a deposit to the Treasury object needs to be authenticated by this Guard to succeed.'
    ),
    withdraw_guard: z.union([
        z.object({
            op:z.union([z.literal('add'), z.literal('set')]),
            data: z.array(z.object({
                guard: z.string().nonempty().describe('The address of the Guard object.'),
                amount: TokenBalanceSchema
            })).describe('Each Guard object corresponds to a maximum withdrawal amount.')
        }).describe('Adds or sets the withdraw Guard and its maximum withdrawal amount.'),
        z.object({
            op:z.literal('remove'),
            guards: z.array(z.string().nonempty()).describe('Addresses of the Guard objects')
        }).describe('Remove withdraw guards.'),
        z.object({
            op:z.literal('removeal'),
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
}).describe('Data definition that operates on the Treasury object.'); 

export const CallServiceDataSchema = z.object({
    type_parameter: z.string().describe("The type of token for the Service object. For example, 0x2::sui::SUI."),
    object: CallObjectSchema.optional().describe('Modify the existing Service object or build a new one.'),
    permission: CallObjectWithDescriptionSchema.optional().describe('Specify Permission object that manages rights or build a new one'),
    description: z.string().optional().describe('Description of the Service object'),
    endpoint: z.string().optional().describe('HTTPS endpoint of the Service object.' + 
        "Used to Provide additional information for the product."),
    payee_treasury: CallObjectWithDescriptionSchema.optional().describe('Specify a Treasury object to receive sales revenue, or create a new Treasury object.'),
    gen_discount: z.array(z.object({
        receiver: z.string().nonempty().describe('The address to receive the discount coupon.'),
        count: z.number().int().min(1).default(1).describe('The number of discount coupons.'),
        discount: z.object({
            name: z.string().default('').describe('The name of the coupon.'),
            type: z.union([
                z.literal(WOWOK.Service_Discount_Type.ratio).describe('Percentage-off coupon.'),
                z.literal(WOWOK.Service_Discount_Type.minus).describe('Flat-rate coupon.'),
            ]).describe('Discount type'),
            off: z.number().int().min(0).describe('Discount value. If Percentage-off coupon, -off%; If Flat-rate coupon, -off.'),
            duration_minutes: z.number().int().min(1).default(30*24*60).describe('The duration of the coupon validity period, in minutes.'),
            time_start: z.number().int().optional().describe('Discount coupon effective time. undefined if current time.'),
            price_greater: z.union([z.number().int().min(0), z.string()]).optional().describe('Discount effective condition: the amount is greater than or equal to this value.')
        })
    })).optional().describe('Send discount coupons to the addresses.'),
    repository: RepositoryOperationSchema.optional().describe('consensus repository operations.'),
    extern_withdraw_treasury: z.union([
        z.object({
            op:z.union([z.literal('add'), z.literal('set')]),
            treasuries: z.array(z.object({
                address: z.string().nonempty().describe('The address of the Treasury object.'),
                token_type: z.string().nonempty().describe('The payment token type of the Treasury object.'),
            }))
        }).describe('Add or set treasuries.'),
        z.object({
            op:z.literal('remove'),
            addresses: z.array(z.string().nonempty().describe('The address of the Treasury object.'))
        }).describe('Remove treasuries.'),
        z.object({
            op:z.literal('removeall'),
        }).describe('Remove all treasuries.'),
    ]).optional().describe(`Manage external withdrawal treasuries for the Service object.  
        The mode of these treasuries must be ${WOWOK.Treasury_WithdrawMode.GUARD_ONLY_AND_IMMUTABLE}, that is, withdrawals can only be made through guards. 
        These treasuries can be used for Service object default payouts, additional rewards, and other scenarios.`),
    machine: z.string().nonempty().optional().describe('The address of the Machine object, used to provide process consensus for a Service object.'),
    arbitration: z.union([
        z.object({
            op:z.union([z.literal('add'), z.literal('set')]),
            treasuries: z.array(z.object({
                address: z.string().nonempty().describe('The address of the Arbitration object.'),
                token_type: z.string().nonempty().describe('The payment token type of the Arbitration object.'),
            }))
        }).describe('Add or set Arbitration objects.'),
        z.object({
            op:z.literal('remove'),
            addresses: z.array(z.string().nonempty().describe('The address of the Arbitration object.'))
        }).describe('Remove Arbitration objects.'),
        z.object({
            op:z.literal('removeall'),
        }).describe('Remove all Arbitration objects.'),
    ]).optional().describe(`Manage arbitrations for the Service object. Arbitration object is used to provide dispute arbitration for orders.`),
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
    order_new:z.object({
        buy_items: z.array(z.object({
            item: z.string().nonempty().describe('Goods name'),
            max_price: z.union([z.string(), z.number().int().min(0)]).describe('Max price of the goods'),
            count: z.union([z.string(), z.number().int().min(0)]).describe('Quantity of goods to be purchased'),
        })).describe('Goods to be purchased.'),
        discount: z.string().nonempty().optional().describe('The address of the Discount object.'),
        machine: z.string().nonempty().optional().describe('The address of the Machine object. The value must be the same as the value of the machine field of the Service object.'),
        customer_info_crypto: OrderCryptoInfoSchema,
        guard: GuardFetchSchema.optional().describe('The address of the Guard object.'),
        namedNewOrder:NewObjectSchema.optional().describe('Newly named Order object.'),
        namedNewProgress: NewObjectSchema.optional().describe('Newly named Progress object.'),
    }).optional().describe('Create a new order.'),
    order_agent: z.object({
        order: z.string().optional().describe('The address of the Order object.' + 
            'If undefined, the newly created Order object in the current transaction is used.'
        ),
        agents: z.array(z.string().optional().describe('The address of the agent.')),
        progress: z.string().optional().describe('The address of the Progress object.' + 
            'If undefined, the newly created Progress object in the current transaction is used.'
        ),
    }).optional().describe('Set up an agent for the order. The agent may exercise the power on behalf of the order owner.'),
    order_required_info: z.object({
        order: z.string().optional().describe('The address of the Order object.' + 
            'If undefined, the newly created Order object in the current transaction is used.'
        ),
        info: OrderCryptoInfoSchema
    }).optional().describe('Set or change encrypted order-sensitive information.'),
    order_refund: z.union([
        z.object({
            order: z.string().optional().describe('The address of the Order object.' + 
                'If undefined, the newly created Order object in the current transaction is used.'
            ),
            guard: z.string().optional().describe('The address of the refund Guard object.')
        }).describe('Refund through the refund guard.'),
        z.object({
            order: z.string().optional().describe('The address of the Order object.' + 
                'If undefined, the newly created Order object in the current transaction is used.'
            ),
            arb: z.string().nonempty().describe('The address of the Arb object.'),
            arb_token_type:z.string().nonempty().describe('The token type of the Arb object.'),
        }).describe('Refund through the Arb object.')
    ]).optional().describe('Refund of order'),
    order_withdrawl: z.object({
        order: z.string().optional().describe('The address of the Order object.' + 
            'If undefined, the newly created Order object in the current transaction is used.'
        ),
        data: z.object({
            withdraw_guard: z.string().nonempty().describe('The address of the withdraw guard object.'),
            treasury: z.string().nonempty().describe('The address of the Treasury object.' + 
                'The value must be consistent with the payee_treasury field of the Service object.'
            ),
            index: PaymentIndexSchema,
            remark: PaymentRemarkSchema,
            for_object: PaymentForObjectSchema,
            for_guard: PaymentForGuardSchema,
        })
    }).optional().describe('Make a withdrawal on the order'),
    order_payer: z.object({
        order: z.string().optional().describe('The address of the Order object.' + 
            'If undefined, the newly created Order object in the current transaction is used.'
        ),
        progress: z.string().optional().describe('The address of the Progress object.' + 
            'If undefined, the newly created Progress object in the current transaction is used.'
        ),
        payer_new: z.string().nonempty().describe('The new owner address of the Order object.'),
    }).optional().describe('Transfer ownership of the order to another address.'),
    buy_guard: z.string().nonempty().optional().describe('The address of the Guard object. ' + 
        'If set, generating new orders must be authenticated by this Guard to succeed.'),
    bPaused:z.boolean().optional().describe('If True, new Order objects are allowed to be created; if False, no new Order objects are allowed to be created.'),
    clone_new: z.object({
        token_type_new: z.string().optional().describe("The new type of token for the Service object."),
        namedNew:NewObjectSchema.optional().describe('Newly named Service object.'),
    }).optional().describe('Clone a new Service object. Inheriting the original Settings (but not published yet), and could change the type of payment token.'),
}).describe('Data definition that operates on the Service object.'); 

export const CallPersonalDataSchema = z.object({
    object: CallObjectSchema.optional().describe('Modify the existing Personal object or build a new one.'),
    information: z.object({
        name: z.string().describe('The name of the personal.'),
        description: z.string().optional().describe('Personal introduction.'),
        avatar: z.string().optional().describe('Personal avatar URL.'),
        twitter: z.string().optional().describe('Personal twitter.'),
        discord: z.string().optional().describe('Personal discord.'),
        homepage: z.string().optional().describe('Personal homepage.'),
    }).optional().describe('Personal social information'),
    mark: z.union([
        z.object({
            op: z.literal('add or set'),
            data: z.array(z.object({
                address: z.string().nonempty().describe('The address'),
                name: z.string().optional().describe('The name for the address.'),
                tags: z.array(z.string().nonempty().describe('Tags for the address.'))
            }).describe('Name and Tag an address.'))
        }).describe('Add or set a name and tags for the addresses'),
        z.object({
            op: z.literal('remove'),
            data: z.array(z.object({
                address: z.string().nonempty().describe('The address'),
                tags: z.array(z.string().nonempty().describe('Tags for the address.'))
            }))
        }).describe('Remove tags for the addresses'),
        z.object({
            op: z.literal('removeall'),
            addresses: z.array(z.string().nonempty().describe('Addresses'))
        }).describe('These addresses are no longer marked.'),
        z.object({
            op: z.literal('transfer'),
            address: z.string().nonempty().describe('The address that will receive my marked address information.')
        }).describe('Transfer my marked addresses information to someone else'),
        z.object({
            op: z.literal('replace'),
            address: z.string().nonempty().describe('The address of the Resource object.')
        }).describe('Replace new marked addresses information by the owner.'),
        z.object({
            op: z.literal('destory'),
        }).describe('Delete all marked addresses information, and destory the current Resource object.'),
    ]).optional().describe('Naming and management of personal marks(Resource object).')
}).describe('Data definition that operates on the Personal infomation.'); 

export const CallObjectPermissionDataSchema = z.object({
    objects: z.array(z.string().nonempty().describe('The address of the wowok object.')),
    new_permission: z.string().nonempty().describe('The address of the Permission object that Replaces the original Permission object.')
}).describe('Batch modify the Permission object of wowok objects.' + 
    'Transaction signers need to be the owner of the original Permission object in these wowok objects in order to succeed.'
); 