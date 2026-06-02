export default function FormField({ label, error, children, className = '' }) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="mb-2 block text-base font-medium text-text">
          {label}
        </label>
      )}
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
