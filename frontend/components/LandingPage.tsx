"use client";

import Link from "next/link";
import { useTranslation } from "../hooks/useTranslation";
import { PlayIcon } from "@heroicons/react/24/solid";

export default function LandingPage() {
  const { t, language } = useTranslation();

  console.log('🏠 LandingPage - Language:', language);
  console.log('🏠 LandingPage - t("home.title"):', t("home.title"));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              {t("home.title")}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              {t("home.subtitle")}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/library"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <PlayIcon className="w-6 h-6 mr-2" />
                {t("home.startWatching")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("home.featuresTitle")}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t("home.featuresSubtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v1M7 4V3a1 1 0 011-1m0 0h8m-8 0v1m0 0v3m0 0h8m-8 0l4 4m0-4l4-4m-4 4v6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {t("home.feature1Title")}
              </h3>
              <p className="text-gray-300">
                {t("home.feature1Description")}
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {t("home.feature2Title")}
              </h3>
              <p className="text-gray-300">
                {t("home.feature2Description")}
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {t("home.feature3Title")}
              </h3>
              <p className="text-gray-300">
                {t("home.feature3Description")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}