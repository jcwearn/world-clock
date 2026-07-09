import { useState } from 'react'
import { AddClockDialog } from '@/components/AddClockDialog'
import { ClockCard } from '@/components/ClockCard'
import { PinnedBanner } from '@/components/PinnedBanner'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useNow } from '@/hooks/useNow'
import {
  loadSettings,
  newClock,
  saveSettings,
  type Settings,
} from '@/lib/settings'

function App() {
  const [settings, setSettings] = useState<Settings>(() =>
    loadSettings(window.localStorage),
  )
  const [pinnedInstant, setPinnedInstant] = useState<number | null>(null)
  const now = useNow()
  const instant = pinnedInstant ?? now

  const update = (next: Settings) => {
    setSettings(next)
    saveSettings(window.localStorage, next)
  }

  const addClock = (timezone: string) => {
    update({ ...settings, clocks: [...settings.clocks, newClock(timezone)] })
  }

  const removeClock = (id: string) => {
    update({
      ...settings,
      clocks: settings.clocks.filter((clock) => clock.id !== id),
    })
  }

  const renameClock = (id: string, label: string) => {
    update({
      ...settings,
      clocks: settings.clocks.map((clock) =>
        clock.id === id ? { ...clock, label } : clock,
      ),
    })
  }

  const moveClock = (id: string, direction: -1 | 1) => {
    const index = settings.clocks.findIndex((clock) => clock.id === id)
    const target = index + direction
    if (index === -1 || target < 0 || target >= settings.clocks.length) return
    const clocks = [...settings.clocks]
    ;[clocks[index], clocks[target]] = [clocks[target], clocks[index]]
    update({ ...settings, clocks })
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-5xl flex-col gap-6 p-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">World Clock</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="hour-format"
              checked={settings.hourFormat === 24}
              onCheckedChange={(checked) =>
                update({ ...settings, hourFormat: checked ? 24 : 12 })
              }
            />
            <Label htmlFor="hour-format">24-hour</Label>
          </div>
          <AddClockDialog onAdd={addClock} />
        </div>
      </header>

      {pinnedInstant !== null && (
        <PinnedBanner onBackToLive={() => setPinnedInstant(null)} />
      )}

      <main className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {settings.clocks.map((clock, index) => (
          <ClockCard
            key={clock.id}
            clock={clock}
            instant={instant}
            hourFormat={settings.hourFormat}
            canRemove={settings.clocks.length > 1}
            isFirst={index === 0}
            isLast={index === settings.clocks.length - 1}
            onPin={setPinnedInstant}
            onRename={(label) => renameClock(clock.id, label)}
            onRemove={() => removeClock(clock.id)}
            onMoveLeft={() => moveClock(clock.id, -1)}
            onMoveRight={() => moveClock(clock.id, 1)}
          />
        ))}
      </main>
    </div>
  )
}

export default App
