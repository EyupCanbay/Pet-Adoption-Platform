import React, { useState } from 'react';
import { AdminSidebar } from '../components/Admin/AdminSidebar';
import AdminUserPanel from '../components/Admin/AdminUserPanel';
import AdminCategories from '../components/Admin/AdminCategories';
import AdminListings from '../components/Admin/AdminListings';
import AdminLostListings from '../components/Admin/AdminLostListings';
import AdminReports from '../components/Admin/AdminReports';
import AdminSubCategories from '../components/Admin/AdminSubCategories';
import AdminLogs from '../components/Admin/AdminLogs';
function AdminPageContainer() {
    const [activeTab, setActiveTab] = useState('users');

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return <AdminUserPanel />;
            case 'categories':
                return <AdminCategories />;
            case 'subcategories':
                return <AdminSubCategories />;
            case 'listings':
                return <AdminListings />;
            case 'lostlistings':
                return <AdminLostListings />;
            case 'reports':
                return <AdminReports />;
            case 'logs':
                return <AdminLogs />;
            default:
                return <div>Bir içerik seçin</div>;
        }
    };

    return (
        <div className="flex w-full min-h-screen bg-zinc-900 text-white">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1 h-full p-6 overflow-auto">
                {renderContent()}
            </div>
        </div>
    );
}

export default AdminPageContainer;
