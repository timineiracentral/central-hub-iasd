import { SVGProps } from "react";

/** Calendário com argolas, faixa superior e grade de dias — alinhado à identidade visual do app Eventos. */
const EventosIcon = ({ className, strokeWidth: _ignored, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth={5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* argolas / encadernação */}
    <line x1="34" y1="10" x2="34" y2="22" />
    <line x1="66" y1="10" x2="66" y2="22" />
    {/* corpo do calendário */}
    <rect x="12" y="18" width="76" height="70" rx="12" ry="12" />
    {/* divisória cabeçalho / corpo */}
    <line x1="20" y1="40" x2="80" y2="40" />
    {/* dias (grade 2×3) */}
    <circle cx="32" cy="58" r="4" fill="currentColor" stroke="none" />
    <circle cx="50" cy="58" r="4" fill="currentColor" stroke="none" />
    <circle cx="68" cy="58" r="4" fill="currentColor" stroke="none" />
    <circle cx="32" cy="76" r="4" fill="currentColor" stroke="none" />
    <circle cx="50" cy="76" r="4" fill="currentColor" stroke="none" />
    <circle cx="68" cy="76" r="4" fill="currentColor" stroke="none" />
  </svg>
);

export default EventosIcon;
