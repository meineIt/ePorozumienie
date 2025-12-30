import Link from 'next/link';

interface AuthFooterProps {
    question: string;
    linkText: string;
    linkHref: string;
}

export default function AuthFooter( {question, linkText, linkHref }: AuthFooterProps) {
    return (
        <div className="login-footer">
          <p>{question} <Link href={linkHref}>{linkText}</Link></p>
        </div>
      );
}