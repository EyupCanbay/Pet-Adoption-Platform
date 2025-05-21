import { Button } from '@material-tailwind/react';
import React from 'react'; // No need for useState here anymore, as it's controlled by parent

function ReportModal({ isOpen, onClose, onConfirm, actionType, onReasonChange, reason }) { // Add 'reason' to props

    const handleReasonChange = (e) => {
        onReasonChange(e.target.value); // Just pass the value directly to the parent handler
    };

    const actionText = actionType === 'report' ? 'bildirmek' : actionType; // Customize text based on actionType

    return (
        isOpen && (
            <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm bg-black/30 z-[1000]"> {/* Increased z-index */}
                <div className="bg-white p-6 rounded-lg shadow-lg w-[300px] md:w-[400px] lg:w-[500px] z-[1001]"> {/* Increased z-index and added responsive width */}
                    <h2 className="text-lg mb-4 font-semibold text-center">
                        Neden bu ilanı {actionText} istiyorsunuz? {/* Changed "kullanıcıyı" to "ilanı" */}
                    </h2>
                    <textarea
                        className="w-full h-48 p-2 border border-gray-300 rounded mb-4 focus:ring-blue-400 focus:border-blue-400 resize-y"
                        placeholder="Lütfen bir neden belirtin..." // Türkçe placeholder
                        onChange={handleReasonChange}
                        value={reason} // Controlled component: value comes from prop
                    />
                    <div className="flex justify-end gap-2"> {/* Added gap */}
                        <Button
                            size='sm'
                            variant="outlined"
                            className="text-black px-4 py-2 cursor-pointer rounded"
                            onClick={onClose}
                        >
                            İptal Et
                        </Button>
                        <Button
                            size='sm'
                            variant="outlined"
                            color="red"
                            className="bg-red-500 text-white px-4 py-2 cursor-pointer rounded"
                            onClick={() => {
                                onConfirm();
                                // No need to setReason("") here, parent will handle it on close
                                // onClose(); // Parent's onConfirm should ideally handle closing after async operation
                            }}
                            disabled={reason.trim().length === 0} // Disable if reason is empty or just whitespace
                        >
                            Evet, Bildir
                        </Button>
                    </div>
                </div>
            </div>
        )
    );
}

export default ReportModal;
