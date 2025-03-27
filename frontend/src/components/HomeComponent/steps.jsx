"use client"
import React, { useState } from 'react';

function Steps() {
    const [openStep, setOpenStep] = useState(null); // Track which step is open

    const steps = [
        { title: 'How Does the Pet Adoption Process Work?', description: 'For the pet adoption process, you can contact the ad owners through the listings on our page. You can get answers to any questions you have and complete the adoption process in a practical way.' },
        { title: 'How does the listing process work?', description: 'Those who want to give up their pet of a specific breed by posting an ad should register on our site. You can complete your listing process by logging into our site and entering the required details from the relevant categories section.' },
        { title: 'Is there any fee for pet adoption?', description: 'The platform is a secure adoption method with a significant reputation in pet adoption. This platform brings real animal companions together and offers affordable pricing.' },
        { title: 'What documents are required for adoption?', description: 'To ensure a smooth adoption process, certain documents may be required, such as identification proof, address proof, and sometimes a home inspection. These documents help confirm the adopter’s eligibility and readiness for pet ownership.' },
        { title: 'How do I receive the pet after adoption?', description: 'Once the adoption process is complete, the next step is to arrange for the pet’s delivery. This can be done through a local adoption event, through the pet owner’s arrangements, or via a trusted pet transport service, depending on the situation.' },

    ];

    const toggleStep = (index) => {
        // If the clicked step is already open, close it, otherwise open the new step
        setOpenStep(openStep === index ? null : index);
    };
    return (
        <div className="py-6 border-gray-200 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-center mb-4">How to Adopt a Pet in 6 Steps</h2>

            <div className="space-y-4 md:w-128 w-full">
                {steps.map((step, index) => (
                    <div key={index} className="p-4 rounded-md shadow-sm">
                        <div
                            onClick={() => toggleStep(index)}
                            className="cursor-pointer flex justify-between items-center"
                        >
                            <div className="flex items-center">
                                <span className="mr-2 text-sm lg:text-lg">{index + 1}-</span>
                                <h3 className="lg:text-lg text-sm font-semibold text-gray-800">{step.title}</h3>
                            </div>
                        </div>

                        <div
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${openStep === index ? 'max-h-screen' : 'max-h-0'}`}
                        >
                            <p className="mt-2 text-gray-600 text-sm">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Steps