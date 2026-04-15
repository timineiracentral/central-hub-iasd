import type { LucideIcon } from "lucide-react";
import { Car, FileText, KeyRound, Package, PackageCheck, Truck } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import GestorFrotaIcon from "@/components/icons/GestorFrotaIcon";
import EventosIcon from "@/components/icons/EventosIcon";

export type HubSystemIcon = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;

export type HubSystem = {
  /** Identificador estável para formulários (chamados). */
  id: string;
  name: string;
  description: string;
  icon: HubSystemIcon;
  url: string;
  color: string;
  iconColor: string;
};

/**
 * Sistemas exibidos no hub. Ordem = ordem dos cards.
 */
export const hubSystems: HubSystem[] = [
  {
    id: "almox-pro",
    name: "Almox-pro",
    description: "Gestão de almoxarifado",
    icon: Package,
    url: "https://almox-amc.mineiracentral.org.br/",
    color: "bg-blue-100",
    iconColor: "text-blue-800",
  },
  {
    id: "aluguel-pro",
    name: "Aluguel-pro",
    description: "Gestão de aluguéis",
    icon: KeyRound,
    url: "https://aluguelpro.mineiracentral.org.br/",
    color: "bg-emerald-100",
    iconColor: "text-emerald-800",
  },
  {
    id: "controle-veiculos",
    name: "Controle Veículos",
    description: "Controle de frota",
    icon: Car,
    url: "https://controleveiculos.mineiracentral.org.br/",
    color: "bg-orange-100",
    iconColor: "text-orange-800",
  },
  {
    id: "mudancas-pro",
    name: "Mudanças-pro",
    description: "Gestão de mudanças",
    icon: Truck,
    url: "https://mudancas-pro.mineiracentral.org.br/",
    color: "bg-amber-100",
    iconColor: "text-amber-800",
  },
  {
    id: "documentacao",
    name: "Documentação",
    description: "Documentação interna",
    icon: FileText,
    url: "https://docs.mineiracentral.org.br/",
    color: "bg-indigo-600",
    iconColor: "text-white",
  },
  {
    id: "amc-log",
    name: "AMC Log",
    description: "Gestão Inteligente de Entregas",
    icon: PackageCheck,
    url: "https://log.mineiracentral.org.br",
    color: "bg-amber-200",
    iconColor: "text-amber-900",
  },
  {
    id: "gestor-frota",
    name: "Gestor de Frota",
    description: "Gestão administrativa da frota veicular",
    icon: GestorFrotaIcon,
    url: "https://gestordefrota.mineiracentral.org.br/",
    color: "bg-cyan-100",
    iconColor: "text-cyan-800",
  },
  {
    id: "eventos",
    name: "Eventos",
    description: "Gestão de eventos",
    icon: EventosIcon,
    url: "https://eventos.mineiracentral.org.br/",
    color: "bg-violet-100",
    iconColor: "text-violet-800",
  },
];

/** Opções extras só no formulário de chamado (não são cards). */
export const feedbackOnlySystems: { id: string; label: string }[] = [
  { id: "hub-geral", label: "Hub AMC (esta página)" },
  { id: "outro", label: "Outro / não listado" },
];

export function getSystemLabelById(id: string): string {
  const fromHub = hubSystems.find((s) => s.id === id);
  if (fromHub) return fromHub.name;
  const extra = feedbackOnlySystems.find((s) => s.id === id);
  return extra?.label ?? id;
}
