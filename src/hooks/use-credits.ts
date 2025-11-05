import { User } from "@/services/user"
import { useQuery } from "@tanstack/react-query"

export function useCredits() {
    const user = new User()

    const { data: credits, isLoading, refetch } = useQuery({
        queryKey: ["credits"],
        queryFn: async () => {
            const value = await user.getCreditsByToken()
            return value
        },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
    })

    return {
        credits: credits ?? 0,
        isLoading,
        refetch,
    }
}