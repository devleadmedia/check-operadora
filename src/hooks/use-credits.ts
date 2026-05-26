import { getCredits } from '@/services/statement.service'
import { useQuery } from '@tanstack/react-query'

export function useCredits() {
  const {
    data: credits,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['credits'],
    queryFn: getCredits,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  })

  return {
    credits: credits?.credits ?? 0,
    isLoading,
    refetch,
  }
}
