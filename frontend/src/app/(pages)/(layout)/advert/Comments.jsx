import React from "react";

function Comments({ comment }) {

    return (
        <div className="mt-4 space-y-4">
            <h2 className="text-lg font-bold">Yorumlar</h2>
            {comment.map((c) => (
                <div key={c?.comments?._id || null} className="p-3 border rounded-md">
                    <p className="font-medium">
                        <span className="text-blue-600">
                            {c.user?.userName || "Bilinmeyen Kullanıcı"}:
                        </span>{" "}
                        {c?.comments?.content}
                    </p>

                    <div className="ml-4 mt-2 space-y-2">
                        {Array.isArray(c?.replies?.data) && c?.replies?.data.length > 0 ? (
                            c.replies.data.map((reply) => (
                                <div key={reply._id} className="border-l-2 pl-2 text-sm text-gray-700">
                                    ↳ {reply.content}
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400">Yanıt yok</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Comments;
