'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface CityContextType {
  city: string;       // Display name e.g. "Delhi"
  citySlug: string;   // URL slug e.g. "delhi"
  setSelectedCity: (city: string) => void;
  clearCity: () => void;
}

const CityContext = createContext<CityContextType>({
  city: '',
  citySlug: '',
  setSelectedCity: () => {},
  clearCity: () => {},
});

export function CityProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState('');
  const [citySlug, setCitySlug] = useState('');

  // On mount: read from localStorage (runs only in browser, after hydration)
  useEffect(() => {
    const saved = localStorage.getItem('selectedCity');
    if (saved) {
      setCity(saved);
      setCitySlug(saved.toLowerCase());
    }

    // Listen for city changes dispatched by CitySelect
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

  const setSelectedCity = useCallback((name: string) => {
    setCity(name);
    setCitySlug(name.toLowerCase());
    localStorage.setItem('selectedCity', name);
    window.dispatchEvent(new CustomEvent('urbanServiceCityChanged', { detail: name }));
  }, []);

  const clearCity = useCallback(() => {
    setCity('');
    setCitySlug('');
    localStorage.removeItem('selectedCity');
    window.dispatchEvent(new CustomEvent('urbanServiceCityChanged', { detail: '' }));
  }, []);

  return (
    <CityContext.Provider value={{ city, citySlug, setSelectedCity, clearCity }}>
      {children}
    </CityContext.Provider>
  );
}

export const useCity = () => useContext(CityContext);
