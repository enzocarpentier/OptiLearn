'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import { Suspense } from 'react';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

  return (
    <>
      {!isAuthPage && (
        <Suspense fallback={<div className="h-16 bg-gray-900 shadow-md"></div>}>
          <Header />
        </Suspense>
      )}
      <main className={`flex-grow ${!isAuthPage ? 'pt-20' : ''}`}>{children}</main>
    </>
  );
}
