import React from 'react'
import Steps from './steps'

function HomeComponent() {
    return (
        <div className='flex flex-col h-full py-4 px-10'>
            <div>home</div>
            <div>home</div>
            <div>home</div>
          

            {/* HOW TO ADOPTING AN ANIMAL IN 6 STEPS*/}
            <div>
                <Steps />
            </div>
        </div>
    )
}

export default HomeComponent