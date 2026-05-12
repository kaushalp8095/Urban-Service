'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings, Bell, Shield, Smartphone, Moon, 
  HelpCircle, ChevronRight, ArrowLeft, Globe, 
  Trash2, LogOut, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');

  const settingsOptions = [
    { 
      title: 'Notifications', 
      icon: Bell, 
      desc: 'Booking updates, reminders & offers',
      action: <button 
        onClick={() => setNotifications(!notifications)}
        className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-primary' : 'bg-gray-200'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifications ? 'left-7' : 'left-1'}`} />
      </button>
    },
    { 
      title: 'Language', 
      icon: Globe, 
      desc: 'Selected: ' + language,
      onClick: () => setLanguage(language === 'English' ? 'Hindi' : 'English')
    },
    { 
      title: 'App Theme', 
      icon: darkMode ? Moon : Smartphone, 
      desc: 'Light / Dark mode',
      action: <button 
        onClick={() => setDarkMode(!darkMode)}
        className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-indigo-600' : 'bg-gray-200'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${darkMode ? 'left-7' : 'left-1'}`} />
      </button>
    },
    { 
      title: 'Privacy & Security', 
      icon: Shield, 
      desc: 'Passwords, permissions & data',
      link: '#'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-2xl py-8">
        <div className="space-y-8">
          
          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">General Settings</h2>
            <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
              <div className="divide-y">
                {settingsOptions.map((opt, i) => (
                  <div 
                    key={i} 
                    onClick={opt.onClick}
                    className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 group-hover:text-primary transition-colors">
                        <opt.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{opt.title}</p>
                        <p className="text-xs text-muted-foreground">{opt.desc}</p>
                      </div>
                    </div>
                    {opt.action ? opt.action : <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-all" />}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">Support & Feedback</h2>
            <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
              <div className="divide-y">
                <Link href="/helpcenter" className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600"><HelpCircle className="w-5 h-5" /></div>
                    <p className="font-bold text-gray-900">Help Center</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </Link>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-4 px-4">Danger Zone</h2>
            <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
              <div className="divide-y">
                <button className="w-full p-6 flex items-center gap-4 hover:bg-red-50 transition-colors group">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-500"><Trash2 className="w-5 h-5" /></div>
                  <div className="text-left">
                    <p className="font-bold text-red-600">Delete Account</p>
                    <p className="text-xs text-red-400">Permanently remove all your data</p>
                  </div>
                </button>
              </div>
            </div>
          </section>

          <div className="text-center pt-8">
            <p className="text-xs text-gray-400 mb-2">Urban Service v1.0.42</p>
            <p className="text-xs text-gray-400">Made with ❤️ for a better home</p>
          </div>

        </div>
      </div>
    </div>
  );
}
