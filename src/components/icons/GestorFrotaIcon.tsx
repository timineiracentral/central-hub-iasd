import { SVGProps } from "react";

const GestorFrotaIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth={7}
        strokeLinecap="round"
        className={className}
        {...props}
    >
        {/* outer ring */}
        <circle cx="50" cy="50" r="44" />
        {/* hub */}
        <circle cx="50" cy="50" r="10" fill="currentColor" stroke="none" />
        {/* spokes */}
        <line x1="50" y1="40" x2="50" y2="18" />
        <line x1="40" y1="55" x2="22" y2="67" />
        <line x1="60" y1="55" x2="78" y2="67" />
    </svg>
);

export default GestorFrotaIcon;
