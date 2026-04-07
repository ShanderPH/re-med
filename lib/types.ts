// ── SUS-SP types ──────────────────────────────────────────────────────────────

export interface Especialidade {
  especialidade: string;
  total_ac: number;
  total_pcd: number;
}

export interface SimulationResult {
  ranking_estimado: number;
  total_lista: number;
  nota_corte: number;
  total_selecionados: number;
  vagas: number;
  inscritos: number;
  concorrencia: number;
  instituicoes: string[];
  aprovado: boolean;
  chamada: string;
  probabilidade: "muito_alta" | "alta" | "moderada" | "baixa" | "muito_baixa" | "indefinida";
}

export interface InstitutionResult {
  instituicao: string;
  vagas_instituicao: number;
  nota_corte_instituicao: number;
  aprovado_instituicao: boolean;
  chamada_instituicao: string;
}

export interface SpecialtyInstitution {
  instituicao: string;
  vagas: number;
}

export interface SpecialtyOverview {
  especialidade: string;
  vagas: number;
  inscritos: number;
  concorrencia: number;
  nota_corte: number;
  total_selecionados: number;
  instituicoes: SpecialtyInstitution[];
}

export type TipoLista = "Ampla Concorrência" | "Pessoa com Deficiência";

// ── SCMSP 2026 types ──────────────────────────────────────────────────────────

export type TipoCota = "AC" | "N_I";

export interface EspecialidadeScmsp {
  especialidade: string;
  tipo_acesso: string;
  vagas_total: number;
  vagas_ac: number;
  vagas_cotas: number;
  inscritos: number | null;
  concorrencia_val: number | null;
  has_ni: boolean;
}

export interface SimulationResultScmsp {
  ranking_estimado: number;
  total_habilitados: number;
  nota_maxima: number;
  nota_minima: number;
  nota_media: number;
  nota_corte: number;
  vagas_total: number;
  vagas_ac: number;
  vagas_cotas: number;
  inscritos: number;
  concorrencia: number;
  aprovado: boolean;
  probabilidade: "muito_alta" | "alta" | "moderada" | "baixa" | "muito_baixa";
  tipo_cota: TipoCota;
}

export interface SpecialtyOverviewScmsp {
  especialidade: string;
  tipo_acesso: string;
  vagas_total: number;
  vagas_ac: number;
  vagas_cotas: number;
  inscritos: number | null;
  concorrencia_val: number | null;
  candidatos_habilitados: number | null;
  nota_maxima: number | null;
  nota_minima: number | null;
  nota_media: number | null;
}
