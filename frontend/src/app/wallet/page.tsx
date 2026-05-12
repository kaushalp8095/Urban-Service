'use client';

import { useState } from 'react';
import { useWallet, useAddMoney } from '@/lib/api/hooks';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Loader2, CreditCard, History, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function WalletPage() {
  const { data: walletData, isLoading, refetch } = useWallet();
  const addMoneyMutation = useAddMoney();
  
  const [addAmount, setAddAmount] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const wallet = walletData?.data;
  const balance = wallet?.balance || 0;
  const transactions = wallet?.transactions || [];

  const handleAddMoney = async () => {
    const amt = Number(addAmount);
    if (isNaN(amt) || amt <= 0) return;
    
    try {
      await addMoneyMutation.mutateAsync(amt);
      setIsAdding(false);
      setAddAmount('');
      refetch();
    } catch (err) {
      alert('Failed to add money');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-black mb-8">UC Wallet</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Balance Card */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="relative z-10">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Total Balance</p>
                <h2 className="text-5xl font-black mb-8">₹{balance.toLocaleString()}</h2>
                <Button 
                  onClick={() => setIsAdding(true)}
                  className="w-full bg-white text-black hover:bg-gray-100 font-bold h-12 rounded-2xl"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Money
                </Button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border shadow-sm">
              <h3 className="font-bold flex items-center mb-4">
                <CreditCard className="w-5 h-5 mr-2 text-primary" /> Active Offers
              </h3>
              <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                <p className="text-xs font-bold text-primary uppercase mb-1">Wallet Promo</p>
                <p className="text-sm font-bold">Get 10% cashback up to ₹100 on your next add money.</p>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b flex items-center justify-between">
                <h3 className="font-black text-xl flex items-center">
                  <History className="w-5 h-5 mr-2 text-primary" /> Transaction History
                </h3>
              </div>
              
              <div className="divide-y">
                {transactions.length > 0 ? transactions.map((tx: any) => (
                  <div key={tx.id} className="px-8 py-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'CREDIT' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {tx.type === 'CREDIT' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{tx.type === 'CREDIT' ? 'Added to Wallet' : 'Service Booking'}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(tx.created_at), 'MMM dd, yyyy • p')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-black text-lg ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-gray-900'}`}>
                        {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount}
                      </p>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{tx.status}</span>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center text-muted-foreground italic">No transactions found.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add Money Modal */}
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold">Add Money to Wallet</h3>
                <button onClick={() => setIsAdding(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="p-8">
                <div className="relative mb-8">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-400">₹</span>
                  <input 
                    type="number"
                    className="w-full border-2 rounded-2xl pl-10 pr-4 py-4 text-2xl font-black focus:border-primary outline-none transition-colors"
                    placeholder="Enter amount"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    autoFocus
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[200, 500, 1000].map(amt => (
                    <button 
                      key={amt}
                      onClick={() => setAddAmount(amt.toString())}
                      className="py-2 border-2 rounded-xl text-sm font-bold hover:border-primary hover:text-primary transition-all"
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>

                <Button 
                  onClick={handleAddMoney}
                  disabled={addMoneyMutation.isPending || !addAmount}
                  className="w-full h-14 rounded-2xl font-bold text-lg"
                >
                  {addMoneyMutation.isPending ? 'Processing...' : 'Proceed to Pay'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  );
}
