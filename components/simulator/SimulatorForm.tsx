"use client";

import { useState, useTransition } from "react";
import { FaSearch, FaStethoscope } from "react-icons/fa";
import type { Especialidade, SimulationResult, TipoLista } from "@/lib/types";
import { runSimulation } from "@/lib/queries";

interface Props {
  especialidades: Especialidade[];
  onResult: (result: SimulationResult, especialidade: string, nota: number, tipoLista: TipoLista) => void;
}

export function SimulatorForm({ especialidades, onResult }: Props) {
  const [especialidade, setEspecialidade] = useState("");
  const [nota, setNota] = useState<number | "">("");
  const [tipoLista, setTipoLista] = useState<TipoLista>("Ampla Concorrência");
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = especialidades.filter((e) =>
    e.especialidade.toLowerCase().includes(search.toLowerCase())
  );

  function selectEspecialidade(esp: string) {
    setEspecialidade(esp);
    setSearch(esp);
    setShowDropdown(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!especialidade) {
      setError("Selecione uma especialidade.");
      return;
    }
    if (nota === "" || nota < 0 || nota > 100) {
      setError("Insira uma nota válida entre 0 e 100.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await runSimulation(especialidade, Number(nota), tipoLista);
        onResult(result, especialidade, Number(nota), tipoLista);
      } catch {
        setError("Erro ao processar simulação. Tente novamente.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Specialty search */}
      <div className="relative">
        <label className="block text-sm font-semibold text-[#37474F] mb-1.5">
          Especialidade
        </label>
        <div className="relative">
          <FaStethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-[#009688] text-sm" />
          <input
            type="text"
            placeholder="Busque sua especialidade..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setEspecialidade("");
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-[#B2DFDB] bg-white text-[#37474F] placeholder-gray-400
              focus:outline-none focus:border-[#009688] transition-colors text-sm"
          />
        </div>

        {showDropdown && search && filtered.length > 0 && (
          <ul className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-[#B2DFDB] max-h-52 overflow-y-auto">
            {filtered.map((esp) => (
              <li
                key={esp.especialidade}
                onMouseDown={() => selectEspecialidade(esp.especialidade)}
                className="px-4 py-2.5 text-sm text-[#37474F] cursor-pointer hover:bg-[#B2DFDB]/30 transition-colors"
              >
                <span className="font-medium">{esp.especialidade}</span>
                <span className="ml-2 text-xs text-gray-400">
                  {esp.total_ac} candidatos AC
                </span>
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

      {/* List type toggle */}
      <div>
        <label className="block text-sm font-semibold text-[#37474F] mb-1.5">
          Tipo de Lista
        </label>
        <div className="flex rounded-xl overflow-hidden border-2 border-[#B2DFDB]">
          {(["Ampla Concorrência", "Pessoa com Deficiência"] as TipoLista[]).map((tipo) => (
            <button
              key={tipo}
              type="button"
              onClick={() => setTipoLista(tipo)}
              className={`flex-1 py-2.5 text-sm font-medium transition-all ${
                tipoLista === tipo
                  ? "bg-[#009688] text-white"
                  : "bg-white text-[#37474F] hover:bg-[#B2DFDB]/30"
              }`}
            >
              {tipo === "Ampla Concorrência" ? "Ampla Concorrência" : "PCD"}
            </button>
          ))}
        </div>
      </div>

      {/* Nota input */}
      <div>
        <label className="block text-sm font-semibold text-[#37474F] mb-1.5">
          Sua Nota{" "}
          <span className="font-normal text-gray-400 text-xs">(0 – 100)</span>
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={100}
            step={0.5}
            value={nota === "" ? 0 : nota}
            onChange={(e) => setNota(Number(e.target.value))}
            className="w-full accent-[#009688] cursor-pointer"
          />
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={100}
              step={0.5}
              placeholder="Ex: 75"
              value={nota}
              onChange={(e) =>
                setNota(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full px-4 py-3 rounded-xl border-2 border-[#B2DFDB] bg-white text-[#37474F]
                focus:outline-none focus:border-[#009688] transition-colors text-sm font-mono text-center text-lg font-bold"
            />
            <div className="text-2xl font-bold text-[#009688] min-w-[3rem] text-center">
              {nota !== "" ? Number(nota).toFixed(1) : "–"}
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      {/* Submit */}
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
            Simular Aprovação
          </>
        )}
      </button>
    </form>
  );
}
