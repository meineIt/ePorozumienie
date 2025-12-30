interface SuccessMessageProps {
    message: string;
    onClose?: () => void;
}

export default function SuccessMessage({ message, onClose }: SuccessMessageProps) {
    if (!message) return null;

    return (
        <div className="success-message">
            {message}
        </div>
    );
}