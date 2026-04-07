import {
  getEspecialidades,
  getSpecialtyOverview,
  getEspecialidadesScmsp,
  getSpecialtyOverviewScmsp,
} from "@/lib/queries";
import { SimulatorClient } from "./SimulatorClient";

export const dynamic = "force-dynamic";

export default async function SimuladorPage() {
  const [especialidades, specialtyOverview, especialidadesScmsp, specialtyOverviewScmsp] =
    await Promise.all([
      getEspecialidades(),
      getSpecialtyOverview(),
      getEspecialidadesScmsp(),
      getSpecialtyOverviewScmsp(),
    ]);

  return (
    <SimulatorClient
      especialidades={especialidades}
      specialtyOverview={specialtyOverview}
      especialidadesScmsp={especialidadesScmsp}
      specialtyOverviewScmsp={specialtyOverviewScmsp}
    />
  );
}
