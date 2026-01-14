interface AuthFormHeaderProps {
    title: string;
    description: string;
}

export default function AuthFormHeader( {title, description}: AuthFormHeaderProps) {
    return (
        <div className="login-form-header">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-3">{title}</h1>
            <p className="text-lg text-gray-600 leading-relaxed">{description}</p>
        </div>
    );
}