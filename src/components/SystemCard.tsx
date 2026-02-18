import { LucideIcon } from "lucide-react";

interface SystemCardProps {
  icon: LucideIcon;
  name: string;
  description: string;
  url: string;
  /** Classe do fundo do círculo do ícone (ex: bg-blue-100) */
  color: string;
  /** Classe da cor do ícone para contraste (ex: text-blue-800). Default: text-slate-700 */
  iconColor?: string;
}

const SystemCard = ({ icon: Icon, name, description, url, color, iconColor = "text-slate-700" }: SystemCardProps) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full"
    >
      <div
        className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${color}`}
      >
        <Icon className={`w-8 h-8 ${iconColor}`} strokeWidth={1.75} />
      </div>
      <h3 className="text-sm font-medium text-slate-700 text-center tracking-wide group-hover:text-[#023164] transition-colors font-sans mb-1">
        {name}
      </h3>
      <p className="text-[11px] text-slate-500 text-center leading-tight">
        {description}
      </p>
    </a>
  );
};

export default SystemCard;
