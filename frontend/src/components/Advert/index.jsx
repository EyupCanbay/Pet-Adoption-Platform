import Image from 'next/image'
import React from 'react'

function Advert() {
    return (
        <div className='flex flex-col rounded-md shadow-md'>
            <div className='border-b-2'>
                <div className='relative w-full h-24 md:h-36 lg:h-48'>
                    <Image
                        src={"/indir.webp" || null}
                        alt="advert"
                        fill
                        style={{ objectFit: "cover" }}
                        className='rounded-t-md'
                    />
                </div>
            </div>
            <div className='flex flex-col gap-2 p-2'>
                <div className='flex flex-col md:flex-row md:justify-between items-center p-2 w-full'>
                    <span className='text-sm'>Card Title</span>
                    <div className='flex items-center gap-2 mt-2 md:mt-0'>
                        <div className='relative w-6 h-6'>
                            <Image
                                src={"/default-avatar.jpg" || null}
                                alt="author"
                                fill
                                className='rounded-full object-cover'
                            />
                        </div>
                        <span className='text-sm'>Author Name</span>
                    </div>
                </div>

                <div className='text-xs text-gray-700 p-2'>lorem ipsum lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum </div>
            </div>
        </div>
    )
}

export default Advert