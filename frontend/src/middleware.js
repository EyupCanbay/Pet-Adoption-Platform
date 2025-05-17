import { NextResponse } from 'next/server';
import { fetchCurrentUser } from './services/User';

export async function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get('token')?.value;

    //! SCOPE MANTIĞI VAR TRY İÇERİSİNDE CONST USER YAPINCA DIŞARDAKİ USER NULL OLUR
    //TODO NEXT ÖZELİNDE RETURN USER YAPILDIĞINDA HATA VERİYOR NEDENİ İSE RESPONSE İÇİNDEKİ USER NULL OLDUĞU İÇİN
    //TODO BUNU ÇÖZMEK İÇİN TRY İÇERİSİNDEKİ USER'IN NULL OLMAMASI GEREKİYOR
    
    let user = null;
    if (token) {
        try {
            user = await fetchCurrentUser(token);
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
    }

    if (pathname.startsWith('/admin')) {
        if (!token || !user?.data?.user?.role?.includes('ADMIN')) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        return NextResponse.next();
    }

    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
        if (token) {
            return NextResponse.redirect(new URL('/', req.url));
        }
        return NextResponse.next();
    }
    return NextResponse.next();
}


export const config = {
    matcher: [
        '/admin/:path*',
        '/admin',
        '/login',
        '/register',
    ],
}