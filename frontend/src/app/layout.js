// app/layout.js (Server Component)
import './globals.css';
import { Inter } from 'next/font/google';
import UserProvider from '../context/userProvider';
import { fetchCurrentUser } from '../services/User';
import LayoutWrapper from '../components/LayoutWrapper';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import Loading from '../components/Loading';
import ThemeProviderWrapper from '../components/ThemeProviderWrapper';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({ children }) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || null;
    let user = null;
    if (token) {
        const fetchedUser = await fetchCurrentUser(token);
        if (fetchedUser) {
            try {
                user = JSON.parse(JSON.stringify(fetchedUser));
            } catch (e) {
                console.error("User objesi serileştirilemedi: ", e);
                user = null;
            }
        }
    }

    return (
        <html lang="tr" className={inter.className}>
            <head>
                <title>Pet Adoption Platform</title>
                <meta name="description" content="Hayvan sahiplenme platformu" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" sizes="32x32" type="image/png" />
            </head>
            <body className="flex flex-col h-screen">
                <Suspense fallback={<Loading />}>
                    <ThemeProviderWrapper>
                        <UserProvider user={user}>
                            <LayoutWrapper>
                                {children}
                            </LayoutWrapper>
                        </UserProvider>
                    </ThemeProviderWrapper>
                </Suspense>
            </body>
        </html>
    );
}
