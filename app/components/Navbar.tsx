import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex flex-row justify-between items-center px-6 py-4 text-black bg-transparent">
      <div className="text-black font-bold text-2xl">
        <Link href="/" className="hover:text-black transition-colors font-bold">
          Co Task
        </Link>
      </div>
      <div className="flex flex-row items-center gap-8">
        <Link href="/about" className="hover:text-amber-300 transition-colors font-bold">
          About
        </Link>
        <Link href="/resources" className="hover:text-amber-300 transition-colors font-bold">
          Resources
        </Link>
        <Link href="/login" className="hover:text-amber-300 transition-colors font-bold">
          Get Started
        </Link>
      </div>
    </nav>
  );
}
