import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login', // Halaman login default untuk web/panitia
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnPanitia = nextUrl.pathname.startsWith('/panitia');
      const isOnMobile = nextUrl.pathname.startsWith('/mobile');
      const isOnMobileLogin = nextUrl.pathname === '/login/mobile';

      // 1. Proteksi Rute /panitia
      if (isOnPanitia) {
        if (isLoggedIn) return true;
        return false; // Mengarahkan pengguna yang belum login ke /login
      }

      // 2. Proteksi Rute /mobile
      if (isOnMobile) {
        // Jika belum login dan mencoba mengakses halaman /mobile (selain /login/mobile)
        if (!isLoggedIn && !isOnMobileLogin) {
          return Response.redirect(new URL('/login/mobile', nextUrl));
        }

        // Jika sudah login dan mencoba mengakses halaman /login/mobile lagi
        if (isLoggedIn && isOnMobileLogin) {
          return Response.redirect(new URL('/mobile', nextUrl));
        }

        return true;
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;