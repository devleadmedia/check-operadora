import { index } from '@/services/client.service'
import { useQuery } from '@tanstack/react-query'

export function useListClientsController() {
  const {
    data: listDataClients,
    isLoading: isLoadingClients,
    refetch: refetchClients,
    error: errorClients,
  } = useQuery({
    queryKey: ['clients'],
    queryFn: () => index(),
    refetchOnWindowFocus: false,
  })

  return {
    listDataClients,
    isLoadingClients,
    refetchClients,
    errorClients,
  }
}
