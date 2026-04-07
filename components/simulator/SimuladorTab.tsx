"use client";

import { useState } from "react";
import { FaCheckCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { SimulatorForm } from "./SimulatorForm";
import { SimulationResultPanel } from "./SimulationResult";
import { InstitutionStep } from "./InstitutionStep";
import type { Especialidade, SimulationResult, TipoLista } from "@/lib/types";

interface Props {
  especialidades: Especialidade[];
}

export function SimuladorTab({ especialidades }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [simEspecialidade, setSimEspecialidade] = useState("");
  const [simNota, setSimNota] = useState(0);
  const [simTipoLista, setSimTipoLista] = useState<TipoLista>("Ampla Concorrência");

  function handleResult(res: SimulationResult, esp: string, nota: number, tipoLista: TipoLista) {
    setResult(res);
    setSimEspecialidade(esp);
    setSimNota(nota);
    setSimTipoLista(tipoLista);
    setCurrentStep(1);
  }

  function handleReset() {
    setResult(null);
    setSimEspecialidade("");
    setSimNota(0);
    setCurrentStep(0);
  }

  function handleGoToStep2() {
    setCurrentStep(2);
  }

  const steps = [
    { title: "Dados da Simulação", description: "Selecione a especialidade e insira sua nota" },
    { title: "Resultado da Aprovação", description: "Análise de probabilidade e ranking" },
    { title: "Simulação por Instituição", description: "Escolha onde deseja concorrer" },
  ];

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className="text-center">
        <h2 className="text-xl font-extrabold text-[#37474F]">Simulador de Aprovação</h2>
        <p className="text-sm text-gray-500 mt-1">
          Descubra suas chances na residência médica com dados reais do SUS-SP
        </p>
        <div className="inline-flex items-center gap-1.5 bg-[#009688]/10 rounded-full px-3 py-1 text-xs mt-2 text-[#009688] font-medium">
          <span className="w-1.5 h-1.5 bg-[#009688] rounded-full animate-pulse" />
          SUS-SP · Programa Disponível
        </div>
      </div>

      {/* Stepper Indicator */}
      <div className="bg-white rounded-2xl shadow-lg shadow-[#009688]/10 border border-[#B2DFDB]/40 overflow-hidden">
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-400">
              Passo {Math.min(currentStep + 1, 3)} de 3
            </span>
            {currentStep > 0 && (
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-[#009688] hover:text-[#00796B] transition-colors"
              >
                Nova Simulação
              </button>
            )}
          </div>
          {/* Step progress bar */}
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  i < currentStep
                    ? "bg-[#009688]"
                    : i === currentStep
                    ? "bg-[#009688]/60"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step items */}
        <div className="px-5 pb-5">
          <ol className="space-y-2">
            {steps.map((step, index) => {
              const isActive = currentStep === index;
              const isCompleted = currentStep > index;
              const isLocked = index > currentStep;

              return (
                <li key={step.title}>
                  {/* Step header */}
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => {
                      if (isCompleted) setCurrentStep(index);
                    }}
                    className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all text-left ${
                      isActive
                        ? "bg-[#009688]/5 border border-[#009688]/20"
                        : isCompleted
                        ? "hover:bg-gray-50 cursor-pointer"
                        : "opacity-50"
                    }`}
                  >
                    {/* Step circle */}
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <FaCheckCircle className="text-[#009688] text-lg" />
                      ) : (
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                            isActive
                              ? "border-[#009688] text-[#009688] bg-[#009688]/10"
                              : "border-gray-300 text-gray-400"
                          }`}
                        >
                          {index + 1}
                        </div>
                      )}
                    </div>
                    {/* Step text */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold ${
                          isActive || isCompleted ? "text-[#37474F]" : "text-gray-400"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{step.description}</p>
                    </div>
                    {/* Chevron */}
                    {!isLocked && (
                      <div className="flex-shrink-0 text-gray-400">
                        {isActive ? (
                          <FaChevronUp className="text-xs text-[#009688]" />
                        ) : (
                          <FaChevronDown className="text-xs" />
                        )}
                      </div>
                    )}
                  </button>

                  {/* Step content */}
                  {isActive && (
                    <div className="mt-3 pl-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      {index === 0 && (
                        <SimulatorForm
                          especialidades={especialidades}
                          onResult={handleResult}
                        />
                      )}
                      {index === 1 && result && (
                        <SimulationResultPanel
                          result={result}
                          especialidade={simEspecialidade}
                          nota={simNota}
                          onGoToInstitutions={handleGoToStep2}
                        />
                      )}
                      {index === 2 && result && (
                        <InstitutionStep
                          especialidade={simEspecialidade}
                          nota={simNota}
                          tipoLista={simTipoLista}
                          generalResult={result}
                        />
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Coming soon notice */}
      <div className="text-center">
        <p className="text-xs text-gray-400 bg-white/60 rounded-xl px-4 py-2.5 border border-[#B2DFDB]/40 inline-block">
          Novos programas em breve: USP, UNIFESP, ENARE e mais · Selecione SCMSP 2026 acima
        </p>
      </div>
    </div>
  );
}
