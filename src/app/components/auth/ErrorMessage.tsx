interface ErrorMessageProps {
    message: string;
}

// destrukturyzacja przez {}
export default function ErrorMessage({ message }: ErrorMessageProps) {
    if (!message) return null;

    return (
        <div className="error-message bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-2xl mb-6 font-medium">
            {message}
        </div>
    );
}