import { cn } from "@/lib/utils";
import "@/components/loading-screen.css";

export interface LoadingScreenProps {
  logoSrc?: string;
  backgroundColor?: string;
}

const LoadingScreen = ({
  logoSrc = "/logo.png",
  backgroundColor = "#0a3868",
}: LoadingScreenProps) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center"
      )}
      style={{ backgroundColor }}
      aria-busy="true"
      aria-label="Carregando"
    >
      <div className="flex flex-col items-center gap-8">
        <img
          src={logoSrc}
          alt="IASD"
          className="h-24 w-24 object-contain sm:h-32 sm:w-32"
        />
        <div className="loading-screen-indicator" />
      </div>
    </div>
  );
};

export default LoadingScreen;
