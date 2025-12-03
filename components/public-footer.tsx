import Link from "next/link"
import { Waves } from "lucide-react"

export function PublicFooter() {
  return (
    <footer className="w-full border-t border-primary/20 bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-lg font-bold mb-4">
              <Waves className="h-5 w-5 text-accent" />
              <span>SAIL PortLink AI</span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              Steel Authority of India Limited operates 5 integrated steel plants across India, importing approximately
              14 Mt of coking coal and 3 Mt of limestone annually via east-coast ports, with efficient rail connectivity
              to move materials inland.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-white/80 hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-white/80 hover:text-accent transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-white/80 hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Disclaimer</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              This is a planning and simulation platform. Some data is synthetic and for demonstration purposes.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/70">© Steel Authority of India Limited – PortLink AI</p>
          <div className="flex gap-4 text-xs">
            <Link href="#" className="text-white/70 hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-white/70 hover:text-accent transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
