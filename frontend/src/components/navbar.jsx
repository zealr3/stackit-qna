import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, MessageSquare } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">DevQ&amp;A</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/">
              <button className="px-4 py-2 bg-transparent hover:bg-gray-100 rounded">Home</button>
            </Link>
            <Link to="/ask">
              <button className="px-4 py-2 bg-transparent hover:bg-gray-100 rounded">Ask Question</button>
            </Link>
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <button className="px-4 py-2 border rounded bg-white hover:bg-gray-100">Login</button>
              </Link>
              <Link to="/register">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Register</button>
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <button
              className="px-2 py-2 bg-transparent rounded"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            {isOpen && (
              <div className="absolute right-0 top-16 bg-white shadow-lg w-64 rounded z-50">
                <div className="flex flex-col space-y-4 p-4">
                  <Link to="/" onClick={() => setIsOpen(false)}>
                    <button className="w-full text-left px-4 py-2 bg-transparent hover:bg-gray-100 rounded">Home</button>
                  </Link>
                  <Link to="/ask" onClick={() => setIsOpen(false)}>
                    <button className="w-full text-left px-4 py-2 bg-transparent hover:bg-gray-100 rounded">Ask Question</button>
                  </Link>
                  <div className="pt-4 border-t">
                    <div className="space-y-2">
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        <button className="w-full border px-4 py-2 bg-white hover:bg-gray-100 rounded">Login</button>
                      </Link>
                      <Link to="/register" onClick={() => setIsOpen(false)}>
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Register</button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}