import { useEffect, useRef, useState } from 'react'

const REPO = 'ADebray95/actu-dash'

interface Props {
  onClose: () => void
}

export default function FeedbackModal({ onClose }: Props) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams({ title, body })
    window.open(`https://github.com/${REPO}/issues/new?${params.toString()}`, '_blank')
    onClose()
  }

  function handleBackdrop(e: React.MouseEvent) {
    if (!dialogRef.current?.contains(e.target as Node)) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={handleBackdrop}
    >
      <div
        ref={dialogRef}
        className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl w-full max-w-md mx-4 p-6"
      >
        <h2 className="text-white font-semibold text-lg mb-4">Report an issue / request a feature</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-slate-400 text-sm mb-1" htmlFor="fb-title">
              Title
            </label>
            <input
              id="fb-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short, descriptive title"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-200
                         placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-1" htmlFor="fb-body">
              Description
            </label>
            <textarea
              id="fb-body"
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              placeholder="Describe the issue or feature in detail…"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-200
                         placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm
                         font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm
                         font-medium transition-colors"
            >
              Open on GitHub →
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
