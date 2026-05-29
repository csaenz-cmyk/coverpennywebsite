export default function Logo({ className = '', dotClass = '' }) {
  return (
    <span className={`inline-flex items-baseline font-extrabold tracking-tight ${className}`}>
      coverpenny
      <span className={`ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-penny-500 ${dotClass}`} />
    </span>
  )
}
