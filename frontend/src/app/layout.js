import React from 'react'
import "./globals.css"
import { Inter } from "next/font/google";
import Header from '../components/Header';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ["latin"] });

function RootLayout({ children }) {
    return (
        <html lang='tr' className={`${inter.className}`}>
            <head>
                <title>Pet Adoption Platform</title>
                <meta name="description" content="My App" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" sizes="32x32" type="image/png" />
            </head>
            <body className='flex flex-col h-screen'>
                <div className='top-0'>
                    <Header />
                </div>
                <main className='flex-1'>
                    {children}
                </main>
                <div className='bottom-0 border-t border-gray-200'>
                    <Footer />
                </div>
            </body>
        </html>
    )
}

export default RootLayout