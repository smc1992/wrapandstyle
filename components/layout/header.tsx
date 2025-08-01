import Link from 'next/link'
import { Button } from '@/components/ui/button'

import Image from 'next/image'
import { mainMenu } from '@/menu.config'
import { MobileNav } from '@/components/nav/mobile-nav'
import HeaderAuth from './header-auth' // Import the new client component

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div style={{ position: 'relative', width: '120px', height: '32px' }}>
              <Image
                src="/images/Logo-wrapandstyle.webp"
                alt="Wrap&Style Logo"
                fill
                sizes="120px"
                style={{ objectFit: 'contain' }}
              />
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {mainMenu.map((item: { href: string; label: string }) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <MobileNav />
          <HeaderAuth /> {/* Use the new component here */}
        </div>
      </div>
    </header>
  )
}
