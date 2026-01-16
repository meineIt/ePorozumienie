import { SubmitButtonProps } from '@/lib/types';

export default function SubmitButton({
    loading,
    loadingText,
    text,
}: SubmitButtonProps) {
    return (
        <div className="form-actions mt-6">
        <button
          type="submit"
          className="w-full px-6 py-4 bg-[#0A2463] hover:bg-[#051740] text-white font-bold rounded-3xl text-lg shadow-lg shadow-[#0A2463]/40 hover:shadow-xl hover:shadow-[#0A2463]/50 transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          disabled={loading}
        >
          {loading && <span className="spinner"></span>}
          <span>{loading ? loadingText : text}</span>
        </button>
      </div>
    );
}