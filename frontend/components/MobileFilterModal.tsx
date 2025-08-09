interface MobileFilterModalProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (value: boolean) => void;
  language: string;
  yearFilter: string;
  movieLanguageFilter: string;
  setYearFilter: (value: string) => void;
  setMovieLanguageFilter: (value: string) => void;
}

export const MobileFilterModal = ({
  isFilterOpen,
  setIsFilterOpen,
  language,
  yearFilter,
  movieLanguageFilter,
  setYearFilter,
  setMovieLanguageFilter
}: MobileFilterModalProps) => {
  if (!isFilterOpen) return null;
  
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 sm:p-6 md:hidden"
      onClick={() => setIsFilterOpen(false)}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transition-all duration-300 opacity-100 scale-100 border border-gray-200 dark:border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {language === 'fr' ? 'Filtres' : 'Filters'}
            </h3>
            <button
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
              onClick={() => setIsFilterOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Mobile Movie Language Filter */}
            <div>
              <label className="form-label text-gray-700 dark:text-gray-300 block mb-1 text-sm">
                {language === 'fr' ? 'Langue du film' : 'Movie Language'}
              </label>
              <div className="relative">
                <select
                  className="input-field w-full appearance-none pl-8 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm py-2"
                  value={movieLanguageFilter}
                  onChange={(e) => setMovieLanguageFilter(e.target.value)}
                >
                  <option value="">
                    {language === 'fr' ? 'Toutes les langues' : 'All Languages'}
                  </option>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                  <option value="it">Italiano</option>
                  <option value="ja">日本語</option>
                  <option value="ko">한국어</option>
                </select>
                <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
                </svg>
                <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>

            {/* Mobile Year Filter */}
            <div>
              <label className="form-label text-gray-700 dark:text-gray-300 block mb-1 text-sm">
                {language === 'fr' ? 'Année de sortie' : 'Release Year'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1900"
                  max="2025"
                  placeholder={language === 'fr' ? 'Filtrer par année' : 'Filter by year'}
                  className="input-field w-full pl-8 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm py-2"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                />
                <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium px-4 py-2 rounded-lg border border-blue-100 dark:border-blue-700 transition"
              onClick={() => {
                setYearFilter('');
                setMovieLanguageFilter('');
              }}
            >
              {language === 'fr' ? 'Réinitialiser' : 'Reset filters'}
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
              onClick={() => setIsFilterOpen(false)}
            >
              {language === 'fr' ? 'Appliquer' : 'Apply'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};