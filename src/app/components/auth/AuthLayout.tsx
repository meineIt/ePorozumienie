import AuthSidebar from "./AuthSidebar";

interface AuthLayoutProps {
    children: React.ReactNode;
    shake: boolean;
}

export default function AuthLayout({ children, shake }: AuthLayoutProps ) {
    return (
        <main className="login-page">
        <div className={`login-container fade-in ${shake ? 'shake' : ''}`}>
          <AuthSidebar />
          <div className="login-form-container fade-in-delay-1">
            {children}
          </div>
        </div>
      </main>
    );
}