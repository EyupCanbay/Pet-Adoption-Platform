import React, { useState } from 'react';
import Modal from './Modal';
import { Ban, ShieldCheck } from 'lucide-react';
import { blockUser, unblockUser } from '@/src/services/User';
import { Button } from '@material-tailwind/react';

function BlockUser({ currentUser, block }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionType, setActionType] = useState('');
    const [isBlocked, setIsBlocked] = useState(currentUser.blockedUser.includes(block._id));
    // console.log(currentUser);
    const openModal = (action) => {
        setActionType(action);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setActionType('');
    };

    const handleConfirm = async () => {
        try {
            if (actionType === 'engelle') {
                const result = await blockUser(block._id);
                if (result.success) {
                    setIsBlocked(true);
                }
            } else if (actionType === 'engeli Kaldır') {
                const result = await unblockUser(block._id);
                if (result.success) {
                    setIsBlocked(false);
                }
            }
            closeModal();
        } catch (error) {
            console.log('Error performing action');
        }
    };

    return (
        <div>
            <div className="flex justify-end items-center">
                {!isBlocked ? (
                    <Button
                        onClick={() => openModal('engelle')}
                        className="flex items-center gap-1 text-xs text-center cursor-pointer hover:bg-red-100 px-4 py-2  shadow transition"
                        variant="outlined"
                        color="red"
                        size="sm"
                        fullWidth
                    >
                        <Ban size={18} className="mr-2" />
                        Engelle
                    </Button>
                ) : (
                    <Button
                        onClick={() => openModal('engeli Kaldır')}
                        className="flex items-center gap-1 text-xs text-center cursor-pointer hover:bg-green-100 px-4 py-2  shadow transition"
                        variant="outlined"
                        color="green"
                        size="sm"
                        fullWidth
                    >
                        <ShieldCheck size={18} className="mr-2" />
                        Engeli Kaldır
                    </Button>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={handleConfirm}
                actionType={actionType}
            />
        </div>
    );
}

export default BlockUser;
