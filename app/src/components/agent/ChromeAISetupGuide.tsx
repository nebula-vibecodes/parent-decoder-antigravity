import { useState, useRef, useCallback } from 'react'
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react'
import { useApp } from '../../store'

export interface ChromeAISetupGuideProps {
  className?: string
  defaultOpen?: boolean
  compact?: boolean
}

export const CHROME_AI_GUIDE_CONSTANTS = {
  flagUrl: 'chrome://flags/#prompt-api-for-gemini-nano',
  optimizationFlagUrl: 'chrome://flags/#optimization-guide-on-device-model',
  componentsUrl: 'chrome://components',
  componentName: 'Optimization Guide On Device Model',
  title: 'How to turn on local AI in Chrome (60 seconds)',
  guideSteps: [
    'Open chrome://flags/#prompt-api-for-gemini-nano in Google Chrome.',
    'Set Prompt API for Gemini Nano to Enabled.',
    'Restart Google Chrome.',
    'Check chrome://components to ensure Optimization Guide On Device Model is downloaded and up-to-date.',
  ],
} as const

/**
 * Resilient clipboard writer supporting modern navigator.clipboard
 * with hidden textarea fallback if clipboard API throws or is unavailable.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // 1. Try modern navigator.clipboard
  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  ) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fall through to textarea fallback
    }
  }

  // 2. Fallback via temporary textarea and execCommand('copy')
  if (typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.left = '-999999px'
      textarea.style.top = '-999999px'
      textarea.setAttribute('readonly', '')
      document.body.appendChild(textarea)
      textarea.select()
      const successful = document.execCommand('copy')
      document.body.removeChild(textarea)
      return successful
    } catch {
      return false
    }
  }

  return false
}

export function ChromeAISetupGuide({
  className,
  defaultOpen = false,
  compact = false,
}: ChromeAISetupGuideProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const timerRef = useRef<number | null>(null)

  // Safe notify hook wrapper in case component is rendered outside AppProvider
  let notify: (message: string) => void = () => {}
  try {
    const app = useApp()
    notify = app.notify
  } catch {
    // Graceful no-op when outside AppProvider (e.g. isolated test environments)
  }

  const handleCopy = useCallback(
    async (key: string, text: string, toastMessage: string) => {
      const success = await copyToClipboard(text)
      if (success) {
        setCopiedKey(key)
        notify(toastMessage)

        if (timerRef.current) {
          window.clearTimeout(timerRef.current)
        }
        timerRef.current = window.setTimeout(() => {
          setCopiedKey((curr) => (curr === key ? null : curr))
        }, 2000)
      } else {
        notify('Failed to copy to clipboard')
      }
    },
    [notify]
  )

  const classes = [
    'chrome-ai-guide',
    'chrome-ai-setup-guide',
    compact ? 'chrome-ai-guide-compact chrome-ai-setup-guide-compact' : '',
    isOpen ? 'expanded' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      <button
        type="button"
        className="chrome-ai-guide-trigger setup-guide-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen ? 'true' : 'false'}
        aria-controls="chrome-ai-setup-guide-content"
        role="button"
      >
        <div className="chrome-ai-guide-trigger-title setup-guide-title-wrap">
          <Sparkles size={16} className="chrome-ai-guide-sparkle setup-guide-icon" />
          <span className="setup-guide-title">{CHROME_AI_GUIDE_CONSTANTS.title}</span>
        </div>
        <span
          className={`chrome-ai-guide-chevron setup-guide-chevron ${isOpen ? 'rotated' : ''}`}
          aria-hidden="true"
        >
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {isOpen && (
        <div id="chrome-ai-setup-guide-content" className="chrome-ai-guide-content setup-guide-content">
          <p className="chrome-ai-guide-blurb setup-guide-intro">
            Chrome 128+ comes with Google's on-device AI (Gemini Nano) built directly into your
            browser. Once enabled, decoding and roleplays run 100% locally on your computer with
            zero latency and zero cloud data transmission.
          </p>

          <ol className="chrome-ai-guide-steps setup-guide-steps">
            {/* Step 1 */}
            <li className="chrome-ai-guide-step setup-guide-step">
              <div className="chrome-ai-guide-step-header setup-guide-step-header">
                <span className="chrome-ai-guide-step-number setup-guide-step-num">1</span>
                <div className="setup-guide-step-body">
                  <strong className="setup-guide-step-title">Enable Prompt API in Chrome Flags</strong>
                  <p className="setup-guide-step-desc">
                    Paste the flag URL into a new Chrome tab and set{' '}
                    <code>Prompt API for Gemini Nano</code> to <strong>Enabled</strong>.
                  </p>
                </div>
              </div>
              <div className="chrome-ai-guide-code-row setup-guide-code-box">
                <code className="chrome-ai-guide-code">
                  {CHROME_AI_GUIDE_CONSTANTS.flagUrl}
                </code>
                <button
                  type="button"
                  className={`button button-small ${
                    copiedKey === 'flag' ? 'button-light copied' : 'button-outline'
                  } chrome-ai-guide-copy-btn copy-button`}
                  onClick={() =>
                    handleCopy('flag', CHROME_AI_GUIDE_CONSTANTS.flagUrl, 'Flag URL copied to clipboard')
                  }
                  aria-label="Copy Prompt API flag URL"
                >
                  {copiedKey === 'flag' ? (
                    <>
                      <Check size={14} /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy flag link
                    </>
                  )}
                </button>
              </div>
            </li>

            {/* Step 2 */}
            <li className="chrome-ai-guide-step setup-guide-step">
              <div className="chrome-ai-guide-step-header setup-guide-step-header">
                <span className="chrome-ai-guide-step-number setup-guide-step-num">2</span>
                <div className="setup-guide-step-body">
                  <strong className="setup-guide-step-title">Enable Optimization Guide On-Device Model</strong>
                  <p className="setup-guide-step-desc">
                    Set <code>Optimization Guide On-Device Model</code> to{' '}
                    <strong>Enabled BypassPerfRequirement</strong> so Chrome allows the model on
                    any hardware.
                  </p>
                </div>
              </div>
              <div className="chrome-ai-guide-code-row setup-guide-code-box">
                <code className="chrome-ai-guide-code">
                  {CHROME_AI_GUIDE_CONSTANTS.optimizationFlagUrl}
                </code>
                <button
                  type="button"
                  className={`button button-small ${
                    copiedKey === 'opt' ? 'button-light copied' : 'button-outline'
                  } chrome-ai-guide-copy-btn copy-button`}
                  onClick={() =>
                    handleCopy(
                      'opt',
                      CHROME_AI_GUIDE_CONSTANTS.optimizationFlagUrl,
                      'Optimization Guide flag URL copied'
                    )
                  }
                  aria-label="Copy Optimization Guide flag URL"
                >
                  {copiedKey === 'opt' ? (
                    <>
                      <Check size={14} /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy flag link
                    </>
                  )}
                </button>
              </div>
            </li>

            {/* Step 3 */}
            <li className="chrome-ai-guide-step setup-guide-step">
              <div className="chrome-ai-guide-step-header setup-guide-step-header">
                <span className="chrome-ai-guide-step-number setup-guide-step-num">3</span>
                <div className="setup-guide-step-body">
                  <strong className="setup-guide-step-title">Relaunch Google Chrome</strong>
                  <p className="setup-guide-step-desc">
                    Click the blue <strong>Relaunch</strong> button at the bottom of the Chrome
                    flags tab to restart your browser with the new settings.
                  </p>
                </div>
              </div>
            </li>

            {/* Step 4 */}
            <li className="chrome-ai-guide-step setup-guide-step">
              <div className="chrome-ai-guide-step-header setup-guide-step-header">
                <span className="chrome-ai-guide-step-number setup-guide-step-num">4</span>
                <div className="setup-guide-step-body">
                  <strong className="setup-guide-step-title">Verify Model Download at Components</strong>
                  <p className="setup-guide-step-desc">
                    Open <code>chrome://components</code>, locate{' '}
                    <strong>{CHROME_AI_GUIDE_CONSTANTS.componentName}</strong>, and click{' '}
                    <strong>Check for update</strong> until status reads <em>Up-to-date</em>.
                  </p>
                </div>
              </div>
              <div className="chrome-ai-guide-code-row setup-guide-code-box">
                <code className="chrome-ai-guide-code">
                  {CHROME_AI_GUIDE_CONSTANTS.componentsUrl}
                </code>
                <button
                  type="button"
                  className={`button button-small ${
                    copiedKey === 'components' ? 'button-light copied' : 'button-outline'
                  } chrome-ai-guide-copy-btn copy-button`}
                  onClick={() =>
                    handleCopy(
                      'components',
                      CHROME_AI_GUIDE_CONSTANTS.componentsUrl,
                      'chrome://components URL copied'
                    )
                  }
                  aria-label="Copy chrome://components URL"
                >
                  {copiedKey === 'components' ? (
                    <>
                      <Check size={14} /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy link
                    </>
                  )}
                </button>
              </div>
            </li>
          </ol>

          <div className="chrome-ai-guide-footer-note setup-guide-footer">
            <ShieldCheck size={15} />
            <span>
              <strong>Note:</strong> Browsers block websites from opening internal{' '}
              <code>chrome://</code> pages automatically. Click the buttons above to copy each link,
              then open a new tab and paste with <kbd>Ctrl+V</kbd> (or <kbd>Cmd+V</kbd>).
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
