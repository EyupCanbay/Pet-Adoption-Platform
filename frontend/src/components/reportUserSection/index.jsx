import React, { useState } from 'react'
import ReportModal from './modal'
import { reportUser } from '@/src/services/User'

function ReportUser({ currentUser, report, id }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionType, setActionType] = useState('');
    const [reason, setReason] = useState('');

    const formData = {
        reporter: currentUser._id,
        reportedUser: report._id,
        reportedPetListing_id: id,
        reportedLostPetListing_id: id,
        reason: reason,
        status: false
    }

    const openModal = (action) => {
        setActionType(action);
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setActionType('');
    }


    const handleConfirm = async () => {
        try {
            const result = await reportUser(report._id, formData);
            closeModal();
        } catch (error) {
            console.log('Error performing action');
        }
    }


    return (
        <div>
            <div>
                <button
                    className="flex items-center gap-2 text-xs text-center cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow transition"
                    onClick={() => openModal('Bildir')}
                >
                    <span>İlanı Bildir</span>
                </button>
            </div>
            <ReportModal
                isOpen={isModalOpen}
                onClose={closeModal}
                actionType={actionType}
                onConfirm={handleConfirm}
                onReasonChange={setReason} 
            />


        </div>

    )
}

export default ReportUser