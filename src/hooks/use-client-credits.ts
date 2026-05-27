import { useMemo } from 'react'

import { useAuth } from '@/contexts/auth'
import { useClients } from '@/hooks/use-clients'
import { getCreditsByClientId } from '@/utils/client-credits.util'

export function useClientCredits() {
  const { user, isBootstrapping } = useAuth()
  const { data: clients, isLoading: isLoadingClients } = useClients()

  const credits = useMemo(
    () => getCreditsByClientId(user?.client_id, clients) ?? 0,
    [user?.client_id, clients],
  )

  return {
    credits,
    isLoading: isBootstrapping || (!!user?.client_id && isLoadingClients),
  }
}
