import { Link } from 'react-router-dom'

export default function Logo({ size = 36, withText = true, to = '/', textSize = 'h-6' }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 select-none">
      <img src="/brand-logo.png" alt="Growix logo" width={size} height={size} className="rounded-md" />
      {withText && <img src="/growix-text-logo.png" alt="Growix" className={`${textSize} rounded-md object-contain`} style={{maxHeight: '48px'}} />}
    </Link>
  )
}


