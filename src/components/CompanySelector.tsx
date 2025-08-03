'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Company {
  name: string;
  domain: string;
  logo: string;
}

const CompanySearchInput = ({
  selectedCompany,
  onSelectCompany,
  placeholder,
}: {
  selectedCompany: Company | null;
  onSelectCompany: (company: Company | null) => void;
  placeholder: string;
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Company[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const url = `https://api.userled.io/api/clearbit/autocomplete?query=${encodeURIComponent(
          query,
        )}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response failed');
        const data: Company[] = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Failed to fetch companies:', error);
        setResults([]);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (company: Company) => {
    onSelectCompany(company);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectCompany(null);
  };

  if (selectedCompany) {
    return (
      <div className="bg-white hover:bg-gray-100 flex w-full items-center gap-2 rounded-lg p-1.5 text-black relative cursor-pointer group">
        <Image
          alt={`${selectedCompany.name} Logo`}
          src={selectedCompany.logo}
          width={24}
          height={24}
          className="rounded-full border border-zinc-100 object-contain"
        />
        <div className="flex-1 truncate font-semibold text-base">{selectedCompany.name}</div>
        <button
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Clear selection"
        >
          &times;
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="disabled:bg-interface-10 focus:border-border-selected flex rounded-lg border font-medium text-slate-900 transition-[border-color,width] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:ring-offset-2 disabled:cursor-not-allowed border-[#CFD0D3] placeholder-content-secondary h-auto w-full bg-white p-2 text-base opacity-100 placeholder:font-bold"
      />
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {results.map((company) => (
            <div
              key={company.domain}
              onClick={() => handleSelect(company)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
            >
              <Image
                alt={`${company.name} Logo`}
                src={company.logo}
                width={24}
                height={24}
                className="rounded-full border border-zinc-100 object-contain"
              />
              <span className="text-black text-sm font-medium">{company.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function CompanySelector({ company1, setCompany1, company2, setCompany2 }: any) {
  const router = useRouter();
  const bothCompaniesSelected = company1 && company2;

  const handleGenerateClick = () => {
    if (bothCompaniesSelected) {
      // Navigate to the new page with URL parameters
      router.push(`/demo?sourceDomain=${company1.domain}&targetDomain=${company2.domain}`);
    }
  };

  return (
    <div className="m-auto max-w-[500px] tracking-wider">
      <div className="bg-website-blue rounded-lg border border-double border-transparent bg-origin-border text-white shadow [background-clip:content-box,border-box]" style={{backgroundImage: `url(${'https://app.userled.io/website/blue-strokes.png'}), linear-gradient(337deg, transparent, transparent 10%, rgba(255, 255, 255, 0.2))`}}>
        <div className="p-4">
          <div className="flex flex-col gap-4 text-white">
            <div className="text-lg flex items-end justify-between font-black">Try it out</div>
            <div className="z-10 flex flex-col items-center gap-4">
              <div className="flex w-full flex-col items-center gap-2 sm:flex-row sm:gap-4">
                <div className="w-full flex-1">
                  <CompanySearchInput
                    selectedCompany={company1}
                    onSelectCompany={setCompany1}
                    placeholder="Your company"
                  />
                </div>
                <div className="text-sm text-inherit shrink font-bold">Selling to</div>
                <div className="w-full flex-1">
                  <CompanySearchInput
                    selectedCompany={company2}
                    onSelectCompany={setCompany2}
                    placeholder="Their company"
                  />
                </div>
              </div>
            </div>
            <div className="w-full pt-2">
              <button
                disabled={!bothCompaniesSelected}
                onClick={handleGenerateClick}
                className="animated-button text-black relative h-9 overflow-hidden rounded-lg border-none bg-white px-4 py-1 text-base font-bold w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="gradient-overlay absolute inset-0 z-0"></div>
                <span className="relative z-10 flex items-center justify-center gap-2 tracking-wider">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    className="h-6 w-6 min-w-[24px]"
                  >
                    <path d="M48,64a8,8,0,0,1,8-8H72V40a8,8,0,0,1,16,0V56h16a8,8,0,0,1,0,16H88V88a8,8,0,0,1-16,0V72H56A8,8,0,0,1,48,64ZM184,192h-8v-8a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0v-8h8a8,8,0,0,0,0-16ZM216,152H200V136a8,8,0,0,0-16,0v16H168a8,8,0,0,0,0,16h16v16a8,8,0,0,0,16,0V168h16a8,8,0,0,0,0-16ZM219.31,80,80,219.31a16,16,0,0,1-22.62,0L36.68,198.63a16,16,0,0,1,0-22.63L176,36.69a16,16,0,0,1,22.63,0l20.68,20.68A16,16,0,0,1,219.31,80Zm-54.63,32L144,91.31l-96,96L68.68,208ZM208,68.69,187.31,48l-32,32L176,100.69Z"></path>
                  </svg>
                  Generate with AI
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}