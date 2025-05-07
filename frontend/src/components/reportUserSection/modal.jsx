import React, { useState } from 'react'

function ReportModal({ isOpen, onClose, onConfirm, actionType, onReasonChange }) {
    const [reason, setReason] = useState("");

    const handleReasonChange = (e) => {
        setReason(e.target.value);
        onReasonChange(e.target.value);
    };

    return (
        isOpen && (
            <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm bg-black/30 z-100">
                <div className="bg-white p-6 rounded-lg shadow-lg w-180 z-50">
                    <h2 className="text-lg mb-4 font-semibold text-center">
                        Neden bu kullanıcıyı {actionType}mek etmek istiyorsunuz?
                    </h2>
                    <textarea
                        className="w-full h-48 p-2 border border-gray-300 rounded mb-4"
                        placeholder="Please provide a reason..."
                        onChange={handleReasonChange}
                        value={reason}
                    />
                    <div className="flex justify-end">
                        <button
                            className="bg-gray-400 text-white px-4 py-2 cursor-pointer rounded mr-2"
                            onClick={() => {
                                onClose();
                                setReason("");
                                onReasonChange(""); // temizle
                            }}
                        >
                            İptal Et
                        </button>
                        <button
                            className="bg-red-600 text-white px-4 py-2 cursor-pointer rounded"
                            onClick={() => {
                                onConfirm();
                                setReason("");
                                onReasonChange(""); // temizle
                            }}
                        >
                            Evet, {actionType}
                        </button>
                    </div>
                </div>
            </div>
        )
    );
}


export default ReportModal