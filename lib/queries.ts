"use server";

import { supabase } from "./supabase";
import type {
  Especialidade,
  SimulationResult,
  InstitutionResult,
  SpecialtyOverview,
  TipoLista,
} from "./types";

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
