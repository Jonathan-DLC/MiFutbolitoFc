'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import SearchBar from './SearchBar';
import styles from './Navbar.module.css';

const mainLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/en-vivo', label: '🔴 En Vivo' },
  { href: '/ligas', label: '🌍 Ligas' },
  { href: '/comparar', label: '⚔️ Comparar' },
  { href: '/juegos', label: '🎮 Juegos' },
];

const leagueLinks = [
  { href: '/liga/betplay', label: '🇨🇴 Liga BetPlay' },
  { href: '/liga/premier', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League' },
  { href: '/liga/champions-league', label: '🇪🇺 Champions League' },
  { href: '/liga/la-liga', label: '🇪🇸 La Liga' },
  { href: '/liga/serie-a', label: '🇮🇹 Serie A' },
  { href: '/liga/bundesliga', label: '🇩🇪 Bundesliga' },
  { href: '/liga/ligue-1', label: '🇫🇷 Ligue 1' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ligasOpen, setLigasOpen] = useState(false);

  const isLigaActive = pathname.startsWith('/liga/');

  return (
    <nav className={styles.navbar} id="main-navbar">
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo} id="nav-logo" onClick={() => setMobileOpen(false)}>
          <span className={styles.logoIcon}>⚽</span>
          <span className={styles.logoText}>
            Mi<span className={styles.logoAccent}>Futbolito</span>Fc
          </span>
        </Link>

        {/* Hamburger Toggle */}
        <button
          className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Abrir menú de navegación"
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`${styles.navRight} ${mobileOpen ? styles.navRightOpen : ''}`}>
          <ul className={styles.links}>
            {mainLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.link} ${
                    pathname === link.href ? styles.active : ''
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Ligas Dropdown */}
            <li className={styles.dropdownContainer}>
              <button
                className={`${styles.link} ${styles.dropdownTrigger} ${isLigaActive ? styles.active : ''}`}
                onClick={() => setLigasOpen(!ligasOpen)}
                aria-expanded={ligasOpen}
              >
                ⚽ Ligas
                <svg className={`${styles.chevron} ${ligasOpen ? styles.chevronOpen : ''}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <ul className={`${styles.dropdown} ${ligasOpen ? styles.dropdownOpen : ''}`}>
                {leagueLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`${styles.dropdownLink} ${
                        pathname === link.href ? styles.active : ''
                      }`}
                      onClick={() => { setMobileOpen(false); setLigasOpen(false); }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
          
          <div className={styles.searchContainer}>
            <SearchBar />
          </div>
        </div>
      </div>
    </nav>
  );
}
