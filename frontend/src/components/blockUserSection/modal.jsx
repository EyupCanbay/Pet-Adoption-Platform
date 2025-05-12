import { Button } from '@material-tailwind/react';
import React from 'react';

const Modal = ({ isOpen, onClose, onConfirm, actionType }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm bg-black/30 z-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-120 z-50">
                <h2 className="text-xl mb-4 font-semibold text-center">
                    {
                        actionType === 'engelle'
                            ? 'Bu kullanıcıyı engellemek istediğinize emin misiniz?'
                            : 'Bu kullanıcının engelini kaldırmak istediğinize emin misiniz?'
                    }
                </h2>
                <div className="flex justify-end gap-2">
                    <Button
                        size='sm'
                        variant="outlined"
                        className="px-4 py-2 cursor-pointer rounded"
                        onClick={onClose}
                    >
                        İptal Et
                    </Button>
                    <Button
                        size='sm'
                        variant="outlined"
                        color="red"
                        className="px-4 py-2 cursor-pointer rounded"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}>
                        Evet, {actionType}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
