import { useMemo, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export type MultiSelectOption = {
  label: string
  value: string
}

export interface MultiSelectProps {
  options: readonly MultiSelectOption[]
  value?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  allLabel?: string
  className?: string
  disabled?: boolean
  emptyMessage?: string
}

export function MultiSelect({
  options,
  value,
  defaultValue = [],
  onChange,
  placeholder = 'Selecione...',
  searchPlaceholder = 'Buscar...',
  allLabel = 'Todos',
  className,
  disabled = false,
  emptyMessage = 'Nenhuma opção encontrada',
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue)

  const selected = value ?? internalValue
  const allValues = useMemo(() => options.map((option) => option.value), [options])

  const filteredOptions = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return options

    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(term) || option.value.toLowerCase().includes(term),
    )
  }, [options, search])

  const allSelected =
    options.length > 0 && allValues.every((optionValue) => selected.includes(optionValue))

  const someSelected = selected.length > 0 && !allSelected

  const updateValue = (next: string[]) => {
    if (value === undefined) {
      setInternalValue(next)
    }
    onChange?.(next)
  }

  const toggleOption = (optionValue: string) => {
    if (selected.includes(optionValue)) {
      updateValue(selected.filter((item) => item !== optionValue))
      return
    }
    updateValue([...selected, optionValue])
  }

  const toggleAll = () => {
    if (allSelected) {
      updateValue([])
      return
    }
    updateValue(allValues)
  }

  const displayLabel = useMemo(() => {
    if (selected.length === 0) return placeholder

    if (allSelected) return allLabel

    if (selected.length === 1) {
      const option = options.find((item) => item.value === selected[0])
      return option?.label ?? selected[0]
    }

    return `${selected.length} selecionados`
  }, [allLabel, allSelected, options, placeholder, selected])

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) setSearch('')
      }}
    >
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'h-9 w-full justify-between font-normal shadow-sm',
            selected.length === 0 && 'text-muted-foreground',
            className,
          )}
        >
          <span className="truncate">{displayLabel}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-[var(--radix-dropdown-menu-trigger-width)] p-0"
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <div className="border-b p-2" onPointerDown={(event) => event.stopPropagation()}>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-8 pl-8"
              onKeyDown={(event) => event.stopPropagation()}
            />
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto p-1">
          <div
            role="button"
            tabIndex={0}
            className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
            onClick={toggleAll}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                toggleAll()
              }
            }}
          >
            <Checkbox
              checked={allSelected ? true : someSelected ? 'indeterminate' : false}
              onCheckedChange={toggleAll}
              onClick={(event) => event.stopPropagation()}
            />
            <span className="font-medium">{allLabel}</span>
          </div>

          {filteredOptions.length === 0 ? (
            <p className="px-2 py-4 text-center text-sm text-muted-foreground">{emptyMessage}</p>
          ) : (
            filteredOptions.map((option) => {
              const isChecked = selected.includes(option.value)

              return (
                <div
                  key={option.value}
                  role="button"
                  tabIndex={0}
                  className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  onClick={() => toggleOption(option.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      toggleOption(option.value)
                    }
                  }}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggleOption(option.value)}
                    onClick={(event) => event.stopPropagation()}
                  />
                  <span className="truncate">{option.value}</span>
                </div>
              )
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
