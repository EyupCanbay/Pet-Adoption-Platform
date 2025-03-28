export default function Loading() {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="h-4 w-4 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="h-4 w-4 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
        </div>
    );
}
