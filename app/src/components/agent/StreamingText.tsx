export function StreamingText({
  text,
  isStreaming,
  className = '',
}: {
  text: string
  isStreaming: boolean
  className?: string
}) {
  return (
    <div className={`agent-streaming-text ${className}`}>
      {text || (isStreaming ? 'Thinking' : '')}
      {isStreaming && <span className="agent-cursor" />}
    </div>
  )
}
