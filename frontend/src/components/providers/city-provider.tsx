'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface CityContextType {
  city: string;              // Display name e.g. "Delhi"
  citySlug: string;          // URL slug e.g. "delhi"
  setSelectedCity: (city: string) => void;   // Persists to localStorage (header)
  setTransientCity: (city: string) => void;  // Session-only, NOT saved to localStorage (search bar)
  clearCity: () => void;
}

const CityContext = createContext<CityContextType>({
  city: '',
  citySlug: '',
  setSelectedCity: () => {},
  setTransientCity: () => {},
  clearCity: () => {},
});

export function CityProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState('');
  const [citySlug, setCitySlug] = useState('');

  // On mount: read persisted city from localStorage (browser-only, after hydration)
  useEffect(() => {
    const saved = localStorage.getItem('selectedCity');
    if (saved) {
      setCity(saved);
      setCitySlug(saved.toLowerCase());
    }

    // Listen for PERSISTENT city changes (dispatched by header CitySelect)
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail) {
        setCity(detail);
        setCitySlug(detail.toLowerCase());
        localStorage.setItem('selectedCity', detail);
      } else {
        setCity('');
        setCitySlug('');
        localStorage.removeItem('selectedCity');
      }
    };

    window.addEventListener('urbanServiceCityChanged', handler);
    return () => window.removeEventListener('urbanServiceCityChanged', handler);
  }, []);

  /** Persists to localStorage — use for header city selection */
  const setSelectedCity = useCallback((name: string) => {
    setCity(name);
    setCitySlug(name.toLowerCase());
    localStorage.setItem('selectedCity', name);
    window.dispatchEvent(new CustomEvent('urbanServiceCityChanged', { detail: name }));
  }, []);

  /** Session-only update — does NOT save to localStorage (search bar selection) */
  const setTransientCity = useCallback((name: string) => {
    setCity(name);
    setCitySlug(name.toLowerCase());
    // No localStorage.setItem — clears on refresh naturally
  }, []);

  const clearCity = useCallback(() => {
    setCity('');
    setCitySlug('');
    localStorage.removeItem('selectedCity');
    window.dispatchEvent(new CustomEvent('urbanServiceCityChanged', { detail: '' }));
  }, []);

  return (
    <CityContext.Provider value={{ city, citySlug, setSelectedCity, setTransientCity, clearCity }}>
      {children}
    </CityContext.Provider>
  );
}

export const useCity = () => useContext(CityContext);
