'use client';

import { useLanguageSync } from '@/hooks/useLanguageSync';

export function LanguageSync() {
  useLanguageSync();
  return null; // This component doesn't render anything
}