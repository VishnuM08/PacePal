'use client'; // We need this to check the current URL

import { usePathname } from 'next/navigation';
import Navbar from '../app/components/Navbar';
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Define pages where you DO NOT want the Navbar
  const authPages = ['/login', '/signup', '/']; 

  const showNavbar = !authPages.includes(pathname);

  return (
    <html lang="en">
      <body>
        {/* Only show Navbar if we aren't on an auth page */}
        {showNavbar && <Navbar />}
        
        <main>{children}</main>
      </body>
    </html>
  );
}