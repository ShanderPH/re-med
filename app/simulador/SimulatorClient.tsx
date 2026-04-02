"use client";

import { useState } from "react";
import { FaHeartbeat, FaWhatsapp, FaChartLine, FaSearch } from "react-icons/fa";
import { SimuladorTab } from "@/components/simulator/SimuladorTab";
import { BuscaResidenciaTab } from "@/components/busca/BuscaResidenciaTab";
import type { Especialidade, SpecialtyOverview } from "@/lib/types";

interface Props {
  especialidades: Especialidade[];
  specialtyOverview: SpecialtyOverview[];
}

const WHATSAPP_NUMBER = "5521993528752";
const WHATSAPP_MSG = encodeURIComponent(
  "Olá, estava no portal do cliente e estou com algumas dificuldades, poderia me ajudar?"
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

type Tab = "simulador" | "busca";

export function SimulatorClient({ especialidades, specialtyOverview }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("simulador");

  return (
    <div className="min-h-dvh flex flex-col bg-[#FFF8E1]">
      {/* Header */}
      <header className="bg-[#009688] text-white px-4 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <FaHeartbeat className="text-2xl text-[#B2DFDB]" />
          <div>
            <h1 className="font-extrabold text-lg leading-none">Re-med</h1>
            <p className="text-[10px] text-[#B2DFDB] leading-none mt-0.5">
              Residência Médica
            </p>
          </div>
        </div>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 transition-colors
            px-3 py-1.5 rounded-full text-xs font-semibold"
        >
          <FaWhatsapp className="text-base" />
          Suporte
        </a>
      </header>

      {/* Tab Navigation */}
      <div className="bg-[#009688] px-4 pb-1">
        <div className="max-w-lg mx-auto flex gap-1">
          <button
            onClick={() => setActiveTab("simulador")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-t-xl text-sm font-semibold transition-all ${
              activeTab === "simulador"
                ? "bg-[#FFF8E1] text-[#009688] shadow-sm"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <FaChartLine className="text-xs" />
            Simulador
          </button>
          <button
            onClick={() => setActiveTab("busca")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-t-xl text-sm font-semibold transition-all ${
              activeTab === "busca"
                ? "bg-[#FFF8E1] text-[#009688] shadow-sm"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <FaSearch className="text-xs" />
            Busca de Residência
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <main className="flex-1 px-4 py-5 pb-8">
        <div className="max-w-lg mx-auto">
          {activeTab === "simulador" ? (
            <SimuladorTab especialidades={especialidades} />
          ) : (
            <BuscaResidenciaTab specialties={specialtyOverview} />
          )}
        </div>
      </main>

      {/* Stats ribbon */}
      <div className="bg-[#009688]/10 border-t border-[#B2DFDB]/50 px-4 py-3">
        <div className="max-w-lg mx-auto flex justify-around text-center">
          <div>
            <p className="text-lg font-extrabold text-[#009688]">50</p>
            <p className="text-[10px] text-gray-500 font-medium">Especialidades</p>
          </div>
          <div className="w-px bg-[#B2DFDB]" />
          <div>
            <p className="text-lg font-extrabold text-[#009688]">13.354</p>
            <p className="text-[10px] text-gray-500 font-medium">Candidatos</p>
          </div>
          <div className="w-px bg-[#B2DFDB]" />
          <div>
            <p className="text-lg font-extrabold text-[#009688]">1.403</p>
            <p className="text-[10px] text-gray-500 font-medium">Vagas SUS-SP</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 py-3 text-center border-t border-[#B2DFDB]/30">
        <p className="text-[10px] text-gray-400">
          Dados baseados no edital SUS-SP 2025 · Simulação com fins educacionais
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-[#009688]
            hover:text-[#00796B] transition-colors"
        >
          <FaWhatsapp className="text-sm" />
          Contatar o Suporte
        </a>
      </footer>
    </div>
  );
}
