interface AuthFormHeaderProps {
    title: string;
    description: string;
}

export default function AuthFormHeader( {title, description}: AuthFormHeaderProps) {
    return (
        <div className="login-form-header">
            <h1>{title}</h1>
            <p>{description}</p>
        </div>
    );
}