'use client';

import React from 'react';
import Link from 'next/link';
import { LanguageSelector } from './LanguageSelector';

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                FLIXORA
              </span>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  );
}