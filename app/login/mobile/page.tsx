'use client';

import { Suspense} from 'react';
import LoginForm from '@/app/ui/login-mobile';



export default function MobileLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <Suspense fallback={<div className="text-sm text-slate-500">Memuat halaman...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}