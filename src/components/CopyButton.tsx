'use client'

import { useTranslations } from "next-intl"
import { useState } from "react"

export default function CopyButton({ text }: { text: string }) {
  const t = useTranslations('Component.CopyButton')
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
      .then(() => setCopied(true))
  }

  return (
    <button className="tooltip text-indigo-600" data-tip={t(copied ? 'copied' : 'copy')} onClick={copyToClipboard}>
      {text}
    </button>
  )
}
