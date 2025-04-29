import { z } from "zod";
import { BalanceOrCoin, LocalInfoNameDefault, } from "wowok_agent";
export const QueryAccountSchema = z.object({
    name_or_address: z.string().optional().describe("Your account name or address. undefined means default account."),
    balance_or_coin: z.nativeEnum(BalanceOrCoin).optional().describe("Query the balance or coin objects of the account."),
    token_type: z.string().optional().describe("Token type, default to 0x2::sui::SUI if not specified."),
}).describe('Query the account address and its balance or coin objects.');
export const AccountOperationSchema = z.object({
    gen: z.object({
        name: z.string().optional().describe("Account name. If not specified, the address will be used as the name."),
        default: z.boolean().optional().describe("Whether to set the generated account as default."),
        useAddressIfNameExist: z.boolean().optional().describe("Whether to use the address if the name already exists. Otherwise, use this name and change the original name to its address."),
    }).optional().describe("Generate a new account."),
    transfer: z.object({
        name_or_address_from: z.string().optional().describe("The name or address of the account to transfer from. undefined means default account."),
        name_or_address_to: z.string().optional().describe("The name or address of the account to transfer to. undefined means default account."),
        amount: z.union([z.string(), z.number()]).describe("The amount to transfer. Must be a positive integer."),
        token_type: z.string().optional().describe("Token type, default to 0x2::sui::SUI if not specified."),
    }).optional().describe("Transfer tokens from one account to another."),
}).describe('Account operation, such as generate a new account or transfer tokens from one account to another.');
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
}).describe('Local mark operation, such as add or set local marks, remove local marks or remove all local marks.');
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
}).describe('Local info operation, such as add local info or remove local info.');
export const QueryLocalMarkSchema = z.object({
    name: z.string().describe("The name of the local mark."),
}).describe('Query local mark by name.');
export const QueryLocalInfoSchema = z.object({
    name: z.string().default(LocalInfoNameDefault).describe("The name of the local info."),
}).describe('Query local info by name.');
export const LocalMarkFilterSchema = z.object({
    name: z.string().optional().describe("The name of the local mark."),
    tags: z.array(z.string()).optional().describe("The tags of the local mark."),
    object: z.string().optional().describe("The object address of the local mark."),
}).describe('Filter local marks by name, tags or object address.');
