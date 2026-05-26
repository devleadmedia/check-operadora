import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function StatementCardSkeleton(): JSX.Element {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 w-full sm:w-auto">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>

            <Skeleton className="h-4 w-3/4 mb-2" />

            <div className="hidden sm:flex items-center gap-2">
              <Skeleton className="h-3.5 w-3.5 rounded-full" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0 w-full sm:w-auto justify-end sm:justify-start">
            <div className="text-right space-y-1">
              <Skeleton className="h-3 w-10 ml-auto" />
              <Skeleton className="h-5 w-24 ml-auto" />
            </div>

            <div className="text-right border-l pl-4 sm:pl-6 space-y-1">
              <Skeleton className="h-3 w-16 ml-auto" />
              <Skeleton className="h-4 w-20 ml-auto" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
