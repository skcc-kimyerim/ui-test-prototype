import { PimsScenarioDetail } from "@/components/pims-scenario-detail"

interface PimsScenarioPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PimsScenarioPage({ params }: PimsScenarioPageProps) {
  const { id } = await params
  return <PimsScenarioDetail scenarioId={id} />
}
