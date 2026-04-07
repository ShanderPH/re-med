"use server";

import { supabase } from "./supabase";
import type {
  Especialidade,
  SimulationResult,
  InstitutionResult,
  SpecialtyOverview,
  TipoLista,
  EspecialidadeScmsp,
  SimulationResultScmsp,
  SpecialtyOverviewScmsp,
  TipoCota,
} from "./types";

// ── SUS-SP queries ────────────────────────────────────────────────────────────

export async function getEspecialidades(): Promise<Especialidade[]> {
  const { data, error } = await supabase.rpc("get_especialidades");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function runSimulation(
  especialidade: string,
  nota: number,
  tipoLista: TipoLista = "Ampla Concorrência"
): Promise<SimulationResult> {
  const { data, error } = await supabase.rpc("simulate_approval", {
    p_especialidade: especialidade,
    p_nota: nota,
    p_tipo_lista: tipoLista,
  });
  if (error) throw new Error(error.message);
  return data as SimulationResult;
}

export async function runInstitutionSimulation(
  especialidade: string,
  nota: number,
  tipoLista: TipoLista = "Ampla Concorrência"
): Promise<InstitutionResult[]> {
  const { data, error } = await supabase.rpc("simulate_institution", {
    p_especialidade: especialidade,
    p_nota: nota,
    p_tipo_lista: tipoLista,
  });
  if (error) throw new Error(error.message);
  return (data as InstitutionResult[]) ?? [];
}

export async function getSpecialtyOverview(): Promise<SpecialtyOverview[]> {
  const { data, error } = await supabase.rpc("get_specialty_overview");
  if (error) throw new Error(error.message);
  return (data as SpecialtyOverview[]) ?? [];
}

// ── SCMSP 2026 queries ────────────────────────────────────────────────────────

export async function getEspecialidadesScmsp(): Promise<EspecialidadeScmsp[]> {
  const { data, error } = await supabase.rpc("get_especialidades_scmsp");
  if (error) throw new Error(error.message);
  return (data as EspecialidadeScmsp[]) ?? [];
}

export async function runSimulationScmsp(
  especialidade: string,
  nota: number,
  tipoCota: TipoCota = "AC"
): Promise<SimulationResultScmsp> {
  const { data, error } = await supabase.rpc("simulate_scmsp", {
    p_especialidade: especialidade,
    p_nota: nota,
    p_tipo_cota: tipoCota,
  });
  if (error) throw new Error(error.message);
  return data as SimulationResultScmsp;
}

export async function getSpecialtyOverviewScmsp(): Promise<SpecialtyOverviewScmsp[]> {
  const { data, error } = await supabase.rpc("get_specialty_overview_scmsp");
  if (error) throw new Error(error.message);
  return (data as SpecialtyOverviewScmsp[]) ?? [];
}
