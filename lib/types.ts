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
