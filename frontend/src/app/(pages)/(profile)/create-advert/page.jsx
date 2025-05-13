"use client"
import React, { useState } from 'react'
import LostListing from '@/src/components/create-advert/lost-listing'
import Listing from '@/src/components/create-advert/listing'
import { Button } from '@material-tailwind/react'

function CreateAdverts() {
    const [activeTab, setActiveTab] = useState('listing')

    const tabs = [
        { id: 'listing', label: 'Sahiplendirme İlanı' },
        { id: 'lost-listing', label: 'Kayıp İlanı' },
    ]

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Tab buttons */}
            <div className="flex justify-center gap-4 mb-6">
                {tabs.map(tab => (
                    <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? 'filled' : 'outlined'}
                        color="blue"
                        onClick={() => setActiveTab(tab.id)}
                        className={`transition duration-300 ${activeTab === tab.id ? 'bg-orange-500 text-white' : 'text-orange-500 border-orange-500'}`}
                    >
                        {tab.label}
                    </Button>
                ))}
            </div>

            <div className="bg-white p-6">
                {activeTab === 'listing' && <Listing />}
                {activeTab === 'lost-listing' && <LostListing />}
            </div>
        </div>
    )
}

export default CreateAdverts
