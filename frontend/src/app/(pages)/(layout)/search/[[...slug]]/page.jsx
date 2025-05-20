import React from 'react';
import Link from 'next/link';
import { Frown } from 'lucide-react'; // İkon için
import { Search } from '@/src/services/Search'; // Arama servisi
import slugify from 'slugify';

async function SearchPage({ searchParams }) {
    const params = await searchParams;
    const query = params?.search || null;

    if (!query) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center text-gray-600 px-4">
                <Frown className="w-16 h-16 text-red-400 mb-4" />
                <h1 className="text-2xl font-semibold mb-2">Aranan sonuç bulunamadı</h1>
                <p className="text-base">Lütfen aramak istediğiniz bir kelime girin ve tekrar deneyin.</p>
            </div>
        );
    }

    let results = null;
    try {
        const response = await Search(query);
        results = response.data;
    } catch (error) {
        console.error("Search error:", error);
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center text-gray-600 px-4">
                <h1 className="text-2xl font-semibold mb-2">Arama sırasında hata oluştu.</h1>
                <p>{error.message || String(error)}</p>
            </div>
        );
    }

    if (!results || Object.keys(results).length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center text-gray-600 px-4">
                <h1 className="text-2xl font-semibold mb-2">Sonuç bulunamadı.</h1>
            </div>
        );
    }

    // Model bazlı başlık + link + açıklama gösterimi
    const renderItem = (modelName, item) => {
        let title = '';
        let link = '';
        let description = '';

        switch (modelName) {
            case 'user':
                title = `${item.name} ${item.surname} (@${item.username})`;
                link = { pathname: '/profile/[id]', query: { id: item._id } };
                description = item.bio || '';
                break;
            case 'category':
                title = item.title || item.name;
                link = {
                    pathname: `/${item._id}/${item.name}`,
                    query: { name: item.name },
                };
                break;
            case 'subCategory':
                title = item.title || item.name;
                link = {
                    pathname: `/${item._id}/${item.name}`,
                    query: { name: item.name },
                };
                break;
            case 'petListing':
                title = item.title || item.name;
                link = {
                    pathname: `/advert/${item._id}`,
                    query: { pet: slugify(item.title || item.name || item.breed) },
                };
                description = item.description || '';
                break;
            case 'lostPetListing':
                title = `${item.title || item.name} (Kayıp)`;
                link = {
                    pathname: `/advert/${item._id}`,
                    query: { pet: slugify(item.title || item.name || item.breed) },
                }
                description = item.description || '';
                break;
            default:
                title = item.title || item.name || 'Sonuç';
        }

        return (
            <Link
                href={link}
                className="block p-2 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
            >
                <h3 className="font-semibold text-lg text-blue-600">{title}</h3>
                {description && <p className="text-gray-600 text-sm mt-1">{description}</p>}
            </Link>
        );
    };

    return (
        <div className="p-4 space-y-8">
            {Object.entries(results).map(([modelName, items]) => (
                <section key={modelName}>
                    <h2 className="text-2xl font-semibold mb-4 capitalize">{modelName} Sonuçları</h2>
                    <ul className="space-y-2">
                        {items.map(item => (
                            <li key={item._id}>{renderItem(modelName, item)}</li>
                        ))}
                    </ul>
                </section>
            ))}
        </div>
    );
}

export default SearchPage;
