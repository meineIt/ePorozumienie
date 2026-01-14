interface TrustedProfileButtonProps {
    text: string;
}

export default function TrustedProfileButton({ text }: TrustedProfileButtonProps) {
    return (
        <button 
          className="w-full px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-3xl text-base transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 border-2 border-gray-200" 
          disabled
        >
          <span className="trusted-profile-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </span>
          <span>{text}</span>
        </button>
      );
}