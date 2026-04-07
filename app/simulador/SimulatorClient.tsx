"use client";

import { useState } from "react";
import {
  FaHeartbeat,
  FaWhatsapp,
  FaChartLine,
  FaSearch,
  FaHospital,
  FaChevronRight,
} from "react-icons/fa";
import { SimuladorTab } from "@/components/simulator/SimuladorTab";
import { BuscaResidenciaTab } from "@/components/busca/BuscaResidenciaTab";
import { SimuladorScmspTab } from "@/components/scmsp/SimuladorScmspTab";
import { BuscaScmspTab } from "@/components/scmsp/BuscaScmspTab";
import type {
  Especialidade,
  SpecialtyOverview,
  EspecialidadeScmsp,
  SpecialtyOverviewScmsp,
} from "@/lib/types";

interface Props {
  especialidades: Especialidade[];
  specialtyOverview: SpecialtyOverview[];
  especialidadesScmsp: EspecialidadeScmsp[];
  specialtyOverviewScmsp: SpecialtyOverviewScmsp[];
}

const WHATSAPP_NUMBER = "5521993528752";
const WHATSAPP_MSG = encodeURIComponent(
  "Olá, estava no portal do cliente e estou com algumas dificuldades, poderia me ajudar?"
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

type Program = "sus-sp" | "scmsp";
type Tab = "simulador" | "busca";

const PROGRAMS = [
  {
    id: "sus-sp" as Program,
    name: "SUS-SP",
    year: "2025",
    fullName: "Programa SUS-SP",
    color: "#009688",
  },
  {
    id: "scmsp" as Program,
    name: "SCMSP",
    year: "2026",
    fullName: "Santa Casa de Misericórdia de SP",
    color: "#009688",
  },
];

export function SimulatorClient({
  especialidades,
  specialtyOverview,
  especialidadesScmsp,
  specialtyOverviewScmsp,
}: Props) {
  const [program, setProgram] = useState<Program>("sus-sp");
  const [activeTab, setActiveTab] = useState<Tab>("simulador");

  const isSusSp = program === "sus-sp";
  const currentProgram = PROGRAMS.find((p) => p.id === program)!;

  // Stats ribbon data
  const stats = isSusSp
    ? [
        { value: "50",     label: "Especialidades" },
        { value: "13.354", label: "Candidatos" },
        { value: "1.403",  label: "Vagas SUS-SP" },
      ]
    : [
        { value: String(specialtyOverviewScmsp.length),  label: "Especialidades" },
        { value: specialtyOverviewScmsp.reduce((s, e) => s + (e.inscritos ?? 0), 0).toLocaleString("pt-BR"),  label: "Inscritos" },
        { value: String(specialtyOverviewScmsp.reduce((s, e) => s + (e.vagas_total ?? 0), 0)), label: "Vagas SCMSP" },
      ];

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

      {/* Program Selector */}
      <div className="bg-[#009688] px-4 pt-3 pb-0">
        <div className="max-w-lg mx-auto">
          <p className="text-[10px] text-white/60 font-semibold uppercase tracking-widest mb-2 ml-1">
            Selecione o Programa
          </p>
          <div className="flex gap-2">
            {PROGRAMS.map((prog) => (
              <button
                key={prog.id}
                onClick={() => { setProgram(prog.id); setActiveTab("simulador"); }}
                className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all duration-200 ${
                  program === prog.id
                    ? "bg-white text-[#009688] shadow-sm"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  program === prog.id ? "bg-[#009688]/10" : "bg-white/10"
                }`}>
                  <FaHospital className={`text-xs ${program === prog.id ? "text-[#009688]" : "text-white"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-extrabold leading-none ${program === prog.id ? "text-[#009688]" : "text-white"}`}>
                    {prog.name}
                  </p>
                  <p className={`text-[10px] leading-none mt-0.5 ${program === prog.id ? "text-gray-400" : "text-white/60"}`}>
                    {prog.year}
                  </p>
                </div>
                {program === prog.id && (
                  <FaChevronRight className="text-[8px] text-[#009688] flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-[#009688] px-4 pb-1 pt-2">
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
          {isSusSp ? (
            activeTab === "simulador" ? (
              <SimuladorTab especialidades={especialidades} />
            ) : (
              <BuscaResidenciaTab specialties={specialtyOverview} />
            )
          ) : (
            activeTab === "simulador" ? (
              <SimuladorScmspTab especialidades={especialidadesScmsp} />
            ) : (
              <BuscaScmspTab specialties={specialtyOverviewScmsp} />
            )
          )}
        </div>
      </main>

      {/* Stats ribbon */}
      <div className="bg-[#009688]/10 border-t border-[#B2DFDB]/50 px-4 py-3">
        <div className="max-w-lg mx-auto">
          {/* Program label */}
          <p className="text-center text-[10px] font-semibold text-[#009688] mb-2 uppercase tracking-wide">
            {currentProgram.fullName} · {currentProgram.year}
          </p>
          <div className="flex justify-around text-center">
            {stats.flatMap((stat, i) => [
              ...(i > 0 ? [<div key={`sep-${i}`} className="w-px bg-[#B2DFDB]" />] : []),
              <div key={`stat-${i}`} className="flex-1">
                <p className="text-lg font-extrabold text-[#009688]">{stat.value}</p>
                <p className="text-[10px] text-gray-500 font-medium">{stat.label}</p>
              </div>,
            ])}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 py-3 text-center border-t border-[#B2DFDB]/30">
        <p className="text-[10px] text-gray-400">
          {isSusSp
            ? "Dados baseados no edital SUS-SP 2025 · Simulação com fins educacionais"
            : "Dados baseados no edital SCMSP 2026 · Simulação com fins educacionais"}
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
