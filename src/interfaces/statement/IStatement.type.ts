import { CreditMovementType } from "@/enums/CreditMovementType.enum";

export interface IStatement   {
    id: string,
    user_id: string,
    type: CreditMovementType,
    amount: number,
    previous_balance: number,
    new_balance: number,
    description: string,
    created_at: string
}