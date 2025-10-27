import { EyeIcon, EyeOffIcon } from "lucide-react";

interface PasswordToggleProps {
  isVisible: boolean;
  onToggle: () => void;
}

export function PasswordToggle({ isVisible, onToggle }: PasswordToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center"
      aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
    >
      {isVisible ? (
        <EyeIcon size={20} className="text-slate-600 cursor-pointer" />
      ) : (
        <EyeOffIcon size={20} className="text-slate-600 cursor-pointer" />
      )}
    </button>
  );
}