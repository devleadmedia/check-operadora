import { cn } from '@/lib/utils'
import type { ApiSection } from '../types'
import { MethodBadge } from './method-badge'

interface ApiDocSidebarProps {
  sections: ApiSection[]
  selectedId: string
  onSelect: (id: string) => void
}

export function ApiDocSidebar({ sections, selectedId, onSelect }: ApiDocSidebarProps) {
  return (
    <nav className="space-y-6 pr-2">
      <button
        type="button"
        onClick={() => onSelect('intro')}
        className={cn(
          'block w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors',
          selectedId === 'intro'
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
      >
        Introdução
      </button>

      {sections.map((section) => (
        <div key={section.id}>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.endpoints.map((endpoint) => (
              <li key={endpoint.id}>
                <button
                  type="button"
                  onClick={() => onSelect(endpoint.id)}
                  className={cn(
                    'flex w-full items-start gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors',
                    selectedId === endpoint.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <MethodBadge method={endpoint.method} className="mt-0.5 shrink-0 text-[10px]" />
                  <span className="line-clamp-2 leading-snug">{endpoint.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
