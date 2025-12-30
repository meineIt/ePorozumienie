interface FormHelperProps {
    checkboxLabel: string;
    linkText: string;
    linkHref: string;
    checked: boolean;
    onChange: (checked:boolean) => void;
}

export default function FormHelper({
    checkboxLabel,
    linkText,
    linkHref,
    checked,
    onChange,
}: FormHelperProps) {
    return (
        <div className="form-helper">
        <label className="form-checkbox">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span>{checkboxLabel}</span>
        </label>
        
        <a href={linkHref}>{linkText}</a>
      </div>
    )
}