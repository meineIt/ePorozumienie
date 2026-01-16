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
        <div className="form-helper flex items-center justify-between mt-4">
        <label className="form-checkbox flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="w-5 h-5 rounded-lg border-2 border-gray-300 text-blue-700 focus:ring-2 focus:ring-[#0A2463] focus:ring-offset-2 cursor-pointer"
          />
          <span className="text-gray-700 text-sm">{checkboxLabel}</span>
        </label>
        
        <a href={linkHref} className="text-blue-700 hover:text-blue-800 font-semibold text-sm transition-colors duration-200">
          {linkText}
        </a>
      </div>
    )
}