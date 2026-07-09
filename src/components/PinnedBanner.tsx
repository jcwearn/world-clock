import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PinnedBannerProps {
  onBackToLive: () => void
}

export function PinnedBanner({ onBackToLive }: PinnedBannerProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-muted px-4 py-2">
      <p className="text-sm">
        Showing a hypothetical time — clocks are paused.
      </p>
      <Button size="sm" onClick={onBackToLive}>
        <Play /> Back to live
      </Button>
    </div>
  )
}
