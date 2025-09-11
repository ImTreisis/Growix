import Logo from './Logo.jsx'

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-warm3/40">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo size={28} withText={true} />
          <span className="text-cocoa text-sm">Every step is progress</span>
        </div>
        <p className="text-cocoa text-sm">© {new Date().getFullYear()} Growix</p>
      </div>
    </footer>
  )
}


