import { z } from "zod";
import { BalanceOrCoin, LocalInfoNameDefault, } from "wowok_agent";
export const QueryAccountSchemaDescription = `Query the account address and its balance or coin objects.`;
export const QueryAccountSchema = z.object({
    name_or_address: z.string().optional().describe("Your account name or address. undefined means default account."),
    balance_or_coin: z.nativeEnum(BalanceOrCoin).optional().describe("Query the balance or coin objects of the account."),
    token_type: z.string().optional().describe("Token type, default to 0x2::sui::SUI if not specified."),
}).describe(QueryAccountSchemaDescription);
export const AccountOperationSchemaDescription = `Account operation, such as generate a new account, set the default account, suspend or reactivate the account, set the name of the account or transfer tokens from one account to another. '
    'Accounts are stored and managed locally on the device and provide necessary signatures for on-chain operations to ensure their successful execution.'
    'The operations are performed one after the other in the field order.`;
export const AccountOperationSchema = z.object({
    gen: z.object({
        name: z.string().nonempty().optional().describe("Account name."),
        default: z.boolean().optional().describe("Whether to set the generated account as the default account."),
    }).optional().describe("Generate a new account."),
    default: z.object({
        name_or_address: z.string().nonempty().describe("The name or address of the account to set as the default account."),
    }).optional().describe("Set the default account."),
    suspend: z.object({
        name_or_address: z.string().optional().describe("The name or address of the account to suspend. undefined means default account."),
        suspend: z.boolean().optional().describe("Whether to suspend the account. If not specified, suspend the default account."),
    }).optional().describe("Suspend or reactivate the account."),
    name: z.object({
        new_name: z.string().nonempty().describe("The name to set for the account."),
        name_or_address: z.string().optional().describe("The name or address of the account to set the name for. undefined means default account."),
    }).optional().describe("Set the name of the account."),
    transfer: z.object({
        name_or_address_from: z.string().optional().describe("The name or address of the account to transfer from. undefined means default account."),
        name_or_address_to: z.string().optional().describe("The name or address of the account to transfer to. undefined means default account."),
        amount: z.union([z.string(), z.number()]).describe("The amount to transfer. Must be a positive integer."),
        token_type: z.string().optional().describe("Token type, default to 0x2::sui::SUI if not specified."),
    }).optional().describe("Transfer tokens from one account to another."),
}).describe(AccountOperationSchemaDescription);
export const LocalMarkOperationSchemaDescription = `Local mark operation, such as add or set local marks, remove local marks or remove all local marks.
    Local mark enables faster object address management and querying through the name and its tags.`;
export const LocalMarkOperationSchema = z.object({
    data: z.union([
        z.object({ op: z.literal('removeall') }).describe("Remove all local marks."),
        z.object({ op: z.literal('add'), data: z.array(z.object({
                name: z.string().describe("The name of the mark."),
                address: z.string().describe("The address to mark."),
                tags: z.array(z.string()).optional().describe("The tags of the mark."),
                useAddressIfNameExist: z.boolean().optional().describe("Whether to use the address if the name already exists. Otherwise, use this name and change the original name to its address."),
            })) }).describe("Add or set local marks."),
        z.object({ op: z.literal('remove'), data: z.array(z.string().describe('The name of the mark')) }).describe("Remove local marks."),
    ])
}).describe(LocalMarkOperationSchemaDescription);
export const LocalInfoOperationSchemaDescription = `Local info operation, such as add local info or remove local info.
    Local info allows storing personal information (e.g. addresses, phone numbers) on-device, which can be cryptographically processed and shared with service providers.`;
export const LocalInfoOperationSchema = z.object({
    data: z.union([
        z.object({
            op: z.literal('removeall')
        }).describe("Whether to remove all local info."),
        z.object({
            op: z.literal('add'),
            data: z.array(z.object({
                name: z.string().default(LocalInfoNameDefault).describe("The name of the local info."),
                content: z.string().describe("The content of the local info."),
                bdefault: z.boolean().optional().describe("Whether to set the content as default."),
            }))
        }).describe("Add local info."),
        z.object({
            op: z.literal('remove'),
            data: z.array(z.string().describe('The name of the local info.'))
        }).describe("Remove local info by name."),
    ])
}).describe(LocalInfoOperationSchemaDescription);
export const QueryLocalMarkSchemaDescription = `Query local mark by name. Local mark enables faster object address management and querying through the name and its tags.`;
export const QueryLocalMarkSchema = z.object({
    name: z.string().describe("The name of the local mark."),
}).describe(QueryLocalMarkSchemaDescription);
export const QueryLocalInfoSchemaDescription = `Query local info by name. Local info allows storing personal information (e.g. addresses, phone numbers) on-device, which can be cryptographically processed and shared with service providers.`;
export const QueryLocalInfoSchema = z.object({
    name: z.string().default(LocalInfoNameDefault).describe("The name of the local info."),
}).describe(QueryLocalInfoSchemaDescription);
export const LocalMarkFilterSchemaDescription = `Filter local marks by name, tags or object address. Local mark enables faster object address management and querying through the name and its tags.`;
export const LocalMarkFilterSchema = z.object({
    name: z.string().optional().describe("The name of the local mark."),
    tags: z.array(z.string()).optional().describe("The tags of the local mark."),
    object: z.string().optional().describe("The object address of the local mark."),
}).describe(LocalMarkFilterSchemaDescription);
export const LocalMarkListSchemaDescription = `List local marks. Local mark enables faster object address management and querying through the name and its tags.`;
export const LocalMarkListSchema = z.object({}).describe(LocalMarkListSchemaDescription);
export const LocalInfoListSchemaDescription = `List local informations. Local info allows storing personal information (e.g. addresses, phone numbers) on-device, which can be cryptographically processed and shared with service providers.`;
export const LocalInfoListSchema = z.object({}).describe(LocalInfoListSchemaDescription);
export const AccountListSchemaDescription = `List accounts. If showSuspendedAccount is true, suspended accounts will be displayed.
    Accounts are stored and managed locally on the device and provide necessary signatures for on-chain operations to ensure their successful execution.`;
export const AccountListSchema = z.object({
    showSuspendedAccount: z.boolean().optional().default(false).describe("Whether to display suspended accounts."),
}).describe(AccountListSchemaDescription);
