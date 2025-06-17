import { Button } from '@material-tailwind/react';
import React from 'react';

function ReportModal({ isOpen, onClose, onConfirm, actionType, onReasonChange, reason }) {

    const handleReasonChange = (e) => {
        onReasonChange(e.target.value);
    };

    const actionText = actionType === 'report' ? 'bildirmek' : actionType;

    return (
        isOpen && (
            <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm bg-black/30 z-[1000]">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[300px] md:w-[400px] lg:w-[500px] z-[1001]">
                    <h2 className="text-lg mb-4 font-semibold text-center">
                        Neden bu ilanı {actionText} istiyorsunuz?
                    </h2>
                    <textarea
                        className="w-full h-48 p-2 border border-gray-300 rounded mb-4 focus:ring-blue-400 focus:border-blue-400 resize-y"
                        placeholder="Lütfen bir neden belirtin..."
                        onChange={handleReasonChange}
                        value={reason}
                    />
                    <div className="flex justify-end gap-2">
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
                            }}
                            disabled={reason.trim().length === 0} 
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
