"use client";
import React, { useEffect, useState } from "react";
import PetListing from "@/mocks/pet_listings";
import { useSearchParams } from "next/navigation";
import slugify from "slugify";
import Advert from "@/src/components/Advert";
import Loading from "@/src/components/Loading";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Link from "next/link";

function CategoryPage() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("name") || "";

  const [filteredListings, setFilteredListings] = useState([]);

  useEffect(() => {
    if (!categorySlug) return;

    const filtered = PetListing?.data?.filter((pet) => {
      const petCategorySlug = slugify(pet.category_name || "", { lower: true });
      const petSubCategorySlug = slugify(pet.sub_category_name || "", { lower: true });

      const matchesCategory =
        petCategorySlug === categorySlug || categorySlug === "";

      const matchesSubCategory =
        petSubCategorySlug === categorySlug || categorySlug === "";

      return matchesCategory || matchesSubCategory;
    });

    setFilteredListings(filtered || []);

  }, [categorySlug]);


  const advertsPerPage = 12;
  const totalPages = Math.ceil(filteredListings.length / advertsPerPage);

  const [currentPage, setCurrentPage] = useState(1);

  const paginate = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const startIndex = (currentPage - 1) * advertsPerPage;
  const displayedAdverts = filteredListings.slice(startIndex, startIndex + advertsPerPage);

  return (
    <div className="p-4 mx-auto max-w-7xl">
      <h1 className="text-2xl font-bold my-4 text-start border-b-2 border-gray-200 text-gray-600">
        {categorySlug
          ? `${categorySlug.replace(/-/g, " ").toUpperCase()}`
          : "All Listings"
        }

      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedAdverts.length > 0 ? (
          displayedAdverts.map((pet) => (
            <Link
              key={pet.user_id}
              href={{
                pathname: `/advert/${slugify(pet.petName).toLowerCase()}`,
                query: { pet: slugify(pet.petName).toLowerCase() },
              }}
            >
              <Advert key={pet.user_id} pet={pet} />
            </Link>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex justify-center items-center">
            <Loading />
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4 items-center mt-6">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center p-3 rounded-full  ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-800 cursor-pointer"
            }`}
        >
          <FaArrowLeft />
        </button>

        <div className="text-lg font-medium text-gray-600">
          Page {currentPage} of {totalPages}
        </div>

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center p-3 rounded-full  ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-800 cursor-pointer"
            }`}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}

export default CategoryPage;
