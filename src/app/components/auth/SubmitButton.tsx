interface SubmitButtonProps {
    loading: boolean;
    loadingText: string;
    text: string;
}

export default function SubmitButton({
    loading,
    loadingText,
    text,
}: SubmitButtonProps) {
    return (
        <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary login-btn"
          disabled={loading}
        >
          {loading && <span className="spinner"></span>}
          <span>{loading ? loadingText : text}</span>
        </button>
      </div>
    );
}