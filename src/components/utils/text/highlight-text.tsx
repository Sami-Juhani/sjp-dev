interface HighlightConfig {
  text: string
  style: string
}

interface HighlightedText {
  content: string
  highlights: HighlightConfig[]
}

export function HighlightText({ content, highlights }: HighlightedText) {
  let result = []
  let currentIndex = 0

  // Sort highlights by their position in the text to handle overlapping matches
  const sortedHighlights = highlights
    .map(h => ({
      ...h,
      index: content.indexOf(h.text)
    }))
    .filter(h => h.index !== -1)
    .sort((a, b) => a.index - b.index)

  for (const highlight of sortedHighlights) {
    const { text, style, index } = highlight

    // Add text before the highlight
    if (index > currentIndex) {
      result.push(content.slice(currentIndex, index))
    }

    // Add the highlighted text
    result.push(
      <span key={`highlight-${index}`} className={style}>
        {text}
      </span>
    )

    currentIndex = index + text.length
  }

  // Add any remaining text after the last highlight
  if (currentIndex < content.length) {
    result.push(content.slice(currentIndex))
  }

  // Add spaces between elements, but not before punctuation
  return result.reduce(
    (acc, item, i) => {
      if (i === 0) return [item]

      const nextItem = typeof item === 'string' ? item.trim() : item
      const isPunctuation =
        typeof nextItem === 'string' && /^[.,;:!?)]/.test(nextItem)

      if (isPunctuation) {
        return [...acc, nextItem]
      }

      return [...acc, ' ', nextItem]
    },
    [] as (string | React.ReactNode)[]
  )
}
