import { useQuery } from '@tanstack/react-query'

import { index } from '@/services/client.service'

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: () => index(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  })
}
