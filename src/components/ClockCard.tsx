import { useState } from 'react'
import { ChevronLeft, ChevronRight, Pencil, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { ClockConfig } from '@/lib/settings'
import {
  formatDate,
  formatTime,
  instantFromInputValues,
  toDateInputValue,
  toTimeInputValue,
  utcOffsetLabel,
  zoneAbbreviation,
  type HourFormat,
} from '@/lib/time'

interface ClockCardProps {
  clock: ClockConfig
  instant: number
  hourFormat: HourFormat
  canRemove: boolean
  isFirst: boolean
  isLast: boolean
  onPin: (instant: number) => void
  onRename: (label: string) => void
  onRemove: () => void
  onMoveLeft: () => void
  onMoveRight: () => void
}

export function ClockCard({
  clock,
  instant,
  hourFormat,
  canRemove,
  isFirst,
  isLast,
  onPin,
  onRename,
  onRemove,
  onMoveLeft,
  onMoveRight,
}: ClockCardProps) {
  const [editingLabel, setEditingLabel] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editDate, setEditDate] = useState('')
  const [editTime, setEditTime] = useState('')

  const commitLabel = (value: string) => {
    const label = value.trim()
    if (label !== '') onRename(label)
    setEditingLabel(false)
  }

  const openEditor = (open: boolean) => {
    if (open) {
      setEditDate(toDateInputValue(instant, clock.timezone))
      setEditTime(toTimeInputValue(instant, clock.timezone))
    }
    setEditOpen(open)
  }

  const applyEdit = () => {
    const pinned = instantFromInputValues(clock.timezone, editDate, editTime)
    if (pinned !== null) {
      onPin(pinned)
      setEditOpen(false)
    }
  }

  return (
    <Card className="gap-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        {editingLabel ? (
          <Input
            autoFocus
            defaultValue={clock.label}
            className="h-8 max-w-48"
            onBlur={(e) => commitLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitLabel(e.currentTarget.value)
              if (e.key === 'Escape') setEditingLabel(false)
            }}
          />
        ) : (
          <button
            type="button"
            className="group flex items-center gap-1.5 text-sm font-medium"
            onClick={() => setEditingLabel(true)}
            title="Rename clock"
          >
            {clock.label}
            <Pencil className="size-3 opacity-0 transition-opacity group-hover:opacity-60" />
          </button>
        )}
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            disabled={isFirst}
            onClick={onMoveLeft}
            title="Move left"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            disabled={isLast}
            onClick={onMoveRight}
            title="Move right"
          >
            <ChevronRight />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            disabled={!canRemove}
            onClick={onRemove}
            title="Remove clock"
          >
            <X />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Popover open={editOpen} onOpenChange={openEditor}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="rounded-md text-4xl font-semibold tabular-nums tracking-tight transition-colors hover:text-muted-foreground"
              title="Set a hypothetical time"
            >
              {formatTime(instant, clock.timezone, hourFormat)}
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-64 max-w-[calc(100vw-2rem)] space-y-3"
            collisionPadding={16}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <p className="text-sm font-medium">
              What if it were this time in {clock.label}?
            </p>
            <div className="space-y-1.5">
              <Label htmlFor={`date-${clock.id}`}>Date</Label>
              <Input
                id={`date-${clock.id}`}
                type="date"
                className="min-w-0 appearance-none"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`time-${clock.id}`}>Time</Label>
              <Input
                id={`time-${clock.id}`}
                type="time"
                className="min-w-0 appearance-none"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={applyEdit}>
              Show across all clocks
            </Button>
          </PopoverContent>
        </Popover>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatDate(instant, clock.timezone)}
        </p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        {clock.timezone} · {zoneAbbreviation(instant, clock.timezone)} (
        {utcOffsetLabel(instant, clock.timezone)})
      </CardFooter>
    </Card>
  )
}
