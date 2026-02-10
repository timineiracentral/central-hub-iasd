import { LucideIcon } from "lucide-react";

interface SystemCardProps {
  icon?: LucideIcon;
  imageSrc?: string;
  name: string;
  description: string;
  url: string;
  color: string;
}

const SystemCard = ({ icon: Icon, imageSrc, name, description, url, color }: SystemCardProps) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full"
    >
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 overflow-hidden ${color}`}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={name}
            className="w-full h-full object-cover rounded-full"
          />
        ) : Icon ? (
          <Icon className="w-8 h-8 text-slate-700" strokeWidth={1.5} />
        ) : null}
      </div>
      <h3 className="text-sm font-medium text-slate-600 text-center tracking-wide group-hover:text-[#023164] transition-colors font-sans mb-1">
        {name}
      </h3>
      <p className="text-[10px] text-slate-400 text-center leading-tight">
        {description}
      </p>
    </a>
  );
};

export default SystemCard;
