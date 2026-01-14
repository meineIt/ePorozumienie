import Link from 'next/link';

interface AuthFooterProps {
    question: string;
    linkText: string;
    linkHref: string;
}

export default function AuthFooter( {question, linkText, linkHref }: AuthFooterProps) {
    return (
        <div className="login-footer text-center mt-8">
          <p className="text-gray-600 text-base">
            {question}{' '}
            <Link href={linkHref} className="font-bold text-blue-700 hover:text-blue-800 transition-colors duration-200">
              {linkText}
            </Link>
          </p>
        </div>
      );
}