import { IStatement } from "@/interfaces/statement/IStatement.type";
import { api } from "@/lib/axios";

export async function getAllStatement(): Promise<IStatement[]>{
    const { data } = await api.get('/api/extrato/')
    return data.data as IStatement[]
}