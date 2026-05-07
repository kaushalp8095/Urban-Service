'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, Search, ChevronDown, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useCity } from '@/components/providers/city-provider';

const CITIES = [
  // Andhra Pradesh
  { name: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { name: 'Vijayawada', state: 'Andhra Pradesh' },
  { name: 'Guntur', state: 'Andhra Pradesh' },
  { name: 'Nellore', state: 'Andhra Pradesh' },
  { name: 'Kurnool', state: 'Andhra Pradesh' },
  { name: 'Rajahmundry', state: 'Andhra Pradesh' },
  { name: 'Tirupati', state: 'Andhra Pradesh' },
  { name: 'Kakinada', state: 'Andhra Pradesh' },
  { name: 'Kadapa', state: 'Andhra Pradesh' },
  { name: 'Anantapur', state: 'Andhra Pradesh' },
  { name: 'Eluru', state: 'Andhra Pradesh' },
  { name: 'Ongole', state: 'Andhra Pradesh' },
  { name: 'Nandyal', state: 'Andhra Pradesh' },
  { name: 'Machilipatnam', state: 'Andhra Pradesh' },
  // Arunachal Pradesh
  { name: 'Itanagar', state: 'Arunachal Pradesh' },
  // Assam
  { name: 'Guwahati', state: 'Assam' },
  { name: 'Silchar', state: 'Assam' },
  { name: 'Dibrugarh', state: 'Assam' },
  { name: 'Jorhat', state: 'Assam' },
  { name: 'Tezpur', state: 'Assam' },
  // Bihar
  { name: 'Patna', state: 'Bihar' },
  { name: 'Gaya', state: 'Bihar' },
  { name: 'Muzaffarpur', state: 'Bihar' },
  { name: 'Bhagalpur', state: 'Bihar' },
  { name: 'Darbhanga', state: 'Bihar' },
  { name: 'Arrah', state: 'Bihar' },
  { name: 'Begusarai', state: 'Bihar' },
  { name: 'Chhapra', state: 'Bihar' },
  { name: 'Purnia', state: 'Bihar' },
  { name: 'Sasaram', state: 'Bihar' },
  { name: 'Bihar Sharif', state: 'Bihar' },
  // Chhattisgarh
  { name: 'Raipur', state: 'Chhattisgarh' },
  { name: 'Bhilai', state: 'Chhattisgarh' },
  { name: 'Bilaspur', state: 'Chhattisgarh' },
  { name: 'Durg', state: 'Chhattisgarh' },
  { name: 'Korba', state: 'Chhattisgarh' },
  { name: 'Rajnandgaon', state: 'Chhattisgarh' },
  // Delhi
  { name: 'New Delhi', state: 'Delhi' },
  { name: 'Delhi', state: 'Delhi' },
  { name: 'Dwarka', state: 'Delhi' },
  { name: 'Rohini', state: 'Delhi' },
  // Goa
  { name: 'Panaji', state: 'Goa' },
  { name: 'Margao', state: 'Goa' },
  { name: 'Vasco da Gama', state: 'Goa' },
  // Gujarat
  { name: 'Ahmedabad', state: 'Gujarat' },
  { name: 'Surat', state: 'Gujarat' },
  { name: 'Vadodara', state: 'Gujarat' },
  { name: 'Rajkot', state: 'Gujarat' },
  { name: 'Bhavnagar', state: 'Gujarat' },
  { name: 'Jamnagar', state: 'Gujarat' },
  { name: 'Gandhinagar', state: 'Gujarat' },
  { name: 'Junagadh', state: 'Gujarat' },
  { name: 'Anand', state: 'Gujarat' },
  { name: 'Navsari', state: 'Gujarat' },
  { name: 'Morbi', state: 'Gujarat' },
  { name: 'Mehsana', state: 'Gujarat' },
  { name: 'Patan', state: 'Gujarat' },
  { name: 'Surendranagar', state: 'Gujarat' },
  { name: 'Bharuch', state: 'Gujarat' },
  { name: 'Valsad', state: 'Gujarat' },
  { name: 'Botad', state: 'Gujarat' },
  { name: 'Amreli', state: 'Gujarat' },
  { name: 'Ankleshwar', state: 'Gujarat' },
  { name: 'Palanpur', state: 'Gujarat' },
  { name: 'Porbandar', state: 'Gujarat' },
  { name: 'Godhra', state: 'Gujarat' },
  { name: 'Nadiad', state: 'Gujarat' },
  { name: 'Visnagar', state: 'Gujarat' },
  { name: 'Himatnagar', state: 'Gujarat' },
  { name: 'Modasa', state: 'Gujarat' },
  { name: 'Dahod', state: 'Gujarat' },
  { name: 'Veraval', state: 'Gujarat' },
  { name: 'Gandhidham', state: 'Gujarat' },
  { name: 'Sabar Kantha', state: 'Gujarat' },
  { name: 'Bhuj', state: 'Gujarat' },
  { name: 'Deesa', state: 'Gujarat' },
  { name: 'Wankaner', state: 'Gujarat' },
  { name: 'Idar', state: 'Gujarat' },
  { name: 'Lunawada', state: 'Gujarat' },
  // Haryana
  { name: 'Faridabad', state: 'Haryana' },
  { name: 'Gurgaon', state: 'Haryana' },
  { name: 'Panipat', state: 'Haryana' },
  { name: 'Ambala', state: 'Haryana' },
  { name: 'Yamunanagar', state: 'Haryana' },
  { name: 'Rohtak', state: 'Haryana' },
  { name: 'Hisar', state: 'Haryana' },
  { name: 'Karnal', state: 'Haryana' },
  { name: 'Sonipat', state: 'Haryana' },
  { name: 'Panchkula', state: 'Haryana' },
  { name: 'Bhiwani', state: 'Haryana' },
  { name: 'Sirsa', state: 'Haryana' },
  { name: 'Bahadurgarh', state: 'Haryana' },
  { name: 'Jind', state: 'Haryana' },
  // Himachal Pradesh
  { name: 'Shimla', state: 'Himachal Pradesh' },
  { name: 'Dharamshala', state: 'Himachal Pradesh' },
  { name: 'Solan', state: 'Himachal Pradesh' },
  { name: 'Mandi', state: 'Himachal Pradesh' },
  // Jharkhand
  { name: 'Dhanbad', state: 'Jharkhand' },
  { name: 'Ranchi', state: 'Jharkhand' },
  { name: 'Jamshedpur', state: 'Jharkhand' },
  { name: 'Bokaro', state: 'Jharkhand' },
  { name: 'Deoghar', state: 'Jharkhand' },
  { name: 'Hazaribagh', state: 'Jharkhand' },
  // Karnataka
  { name: 'Bangalore', state: 'Karnataka' },
  { name: 'Mysore', state: 'Karnataka' },
  { name: 'Hubli', state: 'Karnataka' },
  { name: 'Mangalore', state: 'Karnataka' },
  { name: 'Belgaum', state: 'Karnataka' },
  { name: 'Gulbarga', state: 'Karnataka' },
  { name: 'Davangere', state: 'Karnataka' },
  { name: 'Bellary', state: 'Karnataka' },
  { name: 'Bijapur', state: 'Karnataka' },
  { name: 'Shimoga', state: 'Karnataka' },
  { name: 'Tumkur', state: 'Karnataka' },
  { name: 'Raichur', state: 'Karnataka' },
  { name: 'Bidar', state: 'Karnataka' },
  { name: 'Hospet', state: 'Karnataka' },
  { name: 'Hassan', state: 'Karnataka' },
  { name: 'Udupi', state: 'Karnataka' },
  // Kerala
  { name: 'Thiruvananthapuram', state: 'Kerala' },
  { name: 'Kochi', state: 'Kerala' },
  { name: 'Kozhikode', state: 'Kerala' },
  { name: 'Thrissur', state: 'Kerala' },
  { name: 'Kollam', state: 'Kerala' },
  { name: 'Alappuzha', state: 'Kerala' },
  { name: 'Kannur', state: 'Kerala' },
  { name: 'Palakkad', state: 'Kerala' },
  { name: 'Malappuram', state: 'Kerala' },
  { name: 'Kottayam', state: 'Kerala' },
  // Madhya Pradesh
  { name: 'Indore', state: 'Madhya Pradesh' },
  { name: 'Bhopal', state: 'Madhya Pradesh' },
  { name: 'Jabalpur', state: 'Madhya Pradesh' },
  { name: 'Gwalior', state: 'Madhya Pradesh' },
  { name: 'Ujjain', state: 'Madhya Pradesh' },
  { name: 'Sagar', state: 'Madhya Pradesh' },
  { name: 'Dewas', state: 'Madhya Pradesh' },
  { name: 'Satna', state: 'Madhya Pradesh' },
  { name: 'Ratlam', state: 'Madhya Pradesh' },
  { name: 'Rewa', state: 'Madhya Pradesh' },
  { name: 'Murwara', state: 'Madhya Pradesh' },
  { name: 'Singrauli', state: 'Madhya Pradesh' },
  { name: 'Burhanpur', state: 'Madhya Pradesh' },
  { name: 'Chhindwara', state: 'Madhya Pradesh' },
  { name: 'Morena', state: 'Madhya Pradesh' },
  { name: 'Bhind', state: 'Madhya Pradesh' },
  // Maharashtra
  { name: 'Mumbai', state: 'Maharashtra' },
  { name: 'Pune', state: 'Maharashtra' },
  { name: 'Nagpur', state: 'Maharashtra' },
  { name: 'Thane', state: 'Maharashtra' },
  { name: 'Nashik', state: 'Maharashtra' },
  { name: 'Aurangabad', state: 'Maharashtra' },
  { name: 'Solapur', state: 'Maharashtra' },
  { name: 'Kolhapur', state: 'Maharashtra' },
  { name: 'Amravati', state: 'Maharashtra' },
  { name: 'Sangli', state: 'Maharashtra' },
  { name: 'Mira Bhayandar', state: 'Maharashtra' },
  { name: 'Bhiwandi', state: 'Maharashtra' },
  { name: 'Jalgaon', state: 'Maharashtra' },
  { name: 'Akola', state: 'Maharashtra' },
  { name: 'Latur', state: 'Maharashtra' },
  { name: 'Dhule', state: 'Maharashtra' },
  { name: 'Nanded', state: 'Maharashtra' },
  { name: 'Navi Mumbai', state: 'Maharashtra' },
  { name: 'Vasai-Virar', state: 'Maharashtra' },
  { name: 'Ahmednagar', state: 'Maharashtra' },
  { name: 'Malegaon', state: 'Maharashtra' },
  { name: 'Satara', state: 'Maharashtra' },
  { name: 'Ratnagiri', state: 'Maharashtra' },
  // Manipur
  { name: 'Imphal', state: 'Manipur' },
  // Meghalaya
  { name: 'Shillong', state: 'Meghalaya' },
  // Mizoram
  { name: 'Aizawl', state: 'Mizoram' },
  // Nagaland
  { name: 'Kohima', state: 'Nagaland' },
  { name: 'Dimapur', state: 'Nagaland' },
  // Odisha
  { name: 'Bhubaneswar', state: 'Odisha' },
  { name: 'Cuttack', state: 'Odisha' },
  { name: 'Rourkela', state: 'Odisha' },
  { name: 'Berhampur', state: 'Odisha' },
  { name: 'Sambalpur', state: 'Odisha' },
  { name: 'Puri', state: 'Odisha' },
  // Punjab
  { name: 'Ludhiana', state: 'Punjab' },
  { name: 'Amritsar', state: 'Punjab' },
  { name: 'Jalandhar', state: 'Punjab' },
  { name: 'Patiala', state: 'Punjab' },
  { name: 'Bathinda', state: 'Punjab' },
  { name: 'Pathankot', state: 'Punjab' },
  { name: 'Hoshiarpur', state: 'Punjab' },
  { name: 'Mohali', state: 'Punjab' },
  { name: 'Phagwara', state: 'Punjab' },
  { name: 'Moga', state: 'Punjab' },
  // Rajasthan
  { name: 'Jaipur', state: 'Rajasthan' },
  { name: 'Jodhpur', state: 'Rajasthan' },
  { name: 'Kota', state: 'Rajasthan' },
  { name: 'Bikaner', state: 'Rajasthan' },
  { name: 'Ajmer', state: 'Rajasthan' },
  { name: 'Udaipur', state: 'Rajasthan' },
  { name: 'Bhilwara', state: 'Rajasthan' },
  { name: 'Alwar', state: 'Rajasthan' },
  { name: 'Sikar', state: 'Rajasthan' },
  { name: 'Sri Ganganagar', state: 'Rajasthan' },
  { name: 'Bharatpur', state: 'Rajasthan' },
  { name: 'Pali', state: 'Rajasthan' },
  { name: 'Barmer', state: 'Rajasthan' },
  { name: 'Hanumangarh', state: 'Rajasthan' },
  { name: 'Churu', state: 'Rajasthan' },
  { name: 'Tonk', state: 'Rajasthan' },
  { name: 'Sawai Madhopur', state: 'Rajasthan' },
  // Sikkim
  { name: 'Gangtok', state: 'Sikkim' },
  // Tamil Nadu
  { name: 'Chennai', state: 'Tamil Nadu' },
  { name: 'Coimbatore', state: 'Tamil Nadu' },
  { name: 'Madurai', state: 'Tamil Nadu' },
  { name: 'Trichy', state: 'Tamil Nadu' },
  { name: 'Salem', state: 'Tamil Nadu' },
  { name: 'Tirunelveli', state: 'Tamil Nadu' },
  { name: 'Tiruppur', state: 'Tamil Nadu' },
  { name: 'Vellore', state: 'Tamil Nadu' },
  { name: 'Erode', state: 'Tamil Nadu' },
  { name: 'Thoothukudi', state: 'Tamil Nadu' },
  { name: 'Dindigul', state: 'Tamil Nadu' },
  { name: 'Thanjavur', state: 'Tamil Nadu' },
  { name: 'Ranipet', state: 'Tamil Nadu' },
  { name: 'Sivakasi', state: 'Tamil Nadu' },
  { name: 'Karur', state: 'Tamil Nadu' },
  // Telangana
  { name: 'Hyderabad', state: 'Telangana' },
  { name: 'Warangal', state: 'Telangana' },
  { name: 'Nizamabad', state: 'Telangana' },
  { name: 'Karimnagar', state: 'Telangana' },
  { name: 'Khammam', state: 'Telangana' },
  { name: 'Ramagundam', state: 'Telangana' },
  { name: 'Mahbubnagar', state: 'Telangana' },
  // Tripura
  { name: 'Agartala', state: 'Tripura' },
  // Uttar Pradesh
  { name: 'Lucknow', state: 'Uttar Pradesh' },
  { name: 'Kanpur', state: 'Uttar Pradesh' },
  { name: 'Agra', state: 'Uttar Pradesh' },
  { name: 'Varanasi', state: 'Uttar Pradesh' },
  { name: 'Prayagraj', state: 'Uttar Pradesh' },
  { name: 'Meerut', state: 'Uttar Pradesh' },
  { name: 'Bareilly', state: 'Uttar Pradesh' },
  { name: 'Aligarh', state: 'Uttar Pradesh' },
  { name: 'Ghaziabad', state: 'Uttar Pradesh' },
  { name: 'Noida', state: 'Uttar Pradesh' },
  { name: 'Moradabad', state: 'Uttar Pradesh' },
  { name: 'Saharanpur', state: 'Uttar Pradesh' },
  { name: 'Gorakhpur', state: 'Uttar Pradesh' },
  { name: 'Firozabad', state: 'Uttar Pradesh' },
  { name: 'Jhansi', state: 'Uttar Pradesh' },
  { name: 'Muzaffarnagar', state: 'Uttar Pradesh' },
  { name: 'Mathura', state: 'Uttar Pradesh' },
  { name: 'Rampur', state: 'Uttar Pradesh' },
  { name: 'Shahjahanpur', state: 'Uttar Pradesh' },
  { name: 'Farrukhabad', state: 'Uttar Pradesh' },
  { name: 'Hapur', state: 'Uttar Pradesh' },
  { name: 'Etawah', state: 'Uttar Pradesh' },
  { name: 'Mirzapur', state: 'Uttar Pradesh' },
  { name: 'Bulandshahr', state: 'Uttar Pradesh' },
  { name: 'Sambhal', state: 'Uttar Pradesh' },
  { name: 'Amroha', state: 'Uttar Pradesh' },
  { name: 'Hardoi', state: 'Uttar Pradesh' },
  { name: 'Fatehpur', state: 'Uttar Pradesh' },
  { name: 'Raebareli', state: 'Uttar Pradesh' },
  { name: 'Bahraich', state: 'Uttar Pradesh' },
  { name: 'Unnao', state: 'Uttar Pradesh' },
  { name: 'Sitapur', state: 'Uttar Pradesh' },
  { name: 'Lakhimpur', state: 'Uttar Pradesh' },
  { name: 'Sultanpur', state: 'Uttar Pradesh' },
  { name: 'Azamgarh', state: 'Uttar Pradesh' },
  { name: 'Gonda', state: 'Uttar Pradesh' },
  { name: 'Jaunpur', state: 'Uttar Pradesh' },
  { name: 'Orai', state: 'Uttar Pradesh' },
  // Uttarakhand
  { name: 'Dehradun', state: 'Uttarakhand' },
  { name: 'Haridwar', state: 'Uttarakhand' },
  { name: 'Roorkee', state: 'Uttarakhand' },
  { name: 'Haldwani', state: 'Uttarakhand' },
  { name: 'Rudrapur', state: 'Uttarakhand' },
  { name: 'Kashipur', state: 'Uttarakhand' },
  // West Bengal
  { name: 'Kolkata', state: 'West Bengal' },
  { name: 'Howrah', state: 'West Bengal' },
  { name: 'Durgapur', state: 'West Bengal' },
  { name: 'Asansol', state: 'West Bengal' },
  { name: 'Siliguri', state: 'West Bengal' },
  { name: 'Bardhaman', state: 'West Bengal' },
  { name: 'Malda', state: 'West Bengal' },
  { name: 'Baharampur', state: 'West Bengal' },
  { name: 'Habra', state: 'West Bengal' },
  { name: 'Kharagpur', state: 'West Bengal' },
  { name: 'Shantipur', state: 'West Bengal' },
  { name: 'Darjeeling', state: 'West Bengal' },
  // Union Territories
  { name: 'Chandigarh', state: 'Chandigarh' },
  { name: 'Puducherry', state: 'Puducherry' },
  { name: 'Srinagar', state: 'Jammu & Kashmir' },
  { name: 'Jammu', state: 'Jammu & Kashmir' },
  { name: 'Leh', state: 'Ladakh' },
  { name: 'Silvassa', state: 'Dadra & Nagar Haveli' },
  { name: 'Daman', state: 'Daman & Diu' },
  { name: 'Port Blair', state: 'Andaman & Nicobar' },
  { name: 'Kavaratti', state: 'Lakshadweep' },
];

interface CitySelectProps {
  selectedCity?: string;
  onSelect?: (city: string) => void;
  variant?: 'header' | 'searchbar';
  shouldRedirect?: boolean;
}

export function CitySelect({ onSelect, variant = 'header', shouldRedirect = true }: CitySelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { city: contextCity, setSelectedCity: setContextCity, setTransientCity, clearCity } = useCity();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Sync city FROM URL into context — only for the header CitySelect (shouldRedirect=true)
  // The search bar CitySelect doesn't need to do this (it's session-only)
  useEffect(() => {
    if (!shouldRedirect) return;   // skip for search bar

    const pathSegments = pathname.split('/').filter(Boolean);
    const reservedRoutes = ['login', 'booking', 'orders', 'profile', 'partner', 'admin', 'search'];
    const cityFromUrl = pathSegments.length > 0 && !reservedRoutes.includes(pathSegments[0])
      ? pathSegments[0]
      : null;

    if (cityFromUrl) {
      const formattedCity = cityFromUrl.charAt(0).toUpperCase() + cityFromUrl.slice(1);
      if (formattedCity !== contextCity) {
        setContextCity(formattedCity); // persist — user navigated to this city URL
      }
    }
  }, [pathname]);

  // Use context city as the display value
  const currentCity = contextCity;

  const filtered = CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.state.toLowerCase().includes(search.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search on open
  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (cityName: string) => {
    if (shouldRedirect) {
      // Header: persist to localStorage so it survives refresh
      setContextCity(cityName);
    } else {
      // Search bar: session-only, cleared on refresh
      setTransientCity(cityName);
    }
    setIsOpen(false);
    setSearch('');
    if (onSelect) onSelect(cityName);
    if (shouldRedirect) {
      router.push(`/${cityName.toLowerCase()}`);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearCity();  // clears context + localStorage + dispatches event
    if (onSelect) onSelect('');
    if (shouldRedirect) router.push('/');
  };

  // Styling variants
  const triggerStyles = variant === 'searchbar' 
    ? `flex items-center gap-2 text-sm font-bold px-3 py-2 w-full sm:w-[150px] justify-between transition-all ${
        isOpen ? 'text-amber-600' : 'text-gray-700 hover:bg-gray-50'
      }`
    : `flex items-center gap-2 text-xs md:text-sm font-bold px-2 md:px-4 py-2 md:py-2.5 rounded-xl md:rounded-2xl border transition-all duration-300 ${
        isOpen
          ? 'border-amber-400 text-amber-600 bg-amber-50'
          : 'border-gray-100 text-gray-500 hover:text-black hover:bg-gray-50'
      }`;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button onClick={() => setIsOpen((v) => !v)} className={triggerStyles}>
        <div className="flex items-center gap-1.5 md:gap-2 truncate">
          <MapPin className={`w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 ${currentCity ? 'text-amber-500' : 'text-gray-400'}`} />
          <span className="truncate max-w-[80px] md:max-w-[120px]">{currentCity || 'Select City'}</span>
        </div>
        {currentCity ? (
          <X className="w-3 h-3 md:w-3.5 md:h-3.5 ml-1 hover:text-red-500 transition-colors" onClick={handleClear} />
        ) : (
          <ChevronDown className={`w-3 h-3 md:w-3.5 md:h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {/* Dropdown - Fixed Z-Index and overflow issues */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-[280px] md:w-72 bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Search Input */}
          <div className="p-3 border-b bg-gray-50">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city or state..."
                className="text-sm w-full outline-none bg-transparent text-black placeholder:text-gray-400"
              />
              {search && (
                <button onClick={() => setSearch('')}>
                  <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* City List */}
          <ul className="max-h-64 overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-muted-foreground">
                No cities found for "<span className="font-medium">{search}</span>"
              </li>
            ) : (
              filtered.map((city, idx) => (
                <li key={`${city.name}-${city.state}-${idx}`}>
                  <button
                    onClick={() => handleSelect(city.name)}
                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-blue-50 hover:text-primary transition-colors text-sm ${
                      currentCity === city.name ? 'bg-blue-50 text-primary font-semibold' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                      <span>{city.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{city.state}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
