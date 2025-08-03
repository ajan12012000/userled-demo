// app/page.tsx
'use client';

import { useState } from 'react';
import CompanySelector from '../components/CompanySelector';

interface Company {
  name: string;
  domain: string;
  logo: string;
}

export default function Home() {
  const [company1, setCompany1] = useState<Company | null>(null);
  const [company2, setCompany2] = useState<Company | null>(null);

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-8 bg-cover bg-center"
      style={{
        backgroundImage: `url(https://cdn.prod.website-files.com/66543b899126d2bc98585ae7/6703b253e26cb67b1b2bb0e9_Group%201400001781.avif)`,
      }}
    >
      <div className="z-10">
        <h1 className="text-4xl text-white font-bold mb-8">Your bespoke email in seconds</h1>
        <CompanySelector
          company1={company1}
          setCompany1={setCompany1}
          company2={company2}
          setCompany2={setCompany2}
        />
      </div>
    </main>
  );
}