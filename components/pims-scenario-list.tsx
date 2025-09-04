"use client"

import { useState, useEffect } from "react"
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
  FileText,
  Download,
  CheckSquare,
  Square,
  Loader2,
} from "lucide-react"
import { 
  internalScenariosData, 
  pimsImportScenarios, 
  type PimsScenario 
} from "@/lib/scenarios-data"
import { 
  getStatusIcon, 
  getStatusText, 
  getStatusBadgeVariant, 
  getStatusBadgeClassName 
} from "@/lib/scenario-utils"


export function PimsScenarioList() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [scenarios, setScenarios] = useState<PimsScenario[]>(internalScenariosData)
  const [isImporting, setIsImporting] = useState(false)
  const [selectedScenarios, setSelectedScenarios] = useState<Set<string>>(new Set())
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const filteredScenarios = scenarios.filter((scenario) => {
    const matchesSearch =
      scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scenario.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || scenario.category === selectedCategory
    return matchesSearch && matchesCategory
  })


  const handlePimsImport = async () => {
    setIsImporting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // 이미 존재하는 PIMS 시나리오 ID들 확인
      const existingIds = new Set(scenarios.map(s => s.id))
      
      // 현재 시간을 안전하게 생성 (hydration 오류 방지)
      const getFormattedTime = () => {
        if (!isMounted) {
          return "2023-09-04 15:30" // 서버 렌더링 시 고정값 사용
        }
        return new Date()
          .toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
          .replace(/\. /g, "-")
          .replace(".", "")
          .replace(",", "")
      }
      
      const currentTime = getFormattedTime()

      // 중복되지 않는 새로운 시나리오만 필터링
      const newScenarios = pimsImportScenarios
        .filter(scenario => !existingIds.has(scenario.id))
        .map((scenario) => ({
          ...scenario,
          lastRun: currentTime,
        }))

      if (newScenarios.length > 0) {
        setScenarios((prev) => [...prev, ...newScenarios])
        console.log(`PIMS에서 ${newScenarios.length}개의 새로운 테스트 시나리오를 성공적으로 불러왔습니다.`)
      } else {
        console.log("모든 PIMS 시나리오가 이미 불러와져 있습니다.")
      }
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
    // 현재 필터된 시나리오들 중에서 선택된 것들의 개수 확인
    const selectedFilteredCount = filteredScenarios.filter(scenario => 
      selectedScenarios.has(scenario.id)
    ).length
    
    if (selectedFilteredCount === filteredScenarios.length && filteredScenarios.length > 0) {
      // 현재 필터된 시나리오들을 모두 해제
      const newSelected = new Set(selectedScenarios)
      filteredScenarios.forEach(scenario => newSelected.delete(scenario.id))
      setSelectedScenarios(newSelected)
    } else {
      // 현재 필터된 시나리오들을 모두 선택
      const newSelected = new Set(selectedScenarios)
      filteredScenarios.forEach(scenario => newSelected.add(scenario.id))
      setSelectedScenarios(newSelected)
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
              <Button variant="ghost" size="sm"></Button>
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
              {(() => {
                const selectedFilteredCount = filteredScenarios.filter(scenario => 
                  selectedScenarios.has(scenario.id)
                ).length
                return selectedFilteredCount === filteredScenarios.length && filteredScenarios.length > 0 ? (
                  <>
                    <CheckSquare className="h-4 w-4 mr-2" />
                    전체 해제
                  </>
                ) : (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    전체 선택
                  </>
                )
              })()}
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
                            variant={getStatusBadgeVariant(scenario.status)}
                            className={getStatusBadgeClassName(scenario.status)}
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
