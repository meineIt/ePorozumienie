interface ErrorMessageProps {
    message: string;
}

// destrukturyzacja przez {}
export default function ErrorMessage({ message }: ErrorMessageProps) {
    if (!message) return null;

    return (
        <div className="error-message">
            {message}
        </div>
    );
}