'use client';

import { useCallback } from 'react';
import { useAuthStore, UserRole } from '@/lib/auth-store';
import { toast } from 'sonner';
import { isValidEmail } from '@/lib/utils';
import { DEFAULT_REGISTRATION_FORM } from '@/types';
import type { RegistrationFormData } from '@/types';

interface UseAuthHandlersReturn {
  // Login
  handleLogin: (e: React.FormEvent, email: string, password: string, loginRole: UserRole) => Promise<boolean>;
  
  // Register
  handleRegister: (e: React.FormEvent, registerForm: RegistrationFormData, registerRole: UserRole) => Promise<boolean>;
  
  // Logout
  handleLogout: () => void;
  
  // Loading state
  isLoading: boolean;
}

export function useAuthHandlers(
  onSuccessLogin: () => void,
  onSuccessRegister: () => void,
  resetModals: () => void,
  setRegisterForm: (form: RegistrationFormData) => void,
): UseAuthHandlersReturn {
  const { login, logout, isLoading } = useAuthStore();

  const handleLogin = useCallback(async (
    e: React.FormEvent,
    email: string,
    password: string,
    loginRole: UserRole
  ) => {
    e.preventDefault();
    const success = await login(email, password, loginRole);
    if (success) {
      toast.success('Login berhasil!');
      onSuccessLogin();
      return true;
    } else {
      toast.error('Login gagal. Periksa email dan password Anda.');
      return false;
    }
  }, [login, onSuccessLogin]);

  const handleRegister = useCallback(async (
    e: React.FormEvent,
    registerForm: RegistrationFormData,
    registerRole: UserRole
  ) => {
    e.preventDefault();
    
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return false;
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('Password dan konfirmasi password tidak sama');
      return false;
    }
    
    if (registerForm.password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return false;
    }
    
    if (!isValidEmail(registerForm.email)) {
      toast.error('Format email tidak valid');
      return false;
    }
    
    if (registerRole === 'CONTRACTOR' && !registerForm.companyName) {
      toast.error('Nama perusahaan wajib diisi untuk kontraktor');
      return false;
    }
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerForm.email,
          password: registerForm.password,
          name: registerForm.name,
          phone: registerForm.phone || null,
          role: registerRole,
          companyName: registerForm.companyName || null,
          companyType: registerForm.companyType || null,
          npwp: registerForm.npwp || null,
          nib: registerForm.nib || null,
          address: registerForm.address || null,
          city: registerForm.city || null,
          province: registerForm.province || null,
          postalCode: registerForm.postalCode || null,
          specialization: registerForm.specialization || null,
          experienceYears: registerForm.experienceYears || null,
          employeeCount: registerForm.employeeCount || null,
          description: registerForm.description || null,
          ownerCompanyName: registerForm.ownerCompanyName || null,
          ownerCompanyType: registerForm.ownerCompanyType || null,
          ownerNpwp: registerForm.ownerNpwp || null,
          ownerAddress: registerForm.ownerAddress || null,
          ownerCity: registerForm.ownerCity || null,
          ownerProvince: registerForm.ownerProvince || null,
          ownerPostalCode: registerForm.ownerPostalCode || null,
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success('Registrasi berhasil! Silakan login dengan akun Anda.');
        setRegisterForm(DEFAULT_REGISTRATION_FORM);
        onSuccessRegister();
        return true;
      } else {
        toast.error(data.message || 'Gagal melakukan registrasi');
        return false;
      }
    } catch {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
      return false;
    }
  }, [setRegisterForm, onSuccessRegister]);

  const handleLogout = useCallback(() => {
    logout();
    resetModals();
    toast.success('Logout berhasil');
  }, [logout, resetModals]);

  return {
    handleLogin,
    handleRegister,
    handleLogout,
    isLoading,
  };
}
