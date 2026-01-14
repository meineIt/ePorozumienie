interface SuccessMessageProps {
    message: string;
    onClose?: () => void;
}

export default function SuccessMessage({ message, onClose }: SuccessMessageProps) {
    if (!message) return null;

    return (
        <div className="success-message bg-green-50 border-2 border-green-200 text-green-700 px-5 py-4 rounded-2xl mb-6 font-medium">
            {message}
        </div>
    );
}