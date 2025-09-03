"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  ArrowLeft,
  Play,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  Loader2,
  CheckSquare,
  Square,
} from "lucide-react"

interface PimsScenario {
  id: string
  title: string
  description: string
  status: "completed" | "failed" | "running" | "ready" | "creating" | "error"
  lastRun: string
  duration: string
  successRate: number
  category: string
}

const initialScenarios: PimsScenario[] = [
  {
    id: "REQ-BL-00001_TS_001",
    title: "정상 창업 지원프로세스 처리",
    description: "사용자 창업 지원 신청 접수부터 승인까지의 전체 프로세스를 검증합니다.",
    status: "completed",
    lastRun: "2023-08-29 14:17",
    duration: "0.2h",
    successRate: 93.3,
    category: "창업지원",
  },
  {
    id: "REQ-BL-00002_TS_002",
    title: "창업 지원 신청 반려 처리",
    description: "부적절한 창업 지원 신청에 대한 반려 프로세스를 검증합니다.",
    status: "failed",
    lastRun: "2023-08-29 13:45",
    duration: "0.15h",
    successRate: 87.5,
    category: "창업지원",
  },
  {
    id: "REQ-BL-00003_TS_003",
    title: "사업자 등록 검증 프로세스",
    description: "사업자 등록번호 유효성 검증 및 중복 확인 프로세스를 테스트합니다.",
    status: "running",
    lastRun: "2023-08-29 15:20",
    duration: "0.3h",
    successRate: 95.2,
    category: "사업자등록",
  },
  {
    id: "REQ-BL-00004_TS_004",
    title: "지원금 지급 프로세스",
    description: "승인된 창업 지원 신청에 대한 지원금 지급 프로세스를 검증합니다.",
    status: "ready",
    lastRun: "2023-08-28 16:30",
    duration: "0.25h",
    successRate: 91.7,
    category: "지원금",
  },
  {
    id: "REQ-BL-00004_TS_005",
    title: "지원금 지급 프로세스2",
    description: "승인된 창업 지원 신청에 대한 지원금 지급 프로세스를 검증합니다.",
    status: "creating",
    lastRun: "2023-08-28 16:30",
    duration: "0.25h",
    successRate: 91.7,
    category: "지원금",
  },
]

const pimsScenarios: PimsScenario[] = [
  {
    id: "PIMS-001_TS_001",
    title: "온라인 사업자 등록 신청",
    description: "온라인을 통한 사업자 등록 신청 프로세스의 전체 워크플로우를 검증합니다.",
    status: "error",
    lastRun: "2023-09-03 10:30",
    duration: "0.4h",
    successRate: 89.2,
    category: "사업자등록",
  },
  {
    id: "PIMS-002_TS_002",
    title: "세무 신고 자동화 프로세스",
    description: "자동화된 세무 신고 시스템의 정확성과 안정성을 검증합니다.",
    status: "creating",
    lastRun: "2023-09-03 10:30",
    duration: "0.6h",
    successRate: 94.7,
    category: "세무",
  },
  {
    id: "PIMS-003_TS_003",
    title: "정부 지원금 신청 통합 프로세스",
    description: "여러 정부 지원금을 통합 신청하는 프로세스의 효율성을 검증합니다.",
    status: "creating",
    lastRun: "2023-09-03 10:30",
    duration: "0.5h",
    successRate: 92.1,
    category: "지원금",
  },
]

export function PimsScenarioList() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [scenarios, setScenarios] = useState<PimsScenario[]>(initialScenarios)
  const [isImporting, setIsImporting] = useState(false)
  const [selectedScenarios, setSelectedScenarios] = useState<Set<string>>(new Set())

  const filteredScenarios = scenarios.filter((scenario) => {
    const matchesSearch =
      scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scenario.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || scenario.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-chart-1" />
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "running":
        return <Play className="h-4 w-4 text-chart-2" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "성공"
      case "failed":
        return "실패"
      case "running":
        return "실행중"
      case "ready":
        return "준비 완료"
      case "creating":
        return "준비중"
      default:
        return "오류"
    }
  }

  const handlePimsImport = async () => {
    setIsImporting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newScenarios = pimsScenarios.map((scenario) => ({
        ...scenario,
        lastRun: new Date()
          .toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
          .replace(/\. /g, "-")
          .replace(".", "")
          .replace(",", ""),
      }))

      setScenarios((prev) => [...prev, ...newScenarios])

      console.log(`PIMS에서 ${newScenarios.length}개의 새로운 테스트 시나리오를 성공적으로 불러왔습니다.`)
    } catch (error) {
      console.error("PIMS 시나리오 불러오기 실패:", error)
    } finally {
      setIsImporting(false)
    }
  }

  const handleScenarioSelect = (scenarioId: string, checked: boolean) => {
    const newSelected = new Set(selectedScenarios)
    if (checked) {
      newSelected.add(scenarioId)
    } else {
      newSelected.delete(scenarioId)
    }
    setSelectedScenarios(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedScenarios.size === filteredScenarios.length) {
      setSelectedScenarios(new Set())
    } else {
      setSelectedScenarios(new Set(filteredScenarios.map((s) => s.id)))
    }
  }

  const handleExecuteSelected = () => {
    console.log(`${selectedScenarios.size}개의 시나리오를 실행합니다:`, Array.from(selectedScenarios))
    // 실제 실행 로직 구현
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-bold text-primary">PIMS 테스트 시나리오</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarFallback>김</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="mb-6 space-y-4 flex justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="시나리오 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["all", "창업지원", "사업자등록", "지원금", "세무"].map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === "all" ? "전체" : category}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              {selectedScenarios.size === filteredScenarios.length ? (
                <>
                  <CheckSquare className="h-4 w-4 mr-2" />
                  전체 해제
                </>
              ) : (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  전체 선택
                </>
              )}
            </Button>

            {selectedScenarios.size > 0 && (
              <Button
                variant="default"
                size="sm"
                onClick={handleExecuteSelected}
                className="bg-chart-2 hover:bg-chart-2/90"
              >
                <Play className="h-4 w-4 mr-2" />
                {selectedScenarios.size}개 시나리오 실행
              </Button>
            )}

            <Button onClick={handlePimsImport} className="bg-primary hover:bg-primary/90" disabled={isImporting}>
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  불러오는 중...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  PIMS에서 불러오기
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredScenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className={`cursor-pointer transition-colors hover:bg-muted/50 hover:border-primary/50 ${
                selectedScenarios.has(scenario.id) ? "border-primary bg-primary/5" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <Checkbox
                      checked={selectedScenarios.has(scenario.id)}
                      onCheckedChange={(checked) => handleScenarioSelect(scenario.id, checked as boolean)}
                      className="mt-1"
                    />

                    <div className="flex-1 space-y-3" onClick={() => router.push(`/test-scenarios/${scenario.id}`)}>
                      <div className="flex items-center gap-2 mb-2">
                        
                        <Badge variant="secondary" className="bg-muted/50 text-muted-foreground text-xs">
                          {scenario.category}
                        </Badge>

                        <Badge variant="outline" className=" text-muted-foreground text-xs">
                          REQ-BL-00001
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3">
                        {getStatusIcon(scenario.status)}
                        <h3 className="font-semibold text-lg">{scenario.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {scenario.id}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground">{scenario.description}</p>

                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">상태:</span>
                          <Badge
                            variant={
                              scenario.status === "completed"
                                ? "default"
                                : scenario.status === "failed"
                                  ? "destructive"
                                  : scenario.status === "running"
                                    ? "secondary"
                                    : "outline"
                            }
                            className={
                              scenario.status === "completed"
                                ? "bg-chart-1/10 text-chart-1 border-chart-1/20"
                                : scenario.status === "failed"
                                  ? "bg-destructive/10 text-destructive border-destructive/20"
                                  : scenario.status === "running"
                                    ? "bg-chart-2/10 text-chart-2 border-chart-2/20"
                                    : ""
                            }
                          >
                            {getStatusText(scenario.status)}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">마지막 실행:</span>
                          <span>{scenario.lastRun}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">소요시간:</span>
                          <span>{scenario.duration}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">성공률:</span>
                          <span className="font-medium">{scenario.successRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/test-scenarios/${scenario.id}`)}>
                      <FileText className="h-4 w-4 mr-2" />
                      상세보기
                    </Button>
                    <Button variant="default" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      실행
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
