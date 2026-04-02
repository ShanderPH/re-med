"use client";

import { useState } from "react";
import {
  FaStethoscope,
  FaUsers,
  FaHospital,
  FaChartBar,
  FaTrophy,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import type { SpecialtyOverview } from "@/lib/types";

interface Props {
  specialties: SpecialtyOverview[];
}

type SortKey = "especialidade" | "vagas" | "concorrencia" | "nota_corte";
type SortDir = "asc" | "desc";

export function BuscaResidenciaTab({ specialties }: Props) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("especialidade");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = specialties
    .filter((s) => s.especialidade.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortKey === "especialidade") return mul * a.especialidade.localeCompare(b.especialidade);
      return mul * ((a[sortKey] as number) - (b[sortKey] as number));
    });

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "especialidade" ? "asc" : "desc");
    }
  }

  const SortIcon = sortDir === "asc" ? FaSortAmountUp : FaSortAmountDown;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-extrabold text-[#37474F]">Busca de Residência</h2>
        <p className="text-sm text-gray-500 mt-1">
          Explore especialidades, vagas e concorrência do SUS-SP
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#009688] text-sm" />
        <input
          type="text"
          placeholder="Buscar especialidade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-[#B2DFDB] bg-white text-[#37474F] placeholder-gray-400
            focus:outline-none focus:border-[#009688] transition-colors text-sm"
        />
      </div>

      {/* Sort controls */}
      <div className="flex gap-1.5 flex-wrap">
        {([
          ["especialidade", "Nome"],
          ["vagas", "Vagas"],
          ["concorrencia", "Concorrência"],
          ["nota_corte", "Nota de Corte"],
        ] as [SortKey, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => toggleSort(key)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              sortKey === key
                ? "bg-[#009688] text-white"
                : "bg-white text-gray-500 border border-[#B2DFDB] hover:border-[#009688]"
            }`}
          >
            {label}
            {sortKey === key && <SortIcon className="text-[10px]" />}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-400">
        {filtered.length} especialidade{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Specialty cards */}
      <div className="space-y-2">
        {filtered.map((spec) => {
          const isExpanded = expanded === spec.especialidade;
          return (
            <div
              key={spec.especialidade}
              className="bg-white rounded-xl border border-[#B2DFDB]/50 overflow-hidden transition-shadow hover:shadow-sm"
            >
              {/* Card header */}
              <button
                type="button"
                onClick={() => setExpanded(isExpanded ? null : spec.especialidade)}
                className="w-full text-left px-4 py-3.5 flex items-center gap-3"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-[#009688]/10 rounded-lg flex items-center justify-center">
                  <FaStethoscope className="text-[#009688] text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#37474F] truncate">
                    {spec.especialidade}
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                    <span className="text-[11px] text-gray-400">
                      {spec.vagas} vagas
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {spec.concorrencia.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}:1
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Corte: {spec.nota_corte}
                    </span>
                  </div>
                </div>
                {isExpanded ? (
                  <FaChevronUp className="text-xs text-[#009688] flex-shrink-0" />
                ) : (
                  <FaChevronDown className="text-xs text-gray-300 flex-shrink-0" />
                )}
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="border-t border-[#B2DFDB]/30 pt-3">
                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-[#FFF8E1] rounded-lg p-2.5">
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                          <FaHospital className="text-[#009688]" />
                          Vagas Totais
                        </div>
                        <p className="text-lg font-bold text-[#37474F]">{spec.vagas}</p>
                      </div>
                      <div className="bg-[#FFF8E1] rounded-lg p-2.5">
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                          <FaUsers className="text-[#009688]" />
                          Inscritos
                        </div>
                        <p className="text-lg font-bold text-[#37474F]">
                          {spec.inscritos.toLocaleString("pt-BR")}
                        </p>
                      </div>
                      <div className="bg-[#FFF8E1] rounded-lg p-2.5">
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                          <FaChartBar className="text-[#009688]" />
                          Concorrência
                        </div>
                        <p className="text-lg font-bold text-[#37474F]">{spec.concorrencia.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}:1</p>
                      </div>
                      <div className="bg-[#FFF8E1] rounded-lg p-2.5">
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                          <FaTrophy className="text-[#009688]" />
                          Nota de Corte
                        </div>
                        <p className="text-lg font-bold text-[#37474F]">{spec.nota_corte}</p>
                      </div>
                    </div>

                    {/* Institutions */}
                    {spec.instituicoes && spec.instituicoes.length > 0 && (
                      <div>
                        <h5 className="text-xs font-bold text-[#37474F] mb-2 flex items-center gap-1.5">
                          <FaHospital className="text-[#009688]" />
                          Vagas por Instituição ({spec.instituicoes.length})
                        </h5>
                        <div className="space-y-1 max-h-48 overflow-y-auto">
                          {spec.instituicoes.map((inst) => (
                            <div
                              key={inst.instituicao}
                              className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-[#B2DFDB]/30 text-xs"
                            >
                              <span className="text-[#37474F] font-medium truncate mr-2">
                                {inst.instituicao}
                              </span>
                              <span className="flex-shrink-0 bg-[#009688]/10 text-[#009688] font-bold px-2 py-0.5 rounded-full">
                                {inst.vagas} {inst.vagas === 1 ? "vaga" : "vagas"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8">
          <FaSearch className="text-3xl text-gray-200 mx-auto mb-2" />
          <p className="text-sm text-gray-400">Nenhuma especialidade encontrada</p>
        </div>
      )}
    </div>
  );
}
