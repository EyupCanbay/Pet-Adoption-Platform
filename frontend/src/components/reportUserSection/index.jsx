
import React, { useState } from 'react';
import { Button } from '@material-tailwind/react';
import ReportModal from './modal';
import { reportUser } from '@/src/services/User';

function ReportUser({ currentUser, reportedItem, petOwner, isLostListing }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionType, setActionType] = useState('');
    const [reason, setReason] = useState('');

    const openModal = (action) => {
        setActionType(action);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setReason('');
        setActionType('');
    };

    const handleConfirm = async () => {
        if (!currentUser?.data?.user?._id || !petOwner?._id || !reportedItem?._id || !reason) {
            console.error('Missing required data for reporting.');
            return;
        }

        const formData = {
            reporter: currentUser?.data?.user?._id,
            reportedUser: petOwner._id,
            reportedPetListing_id: reportedItem._id,
            reportedLostPetListing_id: reportedItem._id,
            reason: reason,
            status: false
        }

        if (isLostListing) {
            formData.reportedLostPetListing_id = reportedItem._id;
            formData.reportedPetListing_id = null; 
        } else {
            formData.reportedPetListing_id = reportedItem._id;
            formData.reportedLostPetListing_id = null; 
        }

        try {
            const result = await reportUser(petOwner._id, formData);
            closeModal();
        } catch (error) {
<<<<<<< HEAD
            console.error('Error reporting advert:', error);
=======
            console.error('Error performing action');
>>>>>>> adf3a062938d2529c5b7378d8b8cc90236169dbc
        }
    };

    if (!currentUser || !reportedItem || !petOwner) {
        return null;
    }

    return (
        <div>
            <Button
                onClick={() => openModal('report')}
                className="flex items-center justify-center gap-2 cursor-pointer hover:bg-red-100"
                variant="outlined"
                color="red"
                size="sm"
                fullWidth
            >
                İlanı Bildir
            </Button>

            <ReportModal
                isOpen={isModalOpen}
                onClose={closeModal}
                actionType={actionType}
                onConfirm={handleConfirm}
                onReasonChange={setReason}
                reason={reason}
            />
        </div>
    );
}

export default ReportUser;
