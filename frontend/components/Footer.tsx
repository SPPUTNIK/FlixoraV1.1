'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white border-t border-gray-700">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0">
          
          {/* Brand Section */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-white text-xl font-bold">▶</span>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t('footer.title')}
              </h3>
            </div>
            <p className="text-gray-300 text-lg max-w-md leading-relaxed mb-4">
              {t('footer.subtitle')}
            </p>
            <div className="flex items-center justify-center lg:justify-start text-gray-400 text-sm">
              <span className="text-red-500 mr-2">♥</span>
              <span>{t('footer.builtWith')} {t('footer.byDevelopers')}</span>
            </div>
          </div>

          {/* Social & Links */}
          <div className="flex flex-col items-center space-y-6">
            
            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com/SPPUTNIK/TV" 
                target="_blank"
                rel="noopener noreferrer"
                className="group"
                title="GitHub"
              >
                <div className="w-12 h-12 bg-gray-700/50 hover:bg-gray-600 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg backdrop-blur-sm">
                  <span className="text-white text-lg">⚡</span>
                </div>
              </a>
              
              <a 
                href="#" 
                className="group"
                title="Twitter"
              >
                <div className="w-12 h-12 bg-gray-700/50 hover:bg-blue-500 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg backdrop-blur-sm">
                  <span className="text-white text-lg">🐦</span>
                </div>
              </a>
              
              <a 
                href="#" 
                className="group"
                title="Discord"
              >
                <div className="w-12 h-12 bg-gray-700/50 hover:bg-indigo-500 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg backdrop-blur-sm">
                  <span className="text-white text-lg">💬</span>
                </div>
              </a>
            </div>

            {/* Quick Links */}
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 hover:underline">
                Privacy
              </a>
              <span className="text-gray-600">•</span>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 hover:underline">
                Terms
              </a>
              <span className="text-gray-600">•</span>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 hover:underline">
                Help
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} {t('footer.title')}. {t('footer.copyright')}
            </p>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-500">All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
