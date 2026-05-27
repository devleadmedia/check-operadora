import { cn } from '@/lib/utils'
import type { HttpMethod } from '../types'

const methodStyles: Record<HttpMethod, string> = {
  GET: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  POST: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
  PUT: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  PATCH: 'bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30',
  DELETE: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
}

interface MethodBadgeProps {
  method: HttpMethod
  className?: string
}

export function MethodBadge({ method, className }: MethodBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex min-w-[3.25rem] items-center justify-center rounded border px-2 py-0.5 text-xs font-bold tracking-wide',
        methodStyles[method],
        className,
      )}
    >
      {method}
    </span>
  )
}
