import React, { useState } from 'react'
import ReportModal from './modal'
import { reportUser } from '@/src/services/User'
import { Button } from '@material-tailwind/react';

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
                <Button
                    onClick={() => openModal('report')}
                    className="flex items-center gap-2 cursor-pointer hover:bg-red-100"
                    variant="outlined"
                    color="red"
                    size="sm"
                    fullWidth
                >
                    İlanı Bildir
                </Button>
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