'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '../Header';
import Footer from '../Footer';
import { useUserStore } from '@/src/store/useUserStore';

function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const user = useUserStore(state => state.user);

    const isAdminPath = pathname.startsWith('/admin');
    const isAdminUser = user?.roles?.includes('ADMIN');
    const isAdmin = isAdminPath || isAdminUser;

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <Header />
            <main className="flex-1">{children}</main>
            <div className="bottom-0 border-t border-gray-200">
                <Footer />
            </div>
        </>
    );
}

export default LayoutWrapper;
