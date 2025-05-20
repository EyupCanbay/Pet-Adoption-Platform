"use client"
import React, { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { fetchUsersReports } from '@/src/services/Admin'
import { Button } from "@material-tailwind/react"
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'
import Loading from '../Loading'

const ITEMS_PER_PAGE = 5

function AdminReports() {
  const [reports, setReports] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState('desc') // 'asc' veya 'desc'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetchUsersReports()
        setReports(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching reports:', error)
      }
    }

    fetchReports()
  }, [])

  // Sort edilmiş raporlar (createdAt'a göre)
  const sortedReports = useMemo(() => {
    return [...reports].sort((a, b) => {
      const dateA = new Date(a.createdAt)
      const dateB = new Date(b.createdAt)
      if (sortOrder === 'asc') {
        return dateA - dateB
      } else {
        return dateB - dateA
      }
    })
  }, [reports, sortOrder])

  const totalPages = Math.ceil(sortedReports.length / ITEMS_PER_PAGE)

  const paginatedReports = sortedReports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    setCurrentPage(1) // sıralama değişince sayfayı 1 yap
  }

  return loading ? (
    <Loading />
  ) : (
    <div className="p-6 max-w-5xl mx-auto text-white">
      <h1 className="text-3xl font-extrabold mb-4 border-b border-gray-700 pb-2">
        Kullanıcı Raporları
      </h1>

      <div className="mb-6 flex justify-end items-center gap-3">
        <Button
          color="lightBlue"
          variant="gradient"
          size="lg"
          className="rounded-lg flex items-center gap-2"
          onClick={toggleSortOrder}
        >
          {sortOrder === 'asc' ? 'En Yeniden En Eskiye' : 'En Eskiden En Yeniye'}
          {sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />}
        </Button>

      </div>

      {
        reports.length === 0 && (
          <p className="text-center text-gray-400 text-lg mt-20">
            Henüz rapor bulunmamaktadır.
          </p>
        )
      }

      <div className="space-y-6">
        {paginatedReports.map((report) => (
          <div
            key={report._id}
            className="bg-inherit border border-gray-600 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm text-gray-400">
                {new Date(report.createdAt).toLocaleString("tr-TR")}
              </p>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${report.status
                  ? 'bg-green-600 text-green-100'
                  : 'bg-yellow-500 text-yellow-900'
                  }`}
              >
                {report.status ? "Çözüldü" : "Beklemede"}
              </span>
            </div>

            <h2 className="text-xl font-semibold text-white mb-2">
              Rapor Nedeni
            </h2>
            <p className="text-gray-300 mb-4 leading-relaxed">{report.reason}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
              <div>
                <h3 className="font-semibold text-white mb-1">Raporlanan Kullanıcı</h3>
                <Link href={`/profile/${report.reportedUser._id}`} className="hover:underline text-blue-400">
                  {report.reportedUser.name} {report.reportedUser.surname} <br />
                  <span className="text-sm text-gray-400">@{report.reportedUser.userName}</span>
                </Link>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-1">Raporlayan</h3>
                <Link href={`/profile/${report.reporter._id}`} className="hover:underline text-blue-400">
                  {report.reporter.name} {report.reporter.surname} <br />
                  <span className="text-sm text-gray-400">@{report.reporter.userName}</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {
        reports.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
            >
              Önceki
            </button>

            <span>
              Sayfa {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
            >
              Sonraki
            </button>
          </div>
        )
      }
    </div>
  )
}

export default AdminReports
