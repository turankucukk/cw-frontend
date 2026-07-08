import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-white px-4 py-3 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          CW Frontend
        </Link>
        <div className="space-x-4 text-sm text-gray-700">
          <Link href="/login" className="hover:text-blue-600">
            Login
          </Link>
          <Link href="/register" className="hover:text-blue-600">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
