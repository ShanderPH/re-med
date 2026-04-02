import { getEspecialidades, getSpecialtyOverview } from "@/lib/queries";
import { SimulatorClient } from "./SimulatorClient";

export const dynamic = "force-dynamic";

export default async function SimuladorPage() {
  const [especialidades, specialtyOverview] = await Promise.all([
    getEspecialidades(),
    getSpecialtyOverview(),
  ]);
  return (
    <SimulatorClient
      especialidades={especialidades}
      specialtyOverview={specialtyOverview}
    />
  );
}
