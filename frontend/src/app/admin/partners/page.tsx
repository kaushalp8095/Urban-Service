'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApiClient } from '@/lib/api/axios';
import { 
  Users, CheckCircle2, XCircle, Clock, Search, 
  ShieldCheck, Loader2, ExternalLink, Mail, Phone, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminPartnersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: partnersData, isLoading } = useQuery({
    queryKey: ['admin-partners'],
    queryFn: async () => {
      const res = await authApiClient.get('/admin/partners');
      return res.data;
    }
  });

  const kycMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await authApiClient.patch(`/admin/partners/${id}/kyc`, { kyc_status: status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-partners'] });
    }
  });

  const partners = partnersData?.data || [];
  const filteredPartners = partners.filter((p: any) => 
    p.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black">Partner Verification</h2>
          <p className="text-muted-foreground">Manage service professionals and their KYC status.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            className="pl-10 pr-4 py-2 border rounded-xl w-full md:w-64 outline-none focus:border-primary transition-colors"
            placeholder="Search partners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredPartners.map((partner: any) => (
            <div key={partner.id} className="bg-white border rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Profile Info */}
                <div className="flex-1 flex gap-6">
                  <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center shrink-0">
                    <Users className="w-10 h-10 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-black text-gray-900">{partner.user?.name}</h3>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        partner.kyc_status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        partner.kyc_status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {partner.kyc_status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground font-medium">
                      <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {partner.user?.email}</div>
                      <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> +91 {partner.user?.phone || '9876543210'}</div>
                      <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {partner.user?.city || 'Not set'}</div>
                    </div>
                  </div>
                </div>

                {/* Experience & Categories */}
                <div className="flex-1 border-l lg:pl-8">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Service Categories</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {partner.category_ids?.map((catId: string) => (
                      <span key={catId} className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">
                        {catId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-2xl">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Avg Rating</p>
                      <p className="text-lg font-black text-primary">★ {partner.rating?.toFixed(1) || '0.0'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-2xl">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Member Since</p>
                      <p className="text-lg font-black">{new Date(partner.created_at).getFullYear()}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col justify-center gap-3 min-w-[200px]">
                  {partner.kyc_status === 'PENDING' ? (
                    <>
                      <Button 
                        onClick={() => kycMutation.mutate({ id: partner.id, status: 'APPROVED' })}
                        disabled={kycMutation.isPending}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold h-12 rounded-2xl"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Approve Partner
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => kycMutation.mutate({ id: partner.id, status: 'REJECTED' })}
                        disabled={kycMutation.isPending}
                        className="border-red-200 text-red-600 hover:bg-red-50 font-bold h-12 rounded-2xl"
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Reject Application
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="h-12 rounded-2xl font-bold"
                      onClick={() => kycMutation.mutate({ id: partner.id, status: 'PENDING' })}
                    >
                      <Clock className="w-4 h-4 mr-2" /> Reset to Pending
                    </Button>
                  )}
                  <Button variant="ghost" className="h-12 rounded-2xl font-bold text-slate-500">
                    <ExternalLink className="w-4 h-4 mr-2" /> View Documents
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {filteredPartners.length === 0 && (
            <div className="text-center py-20 bg-white border-2 border-dashed rounded-[2.5rem]">
              <h3 className="text-xl font-bold text-gray-400">No partners found</h3>
              <p className="text-sm text-gray-400 mt-2">Try searching with a different name or email.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
