import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex flex-row justify-between items-center px-6 py-4 text-white">
      <div className="text-amber-300 font-bold text-2xl">
        <Link href="/" className="hover:text-amber-200 transition-colors">
          Co Task
        </Link>
      </div>
      <div className="flex flex-row items-center gap-8">
        <Link href="/about" className="hover:text-amber-300 transition-colors">
          About
        </Link>
        <Link href="/resources" className="hover:text-amber-300 transition-colors">
          Resources
        </Link>
        <Link href="/get-started" className="hover:text-amber-300 transition-colors">
          Get Started
        </Link>
      </div>
    </nav>
  )
}