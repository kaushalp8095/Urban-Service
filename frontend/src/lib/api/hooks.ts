import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient, authApiClient } from './axios';

// --- AUTH HOOKS ---
export const useSendOtp = () => {
  return useMutation({
    mutationFn: async (data: { phone: string; role: 'CUSTOMER' | 'PARTNER' }) => {
      const res = await apiClient.post('/auth/send-otp', data);
      return res.data;
    },
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async (data: { phone: string; otp: string; role: 'CUSTOMER' | 'PARTNER'; name?: string }) => {
      const res = await apiClient.post('/auth/verify-otp', data);
      return res.data;
    },
  });
};

// --- USER HOOKS ---
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await authApiClient.get('/user/profile');
      return res.data;
    },
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (data: { name?: string; email?: string; city?: string; address_json?: any }) => {
      const res = await authApiClient.put('/user/profile', data);
      return res.data;
    },
  });
};

// --- ADMIN HOOKS ---
export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await authApiClient.get('/admin/stats');
      return res.data;
    },
  });
};

export const useAdminBookings = () => {
  return useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const res = await authApiClient.get('/admin/bookings');
      return res.data;
    },
  });
};

// Admin CRUD Mutations
export const useCreateCategory = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await authApiClient.post('/admin/categories', data);
      return res.data;
    }
  });
};

export const useUpdateCategory = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await authApiClient.patch(`/admin/categories/${id}`, data);
      return res.data;
    }
  });
};

export const useDeleteCategory = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await authApiClient.delete(`/admin/categories/${id}`);
      return res.data;
    }
  });
};

export const useCreateServiceAdmin = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await authApiClient.post('/admin/services', data);
      return res.data;
    }
  });
};

export const useUpdateServiceAdmin = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await authApiClient.patch(`/admin/services/${id}`, data);
      return res.data;
    }
  });
};

export const useDeleteServiceAdmin = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await authApiClient.delete(`/admin/services/${id}`);
      return res.data;
    }
  });
};

export const useCreatePackage = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await authApiClient.post('/admin/packages', data);
      return res.data;
    }
  });
};

export const useUpdatePackage = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await authApiClient.patch(`/admin/packages/${id}`, data);
      return res.data;
    }
  });
};

export const useDeletePackage = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await authApiClient.delete(`/admin/packages/${id}`);
      return res.data;
    }
  });
};

// --- PARTNER HOOKS ---
export const usePartnerRegister = () => {
  return useMutation({
    mutationFn: async (data: { category_ids: string[] }) => {
      const res = await authApiClient.post('/partner/register', data);
      return res.data;
    },
  });
};

export const usePartnerStats = () => {
  return useQuery({
    queryKey: ['partner-stats'],
    queryFn: async () => {
      const res = await authApiClient.get('/partner/stats');
      return res.data;
    },
  });
};

export const usePartnerBookings = () => {
  return useQuery({
    queryKey: ['partner-bookings'],
    queryFn: async () => {
      const res = await authApiClient.get('/partner/bookings');
      return res.data;
    },
  });
};

// --- SERVICES HOOKS ---
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiClient.get('/services/categories');
      return res.data;
    },
  });
};

export const useServicesByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ['services', categoryId],
    queryFn: async () => {
      const res = await apiClient.get(`/services/category/${categoryId}`);
      return res.data;
    },
    enabled: !!categoryId,
  });
};

export const useSearch = (query: string, city?: string) => {
  return useQuery({
    queryKey: ['search', query, city],
    queryFn: async () => {
      const params = new URLSearchParams({ q: query });
      if (city) params.set('city', city);
      const res = await apiClient.get(`/services/search?${params.toString()}`);
      return res.data;
    },
    enabled: query.trim().length >= 2,
    staleTime: 30_000,
  });
};

export const useService = (id: string) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const res = await apiClient.get(`/services/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

export const usePopularServices = (city?: string) => {
  return useQuery({
    queryKey: ['popular-services', city],
    queryFn: async () => {
      const url = city ? `/services/popular?city=${city}` : '/services/popular';
      const res = await apiClient.get(url);
      return res.data;
    },
  });
};

// --- BOOKING HOOKS ---
export const useCreateBooking = () => {
  return useMutation({
    mutationFn: async (data: {
      package_id: string;
      slot_datetime: string;
      address: { line1: string; city: string; state: string; pinCode: string };
    }) => {
      const res = await authApiClient.post('/bookings', data);
      return res.data;
    },
  });
};

export const useMyBookings = () => {
  return useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const res = await authApiClient.get('/bookings');
      return res.data;
    },
  });
};

export const useUpdateBookingStatus = () => {
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await authApiClient.patch(`/bookings/${id}/status`, { status });
      return res.data;
    },
  });
};

export const useAvailableSlots = (packageId: string, date: string) => {
  return useQuery({
    queryKey: ['slots', packageId, date],
    queryFn: async () => {
      const res = await apiClient.get(`/bookings/slots?packageId=${packageId}&date=${date}`);
      return res.data;
    },
    enabled: !!packageId && !!date,
  });
};

export const useCreateReview = () => {
  return useMutation({
    mutationFn: async ({ bookingId, rating, comment }: { bookingId: string; rating: number; comment?: string }) => {
      const res = await authApiClient.post(`/bookings/${bookingId}/review`, { rating, comment });
      return res.data;
    },
  });
};

export const useWallet = () => {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const res = await authApiClient.get('/user/wallet');
      return res.data;
    },
  });
};

export const useAddMoney = () => {
  return useMutation({
    mutationFn: async (amount: number) => {
      const res = await authApiClient.post('/user/wallet/add', { amount });
      return res.data;
    },
  });
};
