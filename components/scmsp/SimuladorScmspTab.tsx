"use client";

import { useState, useTransition } from "react";
import {
  FaStethoscope,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronDown,
  FaChevronUp,
  FaTrophy,
  FaUsers,
  FaChartBar,
  FaStar,
  FaInfoCircle,
  FaHospital,
} from "react-icons/fa";
import { runSimulationScmsp } from "@/lib/queries";
import type { EspecialidadeScmsp, SimulationResultScmsp, TipoCota } from "@/lib/types";

interface Props {
  especialidades: EspecialidadeScmsp[];
}

// Nota final = 90% objetiva + 10% análise curricular (SCMSP formula)
function calcNotaFinal(objetiva: number, curricular: number): number {
  return Math.round((0.9 * objetiva + 0.1 * curricular) * 100) / 100;
}

const PROB_CONFIG = {
  muito_alta: { label: "Muito Alta",  color: "#009688", bg: "#E0F2F1", bar: 95 },
  alta:       { label: "Alta",        color: "#26A69A", bg: "#E0F2F1", bar: 75 },
  moderada:   { label: "Moderada",    color: "#FF9800", bg: "#FFF3E0", bar: 50 },
  baixa:      { label: "Baixa",       color: "#F57C00", bg: "#FFF3E0", bar: 25 },
  muito_baixa:{ label: "Muito Baixa", color: "#E53935", bg: "#FFEBEE", bar: 8  },
} as const;

export function SimuladorScmspTab({ especialidades }: Props) {
  const [step, setStep] = useState(0);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [especialidade, setEspecialidade] = useState<EspecialidadeScmsp | null>(null);
  const [objetiva, setObjetiva] = useState<number | "">(70);
  const [curricular, setCurricular] = useState<number | "">(70);
  const [tipoCota, setTipoCota] = useState<TipoCota>("AC");
  const [result, setResult] = useState<SimulationResultScmsp | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const notaFinal = objetiva !== "" && curricular !== "" ? calcNotaFinal(Number(objetiva), Number(curricular)) : null;

  const filtered = especialidades.filter((e) =>
    e.especialidade.toLowerCase().includes(search.toLowerCase())
  );

  function selectEspecialidade(esp: EspecialidadeScmsp) {
    setEspecialidade(esp);
    setSearch(esp.especialidade);
    setShowDropdown(false);
    // If specialty has no N_I vacancies, force AC
    if (!esp.has_ni) setTipoCota("AC");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!especialidade) { setError("Selecione uma especialidade."); return; }
    if (objetiva === "" || Number(objetiva) < 0 || Number(objetiva) > 100) {
      setError("Insira uma nota objetiva válida (0–100)."); return;
    }
    if (curricular === "" || Number(curricular) < 0 || Number(curricular) > 100) {
      setError("Insira uma nota de análise curricular válida (0–100)."); return;
    }

    startTransition(async () => {
      try {
        const res = await runSimulationScmsp(especialidade.especialidade, notaFinal!, tipoCota);
        setResult(res);
        setStep(1);
      } catch {
        setError("Erro ao processar simulação. Tente novamente.");
      }
    });
  }

  function handleReset() {
    setStep(0);
    setResult(null);
    setError("");
  }

  const steps = [
    { title: "Dados da Simulação",  description: "Selecione a especialidade e suas notas" },
    { title: "Resultado SCMSP 2026", description: "Análise de aprovação e probabilidade" },
  ];

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className="text-center">
        <h2 className="text-xl font-extrabold text-[#37474F]">Simulador SCMSP 2026</h2>
        <p className="text-sm text-gray-500 mt-1">
          Santa Casa de Misericórdia de São Paulo · Processo Seletivo 2026
        </p>
        <div className="inline-flex items-center gap-1.5 bg-[#009688]/10 rounded-full px-3 py-1 text-xs mt-2 text-[#009688] font-medium">
          <span className="w-1.5 h-1.5 bg-[#009688] rounded-full animate-pulse" />
          SCMSP · {especialidades.reduce((s, e) => s + e.vagas_total, 0)} Vagas · {especialidades.length} Especialidades
        </div>
      </div>

      {/* Scoring formula info */}
      <div className="flex items-start gap-2 bg-[#E0F2F1] rounded-xl px-3 py-2.5 border border-[#B2DFDB]/60">
        <FaInfoCircle className="text-[#009688] text-sm flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-[#37474F] leading-relaxed">
          <span className="font-semibold">Fórmula SCMSP:</span> Nota Final = 90% × Objetiva + 10% × Análise Curricular
        </p>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-2xl shadow-lg shadow-[#009688]/10 border border-[#B2DFDB]/40 overflow-hidden">
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-400">
              Passo {step + 1} de {steps.length}
            </span>
            {step > 0 && (
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-[#009688] hover:text-[#00796B] transition-colors"
              >
                Nova Simulação
              </button>
            )}
          </div>
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  i < step ? "bg-[#009688]" : i === step ? "bg-[#009688]/60" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="px-5 pb-5">
          <ol className="space-y-2">
            {steps.map((s, index) => {
              const isActive    = step === index;
              const isCompleted = step > index;
              const isLocked    = index > step;

              return (
                <li key={s.title}>
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => { if (isCompleted) setStep(index); }}
                    className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all text-left ${
                      isActive    ? "bg-[#009688]/5 border border-[#009688]/20"
                      : isCompleted ? "hover:bg-gray-50 cursor-pointer"
                      : "opacity-50"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <FaCheckCircle className="text-[#009688] text-lg" />
                      ) : (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                          isActive ? "border-[#009688] text-[#009688] bg-[#009688]/10" : "border-gray-300 text-gray-400"
                        }`}>
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${isActive || isCompleted ? "text-[#37474F]" : "text-gray-400"}`}>
                        {s.title}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{s.description}</p>
                    </div>
                    {!isLocked && (
                      <div className="flex-shrink-0 text-gray-400">
                        {isActive ? <FaChevronUp className="text-xs text-[#009688]" /> : <FaChevronDown className="text-xs" />}
                      </div>
                    )}
                  </button>

                  {isActive && (
                    <div className="mt-3 pl-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      {index === 0 && (
                        <ScmspForm
                          search={search}
                          setSearch={setSearch}
                          showDropdown={showDropdown}
                          setShowDropdown={setShowDropdown}
                          filtered={filtered}
                          especialidade={especialidade}
                          selectEspecialidade={selectEspecialidade}
                          objetiva={objetiva}
                          setObjetiva={setObjetiva}
                          curricular={curricular}
                          setCurricular={setCurricular}
                          tipoCota={tipoCota}
                          setTipoCota={setTipoCota}
                          notaFinal={notaFinal}
                          error={error}
                          isPending={isPending}
                          onSubmit={handleSubmit}
                        />
                      )}
                      {index === 1 && result && (
                        <ScmspResultPanel result={result} especialidade={especialidade!} />
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

// ── Form sub-component ────────────────────────────────────────────────────────

interface FormProps {
  search: string;
  setSearch: (v: string) => void;
  showDropdown: boolean;
  setShowDropdown: (v: boolean) => void;
  filtered: EspecialidadeScmsp[];
  especialidade: EspecialidadeScmsp | null;
  selectEspecialidade: (e: EspecialidadeScmsp) => void;
  objetiva: number | "";
  setObjetiva: (v: number | "") => void;
  curricular: number | "";
  setCurricular: (v: number | "") => void;
  tipoCota: TipoCota;
  setTipoCota: (v: TipoCota) => void;
  notaFinal: number | null;
  error: string;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

function ScmspForm({
  search, setSearch, showDropdown, setShowDropdown,
  filtered, especialidade, selectEspecialidade,
  objetiva, setObjetiva, curricular, setCurricular,
  tipoCota, setTipoCota, notaFinal, error, isPending, onSubmit,
}: FormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Specialty search */}
      <div className="relative">
        <label className="block text-sm font-semibold text-[#37474F] mb-1.5">Especialidade</label>
        <div className="relative">
          <FaStethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-[#009688] text-sm" />
          <input
            type="text"
            placeholder="Busque sua especialidade..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-[#B2DFDB] bg-white text-[#37474F]
              placeholder-gray-400 focus:outline-none focus:border-[#009688] transition-colors text-sm"
          />
        </div>
        {showDropdown && search && filtered.length > 0 && (
          <ul className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-[#B2DFDB] max-h-52 overflow-y-auto">
            {filtered.map((esp) => (
              <li
                key={esp.especialidade}
                onMouseDown={() => selectEspecialidade(esp)}
                className="px-4 py-2.5 text-sm text-[#37474F] cursor-pointer hover:bg-[#B2DFDB]/30 transition-colors"
              >
                <span className="font-medium">{esp.especialidade}</span>
                <span className="ml-2 text-xs text-gray-400">{esp.vagas_total} vagas · {esp.tipo_acesso}</span>
              </li>
            ))}
          </ul>
        )}
        {showDropdown && search && filtered.length === 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-[#B2DFDB] px-4 py-3 text-sm text-gray-400">
            Nenhuma especialidade encontrada
          </div>
        )}
      </div>

      {/* Selected specialty info badge */}
      {especialidade && (
        <div className="flex items-center gap-2 bg-[#009688]/5 rounded-xl px-3 py-2 border border-[#009688]/15 animate-in fade-in duration-200">
          <FaHospital className="text-[#009688] text-xs flex-shrink-0" />
          <p className="text-xs text-[#37474F]">
            <span className="font-semibold">{especialidade.tipo_acesso}</span>
            <span className="mx-1.5 text-gray-300">·</span>
            {especialidade.vagas_total} vagas ({especialidade.vagas_ac} AC{especialidade.has_ni ? `, ${especialidade.vagas_cotas} cotas` : ""})
            {especialidade.inscritos != null && (
              <><span className="mx-1.5 text-gray-300">·</span>{especialidade.inscritos.toLocaleString("pt-BR")} inscritos</>
            )}
          </p>
        </div>
      )}

      {/* Tipo de Cota */}
      {especialidade?.has_ni && (
        <div className="animate-in fade-in duration-200">
          <label className="block text-sm font-semibold text-[#37474F] mb-1.5">Tipo de Lista</label>
          <div className="flex rounded-xl overflow-hidden border-2 border-[#B2DFDB]">
            {(["AC", "N_I"] as TipoCota[]).map((tipo) => (
              <button
                key={tipo}
                type="button"
                onClick={() => setTipoCota(tipo)}
                className={`flex-1 py-2.5 text-sm font-medium transition-all ${
                  tipoCota === tipo ? "bg-[#009688] text-white" : "bg-white text-[#37474F] hover:bg-[#B2DFDB]/30"
                }`}
              >
                {tipo === "AC" ? "Ampla Concorrência" : "Cota N_I"}
              </button>
            ))}
          </div>
          {tipoCota === "N_I" && (
            <p className="text-[10px] text-gray-400 mt-1 ml-1">
              Cota N_I = candidatos não identificados racialmente (vagas reservadas)
            </p>
          )}
        </div>
      )}

      {/* Score inputs */}
      <div className="space-y-4">
        <ScoreInput
          label="Nota Objetiva"
          value={objetiva}
          onChange={setObjetiva}
          weight="90%"
        />
        <ScoreInput
          label="Análise Curricular"
          value={curricular}
          onChange={setCurricular}
          weight="10%"
        />
      </div>

      {/* Nota Final preview */}
      {notaFinal !== null && (
        <div className="bg-[#009688]/8 rounded-xl px-4 py-3 flex items-center justify-between animate-in fade-in duration-200 border border-[#009688]/15">
          <div>
            <p className="text-xs font-semibold text-[#009688] uppercase tracking-wide">Nota Final Calculada</p>
            <p className="text-[10px] text-gray-400 mt-0.5">90% × {objetiva} + 10% × {curricular}</p>
          </div>
          <p className="text-3xl font-extrabold text-[#009688]">{notaFinal.toFixed(2)}</p>
        </div>
      )}

      {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3.5 rounded-xl bg-[#009688] text-white font-bold text-base
          hover:bg-[#00796B] active:scale-[0.98] transition-all shadow-md shadow-[#009688]/30
          disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            Simulando...
          </>
        ) : (
          <>
            <FaSearch />
            Simular Aprovação SCMSP
          </>
        )}
      </button>
    </form>
  );
}

function ScoreInput({
  label,
  value,
  onChange,
  weight,
}: {
  label: string;
  value: number | "";
  onChange: (v: number | "") => void;
  weight: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-semibold text-[#37474F]">{label}</label>
        <span className="text-xs font-bold text-[#009688] bg-[#009688]/10 px-2 py-0.5 rounded-full">
          peso {weight}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={value === "" ? 0 : value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-[#009688] cursor-pointer"
        />
        <input
          type="number"
          min={0}
          max={100}
          step={0.5}
          placeholder="0"
          value={value}
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          className="w-20 px-2 py-2 rounded-xl border-2 border-[#B2DFDB] bg-white text-[#37474F]
            focus:outline-none focus:border-[#009688] transition-colors text-sm font-bold text-center"
        />
      </div>
    </div>
  );
}

// ── Result sub-component ──────────────────────────────────────────────────────

function ScmspResultPanel({ result, especialidade }: { result: SimulationResultScmsp; especialidade: EspecialidadeScmsp }) {
  const prob = PROB_CONFIG[result.probabilidade];

  const rankPct = result.total_habilitados > 0
    ? Math.round((1 - (result.ranking_estimado - 1) / result.total_habilitados) * 100)
    : 0;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Verdict card */}
      <div className={`rounded-2xl p-4 border-2 ${
        result.aprovado
          ? "bg-[#E0F2F1] border-[#009688]/30"
          : "bg-[#FFEBEE] border-red-200"
      }`}>
        <div className="flex items-center gap-3">
          {result.aprovado ? (
            <FaCheckCircle className="text-3xl text-[#009688] flex-shrink-0" />
          ) : (
            <FaTimesCircle className="text-3xl text-red-400 flex-shrink-0" />
          )}
          <div>
            <p className={`text-lg font-extrabold ${result.aprovado ? "text-[#009688]" : "text-red-500"}`}>
              {result.aprovado ? "Aprovado!" : "Não aprovado"}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {result.aprovado
                ? `${result.tipo_cota === "N_I" ? "Dentro das vagas de cota" : "Dentro das vagas AC"}`
                : result.ranking_estimado > result.total_habilitados
                ? `Nota abaixo de todos os ${result.total_habilitados} habilitados`
                : `Ficaria na posição ${result.ranking_estimado}º de ${result.total_habilitados} habilitados`
              }
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-gray-400 font-medium">Probabilidade</p>
            <p className="text-sm font-bold" style={{ color: prob.color }}>{prob.label}</p>
          </div>
        </div>

        {/* Probability bar */}
        <div className="mt-3">
          <div className="h-2 bg-white/60 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${prob.bar}%`, backgroundColor: prob.color }}
            />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        <StatCard icon={<FaTrophy />} label="Classificação" value={result.ranking_estimado > result.total_habilitados ? "Abaixo" : `${result.ranking_estimado}º`} sub={`de ${result.total_habilitados} habilitados`} />
        <StatCard icon={<FaChartBar />} label="Nota de Corte" value={result.nota_corte > 0 ? result.nota_corte.toFixed(2) : "–"} sub={`para ${result.tipo_cota === "N_I" ? `${result.vagas_cotas} vagas cota` : `${result.vagas_total} vagas total`}`} />
        <StatCard icon={<FaStar />} label="Nota Máxima" value={result.nota_maxima.toFixed(2)} sub="1º colocado" />
        <StatCard icon={<FaUsers />} label="Nota Média" value={result.nota_media.toFixed(2)} sub="habilitados" />
      </div>

      {/* Ranking bar */}
      <div className="bg-white rounded-xl border border-[#B2DFDB]/40 p-3">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>Seu ranking estimado</span>
          <span className="font-bold text-[#009688]">Top {rankPct}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#009688] to-[#4DB6AC]"
            style={{ width: `${Math.max(rankPct, 4)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>1º</span>
          <span>{result.total_habilitados}º</span>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="bg-white rounded-xl border border-[#B2DFDB]/40 p-3 space-y-2">
        <p className="text-xs font-bold text-[#37474F]">Distribuição das notas — {especialidade.especialidade}</p>
        {[
          { label: "Nota Máxima", value: result.nota_maxima, color: "#009688" },
          { label: "Nota de Corte", value: result.nota_corte, color: "#FF9800" },
          { label: "Nota Média", value: result.nota_media, color: "#26A69A" },
          { label: "Nota Mínima", value: result.nota_minima, color: "#90A4AE" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-gray-500 flex-1">{item.label}</span>
            <span className="text-xs font-bold text-[#37474F]">{item.value.toFixed(2)}</span>
            <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${(item.value / 100) * 100}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Vagas breakdown */}
      <div className="bg-white rounded-xl border border-[#B2DFDB]/40 p-3">
        <p className="text-xs font-bold text-[#37474F] mb-2">Distribuição de vagas</p>
        <div className="flex gap-2">
          <div className="flex-1 bg-[#E0F2F1] rounded-lg px-3 py-2 text-center">
            <p className="text-lg font-extrabold text-[#009688]">{result.vagas_total}</p>
            <p className="text-[10px] text-gray-500">Total</p>
          </div>
          <div className="flex-1 bg-[#FFF8E1] rounded-lg px-3 py-2 text-center">
            <p className="text-lg font-extrabold text-[#37474F]">{result.vagas_ac}</p>
            <p className="text-[10px] text-gray-500">Amp. Conc.</p>
          </div>
          {result.vagas_cotas > 0 && (
            <div className="flex-1 bg-[#FFF8E1] rounded-lg px-3 py-2 text-center">
              <p className="text-lg font-extrabold text-[#37474F]">{result.vagas_cotas}</p>
              <p className="text-[10px] text-gray-500">Cotas N_I</p>
            </div>
          )}
          {result.inscritos > 0 && (
            <div className="flex-1 bg-[#FAFAFA] rounded-lg px-3 py-2 text-center">
              <p className="text-lg font-extrabold text-gray-500">{result.inscritos.toLocaleString("pt-BR")}</p>
              <p className="text-[10px] text-gray-400">Inscritos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="bg-[#FFF8E1] rounded-xl p-3">
      <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium mb-1">
        <span className="text-[#009688]">{icon}</span>
        {label}
      </div>
      <p className="text-xl font-extrabold text-[#37474F] leading-none">{value}</p>
      <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}
