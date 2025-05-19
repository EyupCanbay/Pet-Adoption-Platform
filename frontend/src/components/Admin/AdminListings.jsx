"use client"
import React, { useEffect, useState } from 'react'
import { getAllListings } from '@/src/services/Listings'
import Pet from './Pet'

function AdminListings() {
  const [listings, setListings] = useState([])
  const [activePage, setActivePage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await getAllListings()
        setListings(response.data)
      } catch (error) {
        console.error('Error fetching listings:', error)
      }
    }
    fetchListings()
  }, [])

  const handleDeletePet = (deletedPetId) => {
    setListings(prevListings => prevListings.filter(listing => listing._id !== deletedPetId))
  }

  const indexOfLastItem = activePage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = listings.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(listings.length / itemsPerPage)

  const handlePageChange = (pageNumber) => setActivePage(pageNumber)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-8">İlanlar</h1>
      <ul>
        {currentItems.map(listing => (
          <Pet key={listing._id} pet={listing} onDelete={handleDeletePet} isLost={false} />
        ))}
      </ul>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-3">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`w-9 h-9 rounded-full text-sm cursor-pointer font-medium transition
              ${activePage === i + 1
                ? 'bg-red-600 text-white shadow-md'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

export default AdminListings
