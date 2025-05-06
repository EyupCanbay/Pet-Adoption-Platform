import './globals.css';
import { Inter } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UserProvider from '../context/userProvider';
import { cookies } from 'next/headers';
import { fetchCurrentUser } from '../services/User';

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
            <body className="flex flex-col h-screen">
                <UserProvider user={user}>
                    <div className="top-0">
                        <Header />
                    </div>
                    <main className="flex-1">{children}</main>
                    <div className="bottom-0 border-t border-gray-200">
                        <Footer />
                    </div>
                </UserProvider>
            </body>
        </html>
    );
}
