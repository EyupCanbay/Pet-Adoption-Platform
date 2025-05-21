"use client"
import { deleteListing } from '@/src/services/Listings'
import { deleteLostListing, fetchSingleLostListing } from '@/src/services/LostListings'
import { Button } from '@material-tailwind/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import slugify from 'slugify'
import Loading from '../../Loading'
import { toast } from 'react-toastify'
function Pet({ pet, isLost, onDelete }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [singlePet, setSinglePet] = useState(null)
    const [loading, setLoading] = useState(true)
    const [imageError, setImageError] = useState(false)

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)
    useEffect(() => {
        if (isLost) {
            const getSingleLostList = async () => {
                try {
                    const response = await fetchSingleLostListing(pet._id)
                    setSinglePet(response?.data[0] || response?.data || null)
                    setLoading(false)
                } catch (error) {
                    console.error('Lost listing fetch error:', error)
                }
            }
            getSingleLostList()
        } else {
            setSinglePet(pet)
        }
    }, [isLost, pet])

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            if (isLost) {
                await deleteLostListing(pet._id)
            } else {
                await deleteListing(pet._id)
            }
            toast.success('İlan başarıyla silindi.')
            onDelete(pet._id)
        } catch (error) {
            console.error('İlan silinirken hata oluştu:', error)
            toast.error('İlan silinirken bir hata oluştu.')
        } finally {
            setIsDeleting(false)
            closeModal()
        }
    }

    return (
        <>
            {loading && !singlePet ? (
                <div className="flex justify-center items-center h-screen">
                    <Loading />
                </div>
            ) : (
                <>
                    <div className="border border-gray-700 bg-zinc-800 rounded-xl p-4 shadow-md text-white mb-4">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <Link
                                href={{
                                    pathname: `/advert/${singlePet._id}`,
                                    query: { pet: slugify(singlePet.petName).toLowerCase() },
                                }}
                            >
                                <img
                                    src={imageError || !singlePet?.images[0] ? '/anonim.png' : singlePet?.images[0]}
                                    alt={singlePet.petName}
                                    className="w-24 h-24 object-cover rounded-lg cursor-pointer"
                                    onError={() => setImageError(true)}
                                />
                            </Link>

                            <div className="flex-1 space-y-2">
                                <h2 className="text-xl font-bold">{singlePet.petName}</h2>

                                <p className="text-sm text-gray-300">
                                    <strong>Kategori:</strong> {singlePet.category_name} / {singlePet.sub_category_name}
                                </p>

                                <p className="text-sm text-gray-300">
                                    <strong>Cinsiyet:</strong> {singlePet.gender ? 'Erkek' : 'Dişi'}
                                </p>

                                <p className="text-sm text-gray-300">
                                    <strong>Durum:</strong> {singlePet.status ? 'Sahiplendi' : 'Bekliyor'}
                                </p>

                                <p className="text-sm text-gray-300">
                                    <strong>Yaş:</strong> {singlePet.age} yaşında
                                </p>

                                <p className="text-sm text-gray-400 italic">{singlePet.description}</p>

                                <div className='flex items-center gap-2'>
                                    <span>İlan Sahibi:</span>
                                    <Link href={`/profile/${singlePet?.user?._id}`}>
                                        <span className="text-gray-400 hover:text-gray-100">@{singlePet?.user?.userName}</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Delete butonu */}
                            <div>
                                <Button
                                    color="red"
                                    size="md"
                                    variant="outlined"
                                    onClick={openModal}
                                    className='cursor-pointer hover:bg-red-500 hover:text-white'
                                >
                                    İlanı Sil
                                </Button>
                            </div>
                        </div>
                    </div>

                    {isModalOpen && (
                        <div className="fixed inset-0 backdrop-blur bg-black/50 flex items-center justify-center z-50">
                            <div className="bg-zinc-900 rounded-lg p-6 w-80 text-white shadow-lg">
                                <h3 className="text-lg font-semibold mb-4">İlanı silmek istediğinize emin misiniz?</h3>
                                <div className="flex justify-end gap-4">
                                    <Button color="red" variant="outlined" className='cursor-pointer hover:bg-red-500 hover:text-white' onClick={closeModal} disabled={isDeleting}>
                                        Hayır
                                    </Button>
                                    <Button color="green" variant="outlined" className='cursor-pointer hover:bg-green-500 hover:text-white' onClick={handleDelete} disabled={isDeleting}>
                                        {isDeleting ? 'Siliniyor...' : 'Evet'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>

    )
}

export default Pet
