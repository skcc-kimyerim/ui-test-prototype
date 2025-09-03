import { PimsScenarioDetail } from "@/components/pims-scenario-detail"

interface PimsScenarioPageProps {
  params: {
    id: string
  }
}

export default function PimsScenarioPage({ params }: PimsScenarioPageProps) {
  return <PimsScenarioDetail scenarioId={params.id} />
}
