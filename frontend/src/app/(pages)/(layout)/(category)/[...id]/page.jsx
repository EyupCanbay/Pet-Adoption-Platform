"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import slugify from "slugify";
import Advert from "@/src/components/Advert";
import Loading from "@/src/components/Loading";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import { getAllListings } from "@/src/services/Listings";

function CategoryPage() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("name") || "";

  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allListings, setAllListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await getAllListings();
        if (response.success) {
          setAllListings(response.data || []);
        } else {
          console.error("Error fetching listings:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };
    fetchListings();
  }, []);

  useEffect(() => {
    if (!categorySlug) return;

    const filtered = allListings.filter((pet) => {
      const categorySlugified = slugify(pet.category_name || "", { lower: true });
      const subCategorySlugified = slugify(pet.sub_category_name || "", { lower: true });

      return (
        categorySlugified === categorySlug ||
        subCategorySlugified === categorySlug
      );
    });

    setFilteredListings(filtered);
    setLoading(false);
  }, [categorySlug, allListings]);

  const advertsPerPage = 12;
  const totalPages = Math.ceil(filteredListings.length / advertsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const paginate = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const startIndex = (currentPage - 1) * advertsPerPage;
  const displayedAdverts = filteredListings.slice(
    startIndex,
    startIndex + advertsPerPage
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-4 mx-auto max-w-7xl">
      <h1 className="text-2xl font-bold my-4 text-start border-b-2 border-gray-200 text-gray-600">
        {categorySlug
          ? categorySlug.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())
          : "Tüm İlanlar"}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedAdverts.length > 0 ? (
          displayedAdverts.map((pet) => (
            <Advert key={pet?._id} pet={pet} userId={pet?.user_id} />
          ))
        ) : (
          <div className="col-span-full flex flex-col justify-center items-center py-12 text-center">
            <div className="text-4xl mb-4 text-gray-400">🐾</div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-600">
              Bu kategoriye ait ilan bulunamadı
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Yakında yeni ilanlar eklenebilir, takipte kalın!
            </p>
          </div>
        )}
      </div>

      {displayedAdverts.length > 0 && (
        <div className="flex justify-center gap-4 items-center mt-6">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center p-3 rounded-full ${currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-800"
              }`}
          >
            <FaArrowLeft />
          </button>

          <div className="text-lg font-medium text-gray-600">
            Sayfa {currentPage} / {totalPages}
          </div>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center p-3 rounded-full ${currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-800"
              }`}
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
}

export default CategoryPage;
