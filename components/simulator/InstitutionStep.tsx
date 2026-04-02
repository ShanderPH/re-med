"use client";

import { useEffect, useState, useTransition } from "react";
import {
  FaHospital,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronRight,
  FaInfoCircle,
} from "react-icons/fa";
import { runInstitutionSimulation } from "@/lib/queries";
import type { InstitutionResult, SimulationResult, TipoLista } from "@/lib/types";

interface Props {
  especialidade: string;
  nota: number;
  tipoLista: TipoLista;
  generalResult: SimulationResult;
}

export function InstitutionStep({ especialidade, nota, tipoLista, generalResult }: Props) {
  const [institutions, setInstitutions] = useState<InstitutionResult[]>([]);
  const [selected, setSelected] = useState<InstitutionResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await runInstitutionSimulation(especialidade, nota, tipoLista);
        setInstitutions(data);
      } catch {
        setError("Erro ao carregar dados das instituições.");
      }
    });
  }, [especialidade, nota, tipoLista]);

  if (isPending) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <span className="animate-spin inline-block w-6 h-6 border-3 border-[#009688] border-t-transparent rounded-full" />
        <p className="text-sm text-gray-500">Carregando instituições...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>;
  }

  if (institutions.length === 0) {
    return (
      <div className="text-center py-6">
        <FaInfoCircle className="text-3xl text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">
          Nenhuma instituição encontrada para esta especialidade.
        </p>
      </div>
    );
  }

  const shortEsp = especialidade.split(" - ")[0];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Summary header */}
      <div className="bg-[#009688]/5 rounded-xl p-3 border border-[#009688]/10">
        <p className="text-xs text-gray-500">
          <span className="font-semibold text-[#37474F]">{shortEsp}</span> · Nota: {nota} · Corte geral: {generalResult.nota_corte}
        </p>
      </div>

      {/* Institution list */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-[#37474F] flex items-center gap-2">
          <FaHospital className="text-[#009688]" />
          Selecione uma Instituição ({institutions.length})
        </h4>
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {institutions.map((inst) => {
            const isSelected = selected?.instituicao === inst.instituicao;
            return (
              <button
                key={inst.instituicao}
                type="button"
                onClick={() => setSelected(isSelected ? null : inst)}
                className={`w-full text-left rounded-xl p-3.5 border-2 transition-all ${
                  isSelected
                    ? "border-[#009688] bg-[#009688]/5 shadow-sm"
                    : "border-[#B2DFDB]/50 bg-white hover:border-[#B2DFDB] hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {inst.aprovado_instituicao ? (
                      <FaCheckCircle className="text-[#009688]" />
                    ) : (
                      <FaTimesCircle className="text-red-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#37474F] leading-tight">
                      {inst.instituicao}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                      <span className="text-xs text-gray-500">
                        {inst.vagas_instituicao} {inst.vagas_instituicao === 1 ? "vaga" : "vagas"}
                      </span>
                      <span className="text-xs text-gray-500">
                        Corte: {inst.nota_corte_instituicao}
                      </span>
                    </div>
                  </div>
                  <FaChevronRight
                    className={`text-xs mt-1.5 transition-transform ${
                      isSelected ? "rotate-90 text-[#009688]" : "text-gray-300"
                    }`}
                  />
                </div>

                {/* Expanded detail */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-[#B2DFDB]/50 animate-in fade-in duration-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3 border border-[#B2DFDB]/50">
                        <p className="text-[10px] text-gray-400 font-medium">Nota de Corte</p>
                        <p className="text-lg font-bold text-[#37474F]">
                          {inst.nota_corte_instituicao}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-[#B2DFDB]/50">
                        <p className="text-[10px] text-gray-400 font-medium">Vagas</p>
                        <p className="text-lg font-bold text-[#37474F]">
                          {inst.vagas_instituicao}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`mt-3 rounded-xl p-3 text-center text-sm font-bold ${
                        inst.aprovado_instituicao
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {inst.aprovado_instituicao ? (
                        <>
                          <FaCheckCircle className="inline mr-1.5" />
                          {inst.chamada_instituicao}
                        </>
                      ) : (
                        <>
                          <FaTimesCircle className="inline mr-1.5" />
                          {inst.chamada_instituicao}
                          <p className="text-xs font-normal mt-1">
                            Sua nota ({nota}) está abaixo do corte ({inst.nota_corte_instituicao})
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
