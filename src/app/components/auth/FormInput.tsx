interface FormInputProps {
    id: string;
    name: string;
    type?: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    minLength?: number;
}

export default function FormInput({
    id,
    name,
    type = 'text',
    label,
    placeholder,
    value,
    onChange,
    required = false,
    minLength,
}: FormInputProps) {
    return (
        <div className="form-group">
          <label htmlFor={id} className="form-label">{label}</label>
          <input
            type={type}
            id={id}
            name={name}
            className="form-control"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            minLength={minLength}
          />
        </div>
      );   
}