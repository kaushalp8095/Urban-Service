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

// --- BOOKING HOOKS ---
export const useCreateBooking = () => {
  return useMutation({
    mutationFn: async (data: {
      serviceId: string;
      packageId: string;
      scheduledAt: string;
      address: { line1: string; city: string; state: string; pinCode: string };
    }) => {
      const payload = {
        package_id: data.packageId,
        slot_datetime: data.scheduledAt,
        address: data.address
      };
      const res = await authApiClient.post('/bookings', payload);
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
