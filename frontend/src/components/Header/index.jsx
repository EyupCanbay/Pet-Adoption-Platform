import React from 'react'
import Logo from './Logo'
import SearchBar from './SearchBar'
import ProfileSection from './ProfileSection'

function Header() {
    return (
        <header>
            <div className='px-10 py-6 border-b border-gray-200'>
                <div className='flex justify-between items-center'>
                    <Logo />
                    <SearchBar />
                    <ProfileSection />
                </div>
            </div>
        </header>
    )
}

export default Header