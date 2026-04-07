"use client";

import { useState } from "react";
import {
  FaSearch,
  FaStethoscope,
  FaUsers,
  FaChartBar,
  FaTrophy,
  FaChevronDown,
  FaChevronUp,
  FaSortAmountDown,
  FaSortAmountUp,
  FaFilter,
  FaStar,
  FaLayerGroup,
} from "react-icons/fa";
import type { SpecialtyOverviewScmsp } from "@/lib/types";

interface Props {
  specialties: SpecialtyOverviewScmsp[];
}

type SortKey = "especialidade" | "vagas_total" | "concorrencia_val" | "nota_minima";
type SortDir = "asc" | "desc";
type AccessFilter = "all" | "direto" | "prereq";

const TIPO_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  "Acesso Direto": { label: "Acesso Direto", color: "#009688", bg: "#E0F2F1" },
};

function getAccessBadge(tipo: string) {
  if (tipo === "Acesso Direto") return TIPO_BADGE["Acesso Direto"];
  return { label: "Pré-req.", color: "#FF9800", bg: "#FFF3E0" };
}

export function BuscaScmspTab({ specialties }: Props) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("especialidade");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [accessFilter, setAccessFilter] = useState<AccessFilter>("all");

  const filtered = specialties
    .filter((s) => {
      const matchSearch = s.especialidade.toLowerCase().includes(search.toLowerCase());
      const matchAccess =
        accessFilter === "all" ? true
        : accessFilter === "direto" ? s.tipo_acesso === "Acesso Direto"
        : s.tipo_acesso !== "Acesso Direto";
      return matchSearch && matchAccess;
    })
    .sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortKey === "especialidade") return mul * a.especialidade.localeCompare(b.especialidade);
      const aVal = (a[sortKey] as number | null) ?? 0;
      const bVal = (b[sortKey] as number | null) ?? 0;
      return mul * (aVal - bVal);
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

  // Summary stats
  const totalVagas = specialties.reduce((s, e) => s + (e.vagas_total ?? 0), 0);
  const totalInscritos = specialties.reduce((s, e) => s + (e.inscritos ?? 0), 0);
  const directCount = specialties.filter(s => s.tipo_acesso === "Acesso Direto").length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-extrabold text-[#37474F]">Busca SCMSP 2026</h2>
        <p className="text-sm text-gray-500 mt-1">
          Santa Casa de Misericórdia de São Paulo · Especialidades e concorrência
        </p>
      </div>

      {/* Summary ribbon */}
      <div className="bg-white rounded-2xl border border-[#B2DFDB]/40 shadow-sm px-4 py-3">
        <div className="flex justify-around text-center">
          <div>
            <p className="text-lg font-extrabold text-[#009688]">{totalVagas}</p>
            <p className="text-[10px] text-gray-400 font-medium">Vagas Totais</p>
          </div>
          <div className="w-px bg-[#B2DFDB]" />
          <div>
            <p className="text-lg font-extrabold text-[#009688]">{totalInscritos.toLocaleString("pt-BR")}</p>
            <p className="text-[10px] text-gray-400 font-medium">Inscritos</p>
          </div>
          <div className="w-px bg-[#B2DFDB]" />
          <div>
            <p className="text-lg font-extrabold text-[#009688]">{specialties.length}</p>
            <p className="text-[10px] text-gray-400 font-medium">Especialidades</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#009688] text-sm" />
        <input
          type="text"
          placeholder="Buscar especialidade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-[#B2DFDB] bg-white text-[#37474F]
            placeholder-gray-400 focus:outline-none focus:border-[#009688] transition-colors text-sm"
        />
      </div>

      {/* Access type filter */}
      <div className="flex gap-1.5">
        <FaFilter className="text-[#009688] text-xs mt-1.5 flex-shrink-0" />
        {([
          ["all",    "Todas"],
          ["direto", `Acesso Direto (${directCount})`],
          ["prereq", `Pré-req. (${specialties.length - directCount})`],
        ] as [AccessFilter, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setAccessFilter(key)}
            className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
              accessFilter === key
                ? "bg-[#009688] text-white"
                : "bg-white text-gray-500 border border-[#B2DFDB] hover:border-[#009688]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sort controls */}
      <div className="flex gap-1.5 flex-wrap">
        {([
          ["especialidade", "Nome"],
          ["vagas_total",   "Vagas"],
          ["concorrencia_val", "Concorrência"],
          ["nota_minima",   "Corte"],
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

      <p className="text-xs text-gray-400">
        {filtered.length} especialidade{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Specialty cards */}
      <div className="space-y-2">
        {filtered.map((spec) => {
          const isExpanded = expanded === spec.especialidade;
          const badge = getAccessBadge(spec.tipo_acesso);

          return (
            <div
              key={spec.especialidade}
              className="bg-white rounded-xl border border-[#B2DFDB]/50 overflow-hidden transition-shadow hover:shadow-sm"
            >
              <button
                type="button"
                onClick={() => setExpanded(isExpanded ? null : spec.especialidade)}
                className="w-full text-left px-4 py-3.5 flex items-center gap-3"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-[#009688]/10 rounded-lg flex items-center justify-center">
                  <FaStethoscope className="text-[#009688] text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-sm font-semibold text-[#37474F] truncate">
                      {spec.especialidade}
                    </p>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ color: badge.color, backgroundColor: badge.bg }}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                    <span className="text-[11px] text-gray-400">
                      {spec.vagas_total} vagas ({spec.vagas_ac} AC{spec.vagas_cotas > 0 ? `, ${spec.vagas_cotas} N_I` : ""})
                    </span>
                    {spec.concorrencia_val != null && (
                      <span className="text-[11px] text-gray-400">
                        {Number(spec.concorrencia_val).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}:1
                      </span>
                    )}
                    {spec.nota_minima != null && (
                      <span className="text-[11px] text-gray-400">
                        Corte: {spec.nota_minima}
                      </span>
                    )}
                  </div>
                </div>
                {isExpanded ? (
                  <FaChevronUp className="text-xs text-[#009688] flex-shrink-0" />
                ) : (
                  <FaChevronDown className="text-xs text-gray-300 flex-shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="border-t border-[#B2DFDB]/30 pt-3 space-y-3">
                    {/* Tipo de acesso */}
                    <div className="flex items-center gap-1.5">
                      <FaLayerGroup className="text-[#009688] text-xs" />
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold text-[#37474F]">Tipo de Acesso:</span> {spec.tipo_acesso}
                      </p>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-[#FFF8E1] rounded-lg p-2.5">
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium mb-1">
                          <FaUsers className="text-[#009688]" />
                          Vagas totais
                        </div>
                        <div className="flex items-end gap-1">
                          <p className="text-xl font-extrabold text-[#37474F]">{spec.vagas_total}</p>
                          <p className="text-[10px] text-gray-400 mb-0.5">({spec.vagas_ac} AC{spec.vagas_cotas > 0 ? ` + ${spec.vagas_cotas} N_I` : ""})</p>
                        </div>
                      </div>

                      <div className="bg-[#FFF8E1] rounded-lg p-2.5">
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium mb-1">
                          <FaChartBar className="text-[#009688]" />
                          Inscritos
                        </div>
                        <p className="text-xl font-extrabold text-[#37474F]">
                          {spec.inscritos != null ? spec.inscritos.toLocaleString("pt-BR") : "N/D"}
                        </p>
                      </div>

                      <div className="bg-[#FFF8E1] rounded-lg p-2.5">
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium mb-1">
                          <FaUsers className="text-[#009688]" />
                          Concorrência
                        </div>
                        <p className="text-xl font-extrabold text-[#37474F]">
                          {spec.concorrencia_val != null
                            ? `${Number(spec.concorrencia_val).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}:1`
                            : "N/D"}
                        </p>
                      </div>

                      <div className="bg-[#FFF8E1] rounded-lg p-2.5">
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium mb-1">
                          <FaTrophy className="text-[#009688]" />
                          Nota de Corte
                        </div>
                        <p className="text-xl font-extrabold text-[#37474F]">
                          {spec.nota_minima != null ? spec.nota_minima : "N/D"}
                        </p>
                      </div>
                    </div>

                    {/* Score stats (from resumo) */}
                    {spec.nota_maxima != null && (
                      <div className="bg-[#009688]/5 rounded-xl p-3 border border-[#009688]/10">
                        <p className="text-[10px] font-bold text-[#009688] uppercase tracking-wide mb-2">
                          Estatísticas dos Habilitados ({spec.candidatos_habilitados})
                        </p>
                        <div className="space-y-1.5">
                          {[
                            { label: "Nota Máxima", value: spec.nota_maxima, color: "#009688" },
                            { label: "Nota Média",  value: spec.nota_media,  color: "#26A69A" },
                            { label: "Nota Mínima", value: spec.nota_minima, color: "#90A4AE" },
                          ].map((item) => item.value != null && (
                            <div key={item.label} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                              <span className="text-[11px] text-gray-500 flex-1">{item.label}</span>
                              <span className="text-[11px] font-bold text-[#37474F]">{item.value.toFixed(2)}</span>
                              <div className="w-16 h-1.5 bg-white rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{ width: `${(item.value / 100) * 100}%`, backgroundColor: item.color }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* N_I info */}
                    {spec.vagas_cotas > 0 && (
                      <div className="flex items-start gap-1.5 text-[10px] text-gray-400">
                        <FaStar className="text-[#FF9800] mt-0.5 flex-shrink-0" />
                        <span>{spec.vagas_cotas} vaga{spec.vagas_cotas > 1 ? "s" : ""} reservada{spec.vagas_cotas > 1 ? "s" : ""} para candidatos N_I (não identificados racialmente)</span>
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
