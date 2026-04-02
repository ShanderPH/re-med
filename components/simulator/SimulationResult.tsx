"use client";

import {
  FaCheckCircle,
  FaTimesCircle,
  FaTrophy,
  FaHospital,
  FaUsers,
  FaChartBar,
  FaArrowRight,
  FaPercentage,
} from "react-icons/fa";
import type { SimulationResult } from "@/lib/types";

interface Props {
  result: SimulationResult;
  especialidade: string;
  nota: number;
  onGoToInstitutions: () => void;
}

const PROB_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  muito_alta: { label: "Muito Alta", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  alta: { label: "Alta", color: "text-green-700", bg: "bg-green-50 border-green-200" },
  moderada: { label: "Moderada", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  baixa: { label: "Baixa", color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
  muito_baixa: { label: "Muito Baixa", color: "text-red-700", bg: "bg-red-50 border-red-200" },
  indefinida: { label: "Indefinida", color: "text-gray-700", bg: "bg-gray-50 border-gray-200" },
};

function StatCard({
  icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-3.5 flex flex-col gap-1 ${
        highlight ? "bg-[#009688] text-white" : "bg-white border border-[#B2DFDB]"
      }`}
    >
      <div className={`text-xs font-medium flex items-center gap-1.5 ${highlight ? "text-[#B2DFDB]" : "text-gray-500"}`}>
        {icon}
        {label}
      </div>
      <div className={`text-xl font-bold ${highlight ? "text-white" : "text-[#37474F]"}`}>
        {value}
      </div>
      {sub && (
        <div className={`text-[11px] ${highlight ? "text-[#B2DFDB]" : "text-gray-400"}`}>
          {sub}
        </div>
      )}
    </div>
  );
}

export function SimulationResultPanel({ result, especialidade, nota, onGoToInstitutions }: Props) {
  // ranking_estimado pode ultrapassar total_lista quando o candidato ficaria abaixo de todos
  const clampedRanking = Math.min(result.ranking_estimado, result.total_lista);
  const percentRanking = result.total_lista > 0
    ? Math.round((clampedRanking / result.total_lista) * 100)
    : 0;
  const rankingLabel = percentRanking >= 100 ? "Última posição" : `Top ${percentRanking}% da lista`;

  const shortEsp = especialidade.split(" - ")[0];
  const prob = PROB_LABELS[result.probabilidade] ?? PROB_LABELS.indefinida;
  const concorrenciaFmt = result.concorrencia.toLocaleString("pt-BR", { maximumFractionDigits: 2 });

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Status badge */}
      <div
        className={`rounded-2xl p-5 text-center ${
          result.aprovado
            ? "bg-[#009688] text-white"
            : "bg-[#37474F] text-white"
        }`}
      >
        <div className="flex justify-center mb-2">
          {result.aprovado ? (
            <FaCheckCircle className="text-4xl text-[#B2DFDB]" />
          ) : (
            <FaTimesCircle className="text-4xl text-red-300" />
          )}
        </div>
        <h3 className="text-xl font-extrabold">
          {result.aprovado ? "Provável Aprovação!" : "Fora do Corte"}
        </h3>
        <p className="text-sm mt-1 opacity-80">
          {result.aprovado
            ? `Nota ${nota} · ${result.chamada} · ${shortEsp}`
            : `Nota ${nota} · Corte: ${result.nota_corte} · ${shortEsp}`}
        </p>
        {result.aprovado && (
          <span className="inline-block mt-2 bg-white/20 rounded-full px-3 py-1 text-xs font-semibold">
            {result.chamada}
          </span>
        )}
      </div>

      {/* Probability badge */}
      <div className={`rounded-xl border p-3 flex items-center gap-3 ${prob.bg}`}>
        <FaPercentage className={`text-lg ${prob.color}`} />
        <div>
          <p className={`text-sm font-bold ${prob.color}`}>
            Probabilidade: {prob.label}
          </p>
          <p className="text-xs text-gray-500">
            {result.chamada}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<FaTrophy className="text-xs" />}
          label="Sua Posição"
          value={`${clampedRanking}º`}
          sub={rankingLabel}
          highlight={result.aprovado}
        />
        <StatCard
          icon={<FaChartBar className="text-xs" />}
          label="Nota de Corte"
          value={result.nota_corte}
          sub="Última nota aprovada"
        />
        <StatCard
          icon={<FaUsers className="text-xs" />}
          label="Concorrência"
          value={`${concorrenciaFmt}:1`}
          sub={`${result.inscritos.toLocaleString("pt-BR")} inscritos`}
        />
        <StatCard
          icon={<FaHospital className="text-xs" />}
          label="Vagas"
          value={result.vagas}
          sub={`${result.total_selecionados} selecionados`}
        />
      </div>

      {/* Ranking bar */}
      <div className="bg-white rounded-xl border border-[#B2DFDB] p-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>1º</span>
          <span className="font-semibold text-[#009688]">
            Corte: {result.total_selecionados}º
          </span>
          <span>{result.total_lista}º</span>
        </div>
        <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-[#B2DFDB] rounded-full"
            style={{
              width: `${Math.min((result.total_selecionados / result.total_lista) * 100, 100)}%`,
            }}
          />
          <div
            className="absolute top-0 h-full w-1 bg-[#009688] rounded-full"
            style={{
              left: `${Math.min((clampedRanking / result.total_lista) * 100, 99)}%`,
            }}
          />
        </div>
        <p className="text-xs text-center text-gray-500 mt-1.5">
          Você está na posição {clampedRanking}º de {result.total_lista} candidatos
        </p>
      </div>

      {/* Go to Step 2 */}
      <button
        onClick={onGoToInstitutions}
        className="w-full py-3.5 rounded-xl bg-[#009688] text-white font-bold text-sm
          hover:bg-[#00796B] active:scale-[0.98] transition-all shadow-md shadow-[#009688]/30
          flex items-center justify-center gap-2"
      >
        <FaHospital />
        Simular por Instituição
        <FaArrowRight className="text-xs" />
      </button>
    </div>
  );
}
