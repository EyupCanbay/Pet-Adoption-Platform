"use client"
import React, { useState } from 'react'
import LostListing from '@/src/components/create-advert/lost-listing'
import Listing from '@/src/components/create-advert/listing'

function CreateAdverts() {
    const [activeTab, setActiveTab] = useState('listing')

    const handleTabClick = (tab) => {
        setActiveTab(tab)
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'listing':
                return <Listing />
            case 'lost-listing':
                return <LostListing />
            default:
                return null
        }
    }

    return (
        <div>
            <div className="flex gap-4 mb-4">
                <button
                    onClick={() => handleTabClick('listing')}
                    className={`tab ${activeTab === 'listing' ? 'active' : ''} border border-2 p-2`}
                >
                    Listing
                </button>
                <button
                    onClick={() => handleTabClick('lost-listing')}
                    className={`tab ${activeTab === 'lost-listing' ? 'active' : ''} border border-2 p-2`}
                >
                    Lost Listing
                </button>
            </div>
            <div>
                {renderTabContent()}
            </div>
        </div>
    )
}

export default CreateAdverts
