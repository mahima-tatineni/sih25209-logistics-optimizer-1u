import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Waves } from "lucide-react"

export function PublicNav() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-primary/20 bg-primary backdrop-blur supports-[backdrop-filter]:bg-primary/95">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
          <Waves className="h-6 w-6 text-accent" />
          <span>SAIL PortLink AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-white hover:text-accent transition-colors border-b-2 border-transparent hover:border-accent pb-1"
          >
            Home
          </Link>
          <Link
            href="/plants-and-ports"
            className="text-sm font-medium text-white hover:text-accent transition-colors border-b-2 border-transparent hover:border-accent pb-1"
          >
            Plants & Ports
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-white hover:text-accent transition-colors border-b-2 border-transparent hover:border-accent pb-1"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-white hover:text-accent transition-colors border-b-2 border-transparent hover:border-accent pb-1"
          >
            Contact
          </Link>
        </div>

        <Link href="/login">
          <Button className="bg-accent hover:bg-accent/90 text-white font-semibold">Login</Button>
        </Link>
      </div>
    </nav>
  )
}
