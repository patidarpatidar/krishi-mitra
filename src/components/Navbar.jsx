'use client';
import { useState } from 'react';
import Link from 'next/link';
import LogoSvg from './LogoSvg';
import { Menu, X, Search, User, CloudSun, LineChart } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navRoutes = [
    { name: 'होम', path: '/' },
    { name: 'फ़सलें', path: '/crops' },
    { name: 'मंडी भाव', path: '/mandi-bhav' },
    { name: 'मौसम', path: '/weather' },
    // { name: 'सरकारी योजनाएं', path: '/govt-schemes' },
    { name: 'जैविक खेती', path: '/organic-farming' },
    { name: 'पशुपालन', path: '/livestock' },
    { name: 'कृषि ब्लॉग', path: '/blog' },
    { name: 'हमारे बारे में', path: '/about' },
    { name: 'संपर्क करें', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-emerald-100 shadow-sm">
      {/* Top Notification / Banner */}
      <div className="bg-emerald-800 text-white text-xs py-1.5 px-4 text-center font-medium">
        🌾 मध्य प्रदेश नीमच मंडी के ताज़ा भाव और मौसम की सटीक जानकारी - कृषि मित्र
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <LogoSvg />
          </Link>

          {/* Search bar Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="फसल, मंडी भाव, या योजना खोजें..."
              className="w-full pl-10 pr-4 py-2 border border-emerald-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/50"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-emerald-600" />
          </div>

          {/* Quick Actions & Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              <User className="w-4 h-4" /> किसान लॉगिन
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-emerald-800 hover:text-emerald-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Primary Navigation Bar (Desktop) */}
      <nav className="hidden md:block bg-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-1 overflow-x-auto text-sm font-medium">
          {navRoutes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className="px-3 py-2.5 hover:bg-emerald-800 whitespace-nowrap transition rounded-xs"
            >
              {route.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="md:hidden bg-emerald-900 text-white px-4 pt-2 pb-6 space-y-1">
          <div className="my-2">
            <input
              type="text"
              placeholder="खोजें..."
              className="w-full px-3 py-2 text-slate-900 rounded-md text-sm"
            />
          </div>
          {navRoutes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-base font-medium hover:bg-emerald-800 rounded-md"
            >
              {route.name}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="mt-4 block text-center bg-amber-500 text-slate-900 font-bold px-4 py-2 rounded-md"
          >
            किसान लॉगिन / रजिस्टर
          </Link>
        </div>
      )}
    </header>
  );
}