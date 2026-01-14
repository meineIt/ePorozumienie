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
          <label htmlFor={id} className="form-label text-base font-semibold text-gray-900 mb-2 block">{label}</label>
          <input
            type={type}
            id={id}
            name={name}
            className="form-control w-full px-5 py-4 text-base rounded-2xl border-2 border-gray-200 bg-white transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none placeholder:text-gray-400"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            minLength={minLength}
          />
        </div>
      );   
}