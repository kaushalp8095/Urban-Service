'use client';

import { useState } from 'react';
import { 
  useCategories, 
  useCreateCategory, useUpdateCategory, useDeleteCategory,
  useCreateServiceAdmin, useUpdateServiceAdmin, useDeleteServiceAdmin,
  useCreatePackage, useUpdatePackage, useDeletePackage,
  useServicesByCategory 
} from '@/lib/api/hooks';
import { Button } from '@/components/ui/button';
import { 
  Plus, Edit2, Trash2, ChevronRight, LayoutGrid, 
  Wrench, Box, Loader2, Search, X, Check
} from 'lucide-react';

export default function AdminServicesPage() {
  const [activeTab, setActiveTab] = useState<'categories' | 'services' | 'packages'>('categories');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black">Catalog Management</h2>
          <p className="text-muted-foreground">Manage your categories, services, and pricing packages.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {[
          { id: 'categories', label: 'Categories', icon: LayoutGrid },
          { id: 'services', label: 'Services', icon: Wrench },
          { id: 'packages', label: 'Packages', icon: Box },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-6 py-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === tab.id 
                ? 'border-primary text-primary bg-primary/5' 
                : 'border-transparent text-gray-500 hover:text-black hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === 'categories' && <CategoryManager onSelect={(id) => { setSelectedCategoryId(id); setActiveTab('services'); }} />}
        {activeTab === 'services' && (
          <ServiceManager 
            initialCategoryId={selectedCategoryId} 
            onSelect={(id) => { setSelectedServiceId(id); setActiveTab('packages'); }} 
          />
        )}
        {activeTab === 'packages' && <PackageManager initialServiceId={selectedServiceId} />}
      </div>
    </div>
  );
}

// --- CATEGORY MANAGER ---
function CategoryManager({ onSelect }: { onSelect: (id: string) => void }) {
  const { data: catData, isLoading, refetch } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', image_url: '', city_ids: [] });

  const categories = catData?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCat) {
        await updateMutation.mutateAsync({ id: editingCat.id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setIsFormOpen(false);
      setEditingCat(null);
      setFormData({ name: '', image_url: '', city_ids: [] });
      refetch();
    } catch (err) {
      alert('Operation failed');
    }
  };

  if (isLoading) return <Loader2 className="w-8 h-8 animate-spin mx-auto py-20" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Manage Categories</h3>
        <Button onClick={() => { setIsFormOpen(true); setEditingCat(null); setFormData({ name: '', image_url: '', city_ids: [] }); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-2xl border-2 border-primary/10 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Category Name</label>
              <input 
                required 
                className="w-full border rounded-lg px-3 py-2" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Icon/Emoji</label>
              <input 
                placeholder="e.g. ❄️" 
                className="w-full border rounded-lg px-3 py-2" 
                value={formData.image_url} 
                onChange={e => setFormData({...formData, image_url: e.target.value})} 
              />
            </div>
          </div>
          <div className="mt-6 flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {editingCat ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat: any) => (
          <div key={cat.id} className="bg-white border p-6 rounded-2xl flex items-center justify-between group hover:border-primary/30 transition-all">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => onSelect(cat.id)}>
              <div className="text-3xl bg-gray-50 w-12 h-12 rounded-xl flex items-center justify-center">{cat.image_url || '✨'}</div>
              <div>
                <h4 className="font-bold">{cat.name}</h4>
                <p className="text-xs text-muted-foreground">{cat.subcategories?.length || 0} subcategories</p>
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingCat(cat); setFormData({ name: cat.name, image_url: cat.image_url || '', city_ids: cat.city_ids || [] }); setIsFormOpen(true); }}>
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={async () => { if(confirm('Delete?')) { await deleteMutation.mutateAsync(cat.id); refetch(); } }}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- SERVICE MANAGER ---
function ServiceManager({ initialCategoryId, onSelect }: { initialCategoryId: string | null, onSelect: (id: string) => void }) {
  const { data: catData } = useCategories();
  const [selectedCat, setSelectedCat] = useState(initialCategoryId || '');
  const { data: svcData, isLoading, refetch } = useServicesByCategory(selectedCat);
  
  const createMutation = useCreateServiceAdmin();
  const updateMutation = useUpdateServiceAdmin();
  const deleteMutation = useDeleteServiceAdmin();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSvc, setEditingSvc] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', description: '', city_ids: ['Mumbai'], is_active: true });

  const categories = catData?.data || [];
  const services = svcData?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData, category_id: selectedCat };
      if (editingSvc) {
        await updateMutation.mutateAsync({ id: editingSvc.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsFormOpen(false);
      setEditingSvc(null);
      setFormData({ name: '', description: '', city_ids: ['Mumbai'], is_active: true });
      refetch();
    } catch (err) {
      alert('Operation failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold">Manage Services</h3>
          <select 
            className="mt-2 border rounded-lg px-3 py-2 text-sm bg-white"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
          >
            <option value="">Select Category...</option>
            {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <Button disabled={!selectedCat} onClick={() => { setIsFormOpen(true); setEditingSvc(null); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Service
        </Button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-2xl border-2 border-primary/10 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Service Name</label>
              <input required className="w-full border rounded-lg px-3 py-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Description</label>
              <textarea className="w-full border rounded-lg px-3 py-2" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>
          <div className="mt-6 flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button type="submit">
              {editingSvc ? 'Update Service' : 'Create Service'}
            </Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <Loader2 className="w-8 h-8 animate-spin mx-auto py-10" />
      ) : services.length > 0 ? (
        <div className="bg-white border rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 font-bold uppercase text-[10px] tracking-widest text-gray-500">
              <tr>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Packages</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {services.map((svc: any) => (
                <tr key={svc.id} className="hover:bg-gray-50/50 group">
                  <td className="px-6 py-4 cursor-pointer" onClick={() => onSelect(svc.id)}>
                    <div className="font-bold text-gray-900">{svc.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{svc.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${svc.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {svc.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">{svc.packages?.length || 0} pkgs</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingSvc(svc); setFormData({ name: svc.name, description: svc.description || '', city_ids: svc.city_ids || ['Mumbai'], is_active: svc.is_active }); setIsFormOpen(true); }}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={async () => { if(confirm('Delete?')) { await deleteMutation.mutateAsync(svc.id); refetch(); } }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground italic border-2 border-dashed rounded-2xl">
          {selectedCat ? 'No services found in this category.' : 'Please select a category above.'}
        </div>
      )}
    </div>
  );
}

// --- PACKAGE MANAGER ---
function PackageManager({ initialServiceId }: { initialServiceId: string | null }) {
  const { data: catData } = useCategories();
  const [selectedCat, setSelectedCat] = useState('');
  const { data: svcData } = useServicesByCategory(selectedCat);
  const [selectedSvc, setSelectedSvc] = useState(initialServiceId || '');
  
  // Custom hook to get service details including packages
  const { data: serviceDetail, isLoading, refetch } = useServiceAdminPackages(selectedSvc);

  const createMutation = useCreatePackage();
  const updateMutation = useUpdatePackage();
  const deleteMutation = useDeletePackage();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', price: 0, duration_min: 30, inclusions_json: [] });

  const categories = catData?.data || [];
  const services = svcData?.data || [];
  const packages = serviceDetail?.data?.packages || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData, service_id: selectedSvc };
      if (editingPkg) {
        await updateMutation.mutateAsync({ id: editingPkg.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setIsFormOpen(false);
      setEditingPkg(null);
      setFormData({ name: '', price: 0, duration_min: 30, inclusions_json: [] });
      refetch();
    } catch (err) {
      alert('Operation failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex gap-2 flex-wrap">
          <select 
            className="border rounded-lg px-3 py-2 text-sm bg-white"
            value={selectedCat}
            onChange={(e) => { setSelectedCat(e.target.value); setSelectedSvc(''); }}
          >
            <option value="">Select Category...</option>
            {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select 
            className="border rounded-lg px-3 py-2 text-sm bg-white"
            disabled={!selectedCat}
            value={selectedSvc}
            onChange={(e) => setSelectedSvc(e.target.value)}
          >
            <option value="">Select Service...</option>
            {services.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <Button disabled={!selectedSvc} onClick={() => { setIsFormOpen(true); setEditingPkg(null); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Package
        </Button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-2xl border-2 border-primary/10 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-bold mb-1">Package Name</label>
              <input required className="w-full border rounded-lg px-3 py-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Price (₹)</label>
              <input type="number" required className="w-full border rounded-lg px-3 py-2" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Duration (Min)</label>
              <input type="number" required className="w-full border rounded-lg px-3 py-2" value={formData.duration_min} onChange={e => setFormData({...formData, duration_min: Number(e.target.value)})} />
            </div>
          </div>
          <div className="mt-6 flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button type="submit">
              {editingPkg ? 'Update Package' : 'Create Package'}
            </Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <Loader2 className="w-8 h-8 animate-spin mx-auto py-10" />
      ) : packages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg: any) => (
            <div key={pkg.id} className="bg-white border-2 rounded-2xl p-6 relative group hover:border-primary transition-all">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-black">{pkg.name}</h4>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingPkg(pkg); setFormData({ name: pkg.name, price: pkg.price, duration_min: pkg.duration_min, inclusions_json: pkg.inclusions_json || [] }); setIsFormOpen(true); }}>
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={async () => { if(confirm('Delete?')) { await deleteMutation.mutateAsync(pkg.id); refetch(); } }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-black text-primary">₹{pkg.price}</div>
                <div className="text-sm font-medium text-muted-foreground flex items-center">
                  <Box className="w-4 h-4 mr-2" /> {pkg.duration_min} Minutes
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground italic border-2 border-dashed rounded-2xl">
          {selectedSvc ? 'No packages found for this service.' : 'Please select a service above.'}
        </div>
      )}
    </div>
  );
}

// Helper hook for package manager to use existing useService hook
import { useQuery as useTanstackQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/axios';
function useServiceAdminPackages(id: string) {
  return useTanstackQuery({
    queryKey: ['service-admin', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await apiClient.get(`/services/${id}`);
      return res.data;
    },
    enabled: !!id
  });
}
