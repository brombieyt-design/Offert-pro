"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logotyp */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors ${scrolled ? "text-gray-900" : "text-white"}`}>Offert-pro</span>
          </Link>

          {/* Desktopmeny */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/#how-it-works" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${scrolled ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100" : "text-gray-300 hover:text-white hover:bg-white/10"}`}>
              Funktioner
            </Link>
            <Link href="/pricing" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${scrolled ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100" : "text-gray-300 hover:text-white hover:bg-white/10"}`}>
              Priser
            </Link>
            <Link href="/#about" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${scrolled ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100" : "text-gray-300 hover:text-white hover:bg-white/10"}`}>
              Om oss
            </Link>
          </nav>

          {/* Desktop CTA-knappar */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/dashboard"
              className={`px-4 py-2 text-sm font-semibold transition-colors ${scrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-300 hover:text-white"}`}
            >
              Logga in
            </Link>
            <Link
              href="/dashboard"
              className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors ${scrolled ? "text-white bg-gray-900 hover:bg-gray-700" : "text-gray-900 bg-white hover:bg-gray-100"}`}
            >
              Kom igång gratis
            </Link>
          </div>

          {/* Mobilmenyknapp */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? "text-gray-600 hover:bg-gray-100" : "text-gray-300 hover:bg-white/10"}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobilmeny */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            <Link href="/#features" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Funktioner
            </Link>
            <Link href="/pricing" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Priser
            </Link>
            <Link href="/#about" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Om oss
            </Link>
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
              <Link href="/dashboard" className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-center" onClick={() => setMobileMenuOpen(false)}>
                Logga in
              </Link>
              <Link href="/dashboard" className="px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors text-center" onClick={() => setMobileMenuOpen(false)}>
                Kom igång gratis
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
