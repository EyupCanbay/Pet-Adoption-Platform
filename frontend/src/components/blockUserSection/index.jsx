import React, { useState } from 'react';
import Modal from './Modal';
import { Ban, ShieldCheck } from 'lucide-react';
import { blockUser, unblockUser } from '@/src/services/User';

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
                console.log("reuslt", result);
                if (result.success) {
                    setIsBlocked(true);
                }
            } else if (actionType === 'engeli kaldır') {
                const result = await unblockUser(block._id);
                console.log("reuslt", result);
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
                    <button
                        className="flex items-center gap-2 text-xs text-center cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow transition"
                        onClick={() => openModal('engelle')}
                    >
                        <Ban size={18} /> Engelle
                    </button>
                ) : (
                    <button
                        className="flex items-center gap-2 text-xs text-center  cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow transition"
                        onClick={() => openModal('engeli Kaldır')}
                    >
                        <ShieldCheck size={18} /> Engeli Kaldır
                    </button>
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
