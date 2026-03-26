import { useRef, useState } from 'react'

interface FileUploadProps {
  onLoad: (buffer: ArrayBuffer) => void
  error: string | null
}

export default function FileUpload({ onLoad, error }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleFile(file: File) {
    file.arrayBuffer().then(onLoad)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center max-w-md w-full px-6">
        <div className="mb-8">
          <div className="text-5xl mb-4">📊</div>
          <h1 className="text-3xl font-bold text-white mb-2">Actuary Dashboard</h1>
          <p className="text-slate-400">Motor insurance portfolio analytics</p>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-12 cursor-pointer transition-colors ${
            dragging
              ? 'border-blue-400 bg-blue-950/30'
              : 'border-slate-600 hover:border-slate-400 bg-slate-800/50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={onChange}
          />
          <div className="text-4xl mb-3">📁</div>
          <p className="text-white font-medium mb-1">Drop your XLSX file here</p>
          <p className="text-slate-400 text-sm">or click to browse</p>
          <p className="text-slate-500 text-xs mt-3">
            Expects sheets: <code className="bg-slate-700 px-1 rounded">insured_year</code> and{' '}
            <code className="bg-slate-700 px-1 rounded">claims</code>
          </p>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-950/50 border border-red-700 rounded-lg text-red-300 text-sm text-left whitespace-pre-wrap">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
