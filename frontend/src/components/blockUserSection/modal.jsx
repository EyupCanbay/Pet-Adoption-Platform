import React from 'react';

const Modal = ({ isOpen, onClose, onConfirm, actionType }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm bg-black/30 z-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 z-50">
                <h2 className="text-xl mb-4 font-semibold text-center">
                    {
                        actionType === 'engelle'
                            ? 'Bu kullanıcıyı engellemek istediğinize emin misiniz?'
                            : 'Bu kullanıcının engelini kaldırmak istediğinize emin misiniz?'
                    }
                </h2>
                <div className="flex justify-end">
                    <button
                        className="bg-gray-400 text-white px-4 py-2 cursor-pointer rounded mr-2"
                        onClick={onClose}
                    >
                        İptal Et
                    </button>
                    <button
                        className="bg-red-600 text-white px-4 py-2 cursor-pointer rounded"
                        onClick={onConfirm}
                    >
                        Evet, {actionType}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
