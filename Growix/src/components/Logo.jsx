import { Link } from 'react-router-dom'

export default function Logo({ size = 36, withText = true, to = '/' }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 select-none">
      <img src="/brand-logo.png" alt="Growix logo" width={size} height={size} className="rounded-md" />
      {withText && <span className="text-dusk font-semibold text-xl tracking-tight">GROWIX</span>}
    </Link>
  )
}


