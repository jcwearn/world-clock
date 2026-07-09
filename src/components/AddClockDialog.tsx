import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { timezoneOptions } from '@/lib/timezones'

interface AddClockDialogProps {
  onAdd: (timezone: string) => void
}

export function AddClockDialog({ onAdd }: AddClockDialogProps) {
  const [open, setOpen] = useState(false)
  const options = useMemo(() => timezoneOptions(), [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add clock
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-3 p-4 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a clock</DialogTitle>
        </DialogHeader>
        <Command className="rounded-md border">
          <CommandInput placeholder="Search timezones..." />
          <CommandList className="max-h-72">
            <CommandEmpty>No timezone found.</CommandEmpty>
            {options.map((option) => (
              <CommandItem
                key={option.id}
                value={`${option.label} ${option.id}`}
                onSelect={() => {
                  onAdd(option.id)
                  setOpen(false)
                }}
              >
                <span>{option.label}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {option.id} · {option.offset}
                </span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
