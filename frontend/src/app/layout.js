import './globals.css';
import { Inter } from 'next/font/google';
import UserProvider from '../context/userProvider';
import { fetchCurrentUser } from '../services/User';
import LayoutWrapper from '../components/LayoutWrapper';
import { cookies } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({ children }) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || null;
    const user = token ? await fetchCurrentUser(token) : null;

    return (
        <html lang="tr" className={inter.className}>
            <head>
                <title>Pet Adoption Platform</title>
                <meta name="description" content="Hayvan sahiplenme platformu" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" sizes="32x32" type="image/png" />
            </head>
            <body className="flex flex-col min-h-screen">
                <UserProvider user={user}>
                    <LayoutWrapper>
                        {children}
                    </LayoutWrapper>
                </UserProvider>
            </body>
        </html>
    );
}
