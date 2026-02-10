import { Truck } from "lucide-react";
import SystemCard from "@/components/SystemCard";

const systems = [
  { name: "Almox-pro", description: "Gestão de almoxarifado", imageSrc: "./icons/almox-pro.png", url: "https://almox-amc.mineiracentral.org.br/", color: "bg-blue-50" },
  { name: "Aluguel-pro", description: "Gestão de aluguéis", imageSrc: "./icons/aluguel-pro.png", url: "https://aluguelpro.mineiracentral.org.br/", color: "bg-green-50" },
  { name: "Controle Veículos", description: "Controle de frota", imageSrc: "./icons/controle-veiculos.ico", url: "https://controleveiculos.mineiracentral.org.br/", color: "bg-orange-50" },
  { name: "Mudanças-pro", description: "Gestão de mudanças", icon: Truck, url: "https://mudancas-pro.mineiracentral.org.br/", color: "bg-amber-50" },
  { name: "Documentação", description: "Documentação interna", imageSrc: "./icons/documentacao.png", url: "https://docs.mineiracentral.org.br/", color: "bg-indigo-600" },
  { name: "AMC Log", description: "Gestão Inteligente de Entregas", imageSrc: "./icons/amc-log.png", url: "https://log.mineiracentral.org.br", color: "bg-amber-100" },
];

// Sistemas futuros (comentados):
// { name: "Secretaria", description: "Gestão de membros e transferência", icon: Users, url: "#", color: "bg-blue-50" },
// { name: "Tesouraria", description: "Controle financeiro e remessas", icon: DollarSign, url: "#", color: "bg-green-50" },
// { name: "Documentos", description: "Arquivos e modelos oficiais", icon: FileText, url: "#", color: "bg-orange-50" },
// { name: "Configurações", description: "Ajustes do sistema e perfil", icon: Settings, url: "#", color: "bg-slate-50" },
// { name: "Agenda", description: "Calendário e eventos da associação", icon: Calendar, url: "#", color: "bg-purple-50" },
// { name: "Relatórios", description: "Dados estatísticos e métricas", icon: BarChart, url: "#", color: "bg-indigo-50" },
// { name: "Comunicação", description: "Notícias e avisos internos", icon: Mail, url: "#", color: "bg-pink-50" },
// { name: "Jurídico", description: "Processos e consultoria legal", icon: Scale, url: "#", color: "bg-red-50" },
// { name: "Educação", description: "Gestão escolar e acadêmica", icon: BookOpen, url: "#", color: "bg-yellow-50" },
// { name: "Recursos Humanos", description: "Gestão de colaboradores", icon: Briefcase, url: "#", color: "bg-emerald-50" },


const Index = () => {
  return (
    <div className="min-h-screen w-full bg-slate-50 lg:grid lg:grid-cols-7 font-sans">
      {/* Main Content - spanned 6 cols */}
      <main className="col-span-1 lg:col-span-6 p-8 md:p-12 lg:p-20 flex flex-col justify-center min-h-[80vh] lg:min-h-screen">
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-12 lg:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#023164] mb-6 tracking-tight">
              Seja bem-vindo.
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 font-light max-w-2xl">
              Este é o novo ERP da Associação Mineira Central da IASD.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {systems.map((sys, index) => (
              <SystemCard key={index} {...sys} />
            ))}
          </div>
        </div>
      </main>

      {/* Sidebar - 7th col */}
      <aside className="hidden lg:flex col-span-1 bg-[#023164] flex-col justify-end items-center relative overflow-hidden pb-20">
        {/* Decorative elements */}
        <div className="opacity-10 absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="opacity-5 absolute -right-10 -bottom-10 w-64 h-64 bg-white rounded-full blur-3xl pointer-events-none"></div>
        <div className="opacity-5 absolute -left-10 -top-10 w-64 h-64 bg-white rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-32 h-32 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="IASD Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </aside>

      {/* Mobile Branding Footer */}
      <footer className="lg:hidden bg-[#023164] p-8 text-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <p className="font-semibold tracking-widest text-sm uppercase opacity-90">Associação Mineira Central</p>
          <p className="text-xs opacity-60 mt-2">Igreja Adventista do Sétimo Dia</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
