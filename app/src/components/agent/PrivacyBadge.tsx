import { Cpu, Cloud, CircleOff, Download } from 'lucide-react'
import type { AIStatus } from '../../lib/ai/types'

export function PrivacyBadge({ status }: { status: AIStatus }) {
  if (status.downloading) {
    return (
      <span className="agent-badge agent-badge-downloading">
        <Download size={13} />
        Downloading model{status.progress != null ? ` · ${Math.round(status.progress * 100)}%` : '…'}
      </span>
    )
  }

  switch (status.engine) {
    case 'local':
      return (
        <span className="agent-badge agent-badge-local">
          <Cpu size={13} /> On-device · private
        </span>
      )
    case 'cloud':
      return (
        <span className="agent-badge agent-badge-cloud">
          <Cloud size={13} /> Cloud · encrypted
        </span>
      )
    default:
      return (
        <span className="agent-badge agent-badge-unavailable">
          <CircleOff size={13} /> AI unavailable
        </span>
      )
  }
}
