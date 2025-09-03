"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Play,
  FileText,
  Plus,
  Search,
  Filter,
  X,
  Download,
  Code,
  Copy,
  Users,
  MoreHorizontal,
  Edit,
  Trash2,
  RefreshCw,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Database,
} from "lucide-react"

export function TestDashboard() {
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [showCodeGenerator, setShowCodeGenerator] = useState(false)
  const [showSampleReport, setShowSampleReport] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPimsModal, setShowPimsModal] = useState(false)
  const [pimsRegistrationData, setPimsRegistrationData] = useState(null)
  const [editingScenario, setEditingScenario] = useState(null)
  const [generatedCode, setGeneratedCode] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionLogs, setExecutionLogs] = useState([])

  const [newScenario, setNewScenario] = useState({
    category: "",
    title: "",
    details: "",
    testData: "",
    expectedResult: "",
    priority: "Simple",
    functional: "Functional",
    duration: "",
    regressionTest: false,
  })

  const handleAddNewScenario = () => {
    setNewScenario({
      category: "",
      title: "",
      details: "",
      testData: "",
      expectedResult: "",
      priority: "Simple",
      functional: "Functional",
      duration: "",
      regressionTest: false,
    })
    setShowAddModal(true)
  }

  const handleSaveNewScenario = () => {
    const scenario = {
      ...newScenario,
      id: `REQ-NEW-${String(Date.now()).slice(-5)}_TS_001`,
      status: "pending",
      successRate: 0,
      assignees: ["김개발", "박테스터"],
    }
    console.log("[v0] Adding new scenario:", scenario)
    setShowAddModal(false)
    setNewScenario({
      category: "",
      title: "",
      details: "",
      testData: "",
      expectedResult: "",
      priority: "Simple",
      functional: "Functional",
      duration: "",
      regressionTest: false,
    })
  }

  const handlePimsRegistration = (scenario) => {
    setPimsRegistrationData({
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      status: scenario.status,
      lastExecuted: scenario.lastExecuted,
      successRate: scenario.successRate,
      failureDetails: scenario.status === "failed" ? "요소를 찾을 수 없음: #submit-button" : null,
    })
    setShowPimsModal(true)
  }

  const submitToPims = () => {
    // Simulate PIMS registration
    console.log("[v0] PIMS 등록 데이터:", pimsRegistrationData)

    // Update scenario PIMS status
    const updatedScenarios = testScenarios.map((scenario) =>
      scenario.id === pimsRegistrationData.scenarioId ? { ...scenario, pimsStatus: "registered" } : scenario,
    )

    // Add activity log
    const newActivity = {
      user: "시스템",
      action: `테스트 결과 PIMS 등록 완료: ${pimsRegistrationData.scenarioTitle}`,
      time: new Date().toLocaleString("ko-KR"),
      type: "pims",
      result: "등록완료",
      duration: "1초",
    }

    setShowPimsModal(false)
    setPimsRegistrationData(null)
  }

  const testScenarios = [
    {
      id: "REQ-BL-00001_TS_001",
      title: "정상 창업 지원프로세스 처리",
      category: "창업프로세스",
      priority: "Simple",
      functional: "Functional",
      riskScore: 55,
      duration: "0.2h",
      status: "completed",
      lastExecuted: "2023-08-29 14:17",
      executionCount: 15,
      successRate: 93.3,
      assignees: ["김철수", "이영희", "박민수"],
      details:
        "1. 사용자 창업 페이지 접근 확인하기 2. 필수 입력항목(고객정보, 보험료, 보험료 등)을 입력한다. 3. 창업 지원정보 내용을 확인한다.",
      testData: "고객명: 홍길동, 상품코드: 1002003001, 보험료: 50000",
      expectedResult: "창업 지원프로세스가 정상적으로 완료되고, 창업정보 및 결과가 화면에 표시됨",
      requirements: ["REQ-017", "REQ-017", "REQ-017", "REQ-017", "REQ-017"],
      actualResults: ["REQ-017", "REQ-017", "REQ-017", "REQ-017"],
      processResults: ["REQ-017", "REQ-017", "REQ-017", "REQ-017", "REQ-017", "REQ-017"],
      pimsStatus: "registered",
      regressionTest: true,
    },
    {
      id: "REQ-BL-00001_TS_002",
      title: "필수 입력값 누락 시 오류 처리",
      category: "창업프로세스",
      priority: "Simple",
      functional: "Functional",
      riskScore: 55,
      duration: "0.15h",
      status: "failed",
      lastExecuted: "2023-08-29 13:45",
      executionCount: 8,
      successRate: 75.0,
      assignees: ["김철수", "이영희"],
      details: "1. 창업 화면에서 고객정보(성, 성명정보)를 입력하지 않고 2. 오류 메시지가 노출 및 화면 처리 확인한다.",
      testData: "고객명: 홍길동, 상품코드: 1002003001, 보험료: 50000, 성명정보: ''",
      expectedResult: "'필수값은 0자리 이상 입력해' 등 오류 메시지가 노출, 창업 진행 불가",
      requirements: ["REQ-017", "REQ-017", "REQ-017", "REQ-017", "REQ-017"],
      actualResults: ["REQ-017", "REQ-017"],
      processResults: ["REQ-017", "REQ-017"],
      pimsStatus: "pending",
      regressionTest: false,
    },
    {
      id: "REQ-BL-00001_TS_003",
      title: "유효하지 않은 데이터 입력 시 오류 처리",
      category: "창업프로세스",
      priority: "Simple",
      functional: "Functional",
      riskScore: 55,
      duration: "0.1h",
      status: "running",
      lastExecuted: "2023-08-29 15:30",
      executionCount: 3,
      successRate: 66.7,
      assignees: ["박민수"],
      details: "개인정보 창업 지원프로세스 유효 오류 검증",
      testData: "",
      expectedResult: "",
      requirements: [],
      actualResults: [],
      processResults: [],
      pimsStatus: "not_registered",
      regressionTest: true,
    },
  ]

  const activities = [
    {
      user: "김철수",
      action: "테스트 시나리오 REQ-BL-00001_TS_001 실행 완료",
      time: "2023년 8월 29일 오후 2:17",
      type: "completed",
      result: "성공",
      duration: "12초",
    },
    {
      user: "이영희",
      action: "테스트 시나리오 REQ-BL-00001_TS_002 실행 실패",
      time: "2023년 8월 29일 오후 1:45",
      type: "failed",
      result: "실패",
      duration: "8초",
      error: "요소를 찾을 수 없음: #submit-button",
    },
    {
      user: "박민수",
      action: "회귀 테스트 자동 실행 시작",
      time: "2023년 8월 29일 오후 1:30",
      type: "running",
      result: "진행중",
      duration: "진행중",
    },
    {
      user: "김철수",
      action: "PIMS 시스템에 테스트 결과 등록",
      time: "2023년 8월 29일 오후 1:15",
      type: "pims",
      result: "등록완료",
      duration: "2초",
    },
  ]

  const sampleExecutionLogs = [
    {
      step: 1,
      action: "페이지 로드",
      status: "completed",
      duration: "1.2s",
      screenshot: true,
    },
    {
      step: 2,
      action: "로그인 폼 입력",
      status: "completed",
      duration: "0.8s",
      screenshot: true,
    },
    {
      step: 3,
      action: "제출 버튼 클릭",
      status: "running",
      duration: "진행중",
      screenshot: false,
    },
    {
      step: 4,
      action: "결과 확인",
      status: "pending",
      duration: "-",
      screenshot: false,
    },
  ]

  const filteredScenarios = testScenarios.filter((scenario) => {
    const matchesSearch =
      scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scenario.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || scenario.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const generatePlaywrightCode = (scenario) => {
    if (!scenario) return ""

    const steps = scenario.details.split(/\d+\./).filter((step) => step.trim())

    const code = `import { test, expect } from '@playwright/test';

test('${scenario.title}', async ({ page }) => {
  // Test Case: ${scenario.id}
  // Category: ${scenario.category}
  
  ${steps
    .map((step, index) => {
      const cleanStep = step.trim()
      return `  // Step ${index + 1}: ${cleanStep}
  // TODO: Implement step - ${cleanStep}`
    })
    .join("\n\n")}
  
  // Test Data: ${scenario.testData}
  // Expected Result: ${scenario.expectedResult}
  
  // Verify test completion
  // TODO: Add final assertions
});`

    return code
  }

  const handleGenerateCode = (scenario) => {
    const code = generatePlaywrightCode(scenario)
    setGeneratedCode(code)
    setShowCodeGenerator(true)
  }

  const handleExecuteTest = (scenario) => {
    setIsExecuting(true)
    setExecutionLogs(sampleExecutionLogs)
    // Simulate test execution
    setTimeout(() => {
      setIsExecuting(false)
    }, 5000)
  }

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(generatedCode)
  }

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: "text/javascript" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedScenario?.id || "test"}.spec.js`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const showReport = () => {
    setShowSampleReport(true)
  }

  const handleEditScenario = (scenario) => {
    setEditingScenario({ ...scenario })
    setShowEditModal(true)
  }

  const handleSaveEditedScenario = () => {
    // In a real app, this would update the scenario in the backend
    console.log("[v0] Saving edited scenario:", editingScenario)
    setShowEditModal(false)
    setEditingScenario(null)
  }

  const handleAddScenario = (newScenario) => {
    const scenario = {
      ...newScenario,
      id: `REQ-NEW-${String(Date.now()).slice(-5)}_TS_001`,
      status: "pending",
      priority: newScenario.priority || "medium",
      assignee: "현재 사용자",
      createdAt: new Date().toISOString().split("T")[0],
      successRate: 0,
      lastRun: null,
    }

    // In a real app, this would be an API call
    console.log("[v0] Adding new scenario:", scenario)
    setShowAddModal(false)
  }

  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </Button>
              <h1 className="text-xl font-bold text-primary">Davis</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/test-scenarios")}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                피드백 반영 페이지
              </Button>
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>김</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar - Enhanced Test Scenarios List */}
        <div className="w-80 border-r bg-card flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-primary">프로젝트 1</h2>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Active
              </Badge>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="flex -space-x-1">
                {["김철수", "이영희", "박민수"].map((name, i) => (
                  <Avatar key={i} className="h-6 w-6 border-2 border-background">
                    <AvatarFallback className="text-xs">{name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">+12 others</span>
              <Button size="sm" className="ml-auto bg-primary hover:bg-primary/90">
                Share
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 border-b">
              <div className="space-y-2">
                <Button
                  size="sm"
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => {
                    console.log("[v0] Starting bulk test execution")
                    // Bulk execution logic would go here
                  }}
                >
                  <Play className="h-4 w-4 mr-2" />
                  전체 시나리오 실행
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-primary/20 hover:bg-primary/5 bg-transparent"
                  onClick={() => {
                    console.log("[v0] Starting failed tests re-execution")
                    // Re-run failed tests logic would go here
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  실패 테스트 재실행
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 border-b space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="시나리오 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="completed">완료</SelectItem>
                <SelectItem value="failed">실패</SelectItem>
                <SelectItem value="running">실행중</SelectItem>
                <SelectItem value="pending">대기</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 border-b">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-medium">테스트 시나리오 항목 </h3>
              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                {filteredScenarios.length}
              </Badge>
              <Button variant="ghost" size="sm" className="ml-auto" onClick={handleAddNewScenario}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-2 space-y-2">
              {filteredScenarios.map((scenario) => (
                <Card
                  key={scenario.id}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedScenario?.id === scenario.id ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setSelectedScenario(scenario)}
                >
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm leading-tight">{scenario.title}</h4>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditScenario(scenario)
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{scenario.details}</p>

                      <div className="flex items-center justify-between">
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
                          className={`text-xs ${
                            scenario.status === "completed"
                              ? "bg-chart-1/10 text-chart-1 border-chart-1/20"
                              : scenario.status === "failed"
                                ? "bg-destructive/10 text-destructive border-destructive/20"
                                : scenario.status === "running"
                                  ? "bg-chart-2/10 text-chart-2 border-chart-2/20"
                                  : ""
                          }`}
                        >
                          {scenario.status === "completed"
                            ? "완료"
                            : scenario.status === "failed"
                              ? "실패"
                              : scenario.status === "running"
                                ? "실행중"
                                : "대기"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">성공률: {scenario.successRate}%</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-1">
                          {scenario.assignees.slice(0, 3).map((assignee, i) => (
                            <Avatar key={i} className="h-5 w-5 border border-background">
                              <AvatarFallback className="text-xs">{assignee[0]}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <div className="flex items-center gap-1">
                          {scenario.regressionTest && (
                            <Badge variant="outline" className="text-xs bg-chart-3/10 text-chart-3 border-chart-3/20">
                              회귀
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              scenario.pimsStatus === "registered"
                                ? "bg-chart-1/10 text-chart-1 border-chart-1/20"
                                : scenario.pimsStatus === "pending"
                                  ? "bg-chart-2/10 text-chart-2 border-chart-2/20"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            PIMS
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Center Content - Enhanced Scenario Details with Execution */}
        <div className="flex-1 flex flex-col">
          {selectedScenario ? (
            <>
              <div className="p-6 border-b">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-xl font-semibold mb-2">{selectedScenario.title}</h1>
                    <p className="text-sm text-muted-foreground mb-3">{selectedScenario.id}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">카테고리</span>
                        <span>{selectedScenario.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">수행시간</span>
                        <span>{selectedScenario.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">실행횟수</span>
                        <span>{selectedScenario.executionCount}회</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">마지막 실행</span>
                        <span>{selectedScenario.lastExecuted}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">생성일</span>
                        <span>{selectedScenario.lastExecuted}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePimsRegistration(selectedScenario)}
                      className="bg-transparent"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      PIMS 등록
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Play className="h-4 w-4 mr-2" />
                      테스트 실행
                    </Button>
                    <Button variant="outline" size="sm" onClick={showReport} className="bg-transparent">
                      <FileText className="h-4 w-4 mr-2" />
                      보고서
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">성공률</span>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${selectedScenario.successRate}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{selectedScenario.successRate}%</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-6 p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">시나리오</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{selectedScenario.details}</p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">테스트 데이터</h3>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-sm font-mono">{selectedScenario.testData}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">예상 결과</h3>
                      <p className="text-sm text-muted-foreground">{selectedScenario.expectedResult}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-4">
                      <Button
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => handleGenerateCode(selectedScenario)}
                      >
                        <Code className="h-4 w-4 mr-2" />
                        코드 생성
                      </Button>
                      <Button
                        variant="outline"
                        className="border-primary/20 hover:bg-primary/5 bg-transparent"
                        onClick={() => handleExecuteTest(selectedScenario)}
                        disabled={isExecuting}
                      >
                        {isExecuting ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4 mr-2" />
                        )}
                        {isExecuting ? "실행중" : "실행"}
                      </Button>
                      <Button variant="outline" className="border-primary/20 hover:bg-primary/5 bg-transparent">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        재실행
                      </Button>
                      <Button
                        variant="outline"
                        className="border-primary/20 hover:bg-primary/5 bg-transparent"
                        onClick={showReport}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        보고서
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">실행 로그</h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {(isExecuting ? executionLogs : sampleExecutionLogs).map((log, i) => (
                              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                  {log.step}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{log.action}</span>
                                    {log.status === "completed" && <CheckCircle className="h-4 w-4 text-chart-1" />}
                                    {log.status === "running" && (
                                      <RefreshCw className="h-4 w-4 text-chart-2 animate-spin" />
                                    )}
                                    {log.status === "failed" && <XCircle className="h-4 w-4 text-destructive" />}
                                    {log.status === "pending" && <Clock className="h-4 w-4 text-muted-foreground" />}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    소요시간: {log.duration}
                                    {log.screenshot && " • 스크린샷 저장됨"}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">요구사항 추적</h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-muted-foreground">요구사항 ID</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedScenario.requirements.map((req, i) => (
                              <Badge key={i} variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/20">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">실제결과 ID</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedScenario.actualResults.map((result, i) => (
                              <Badge key={i} variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                                {result}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>테스트 시나리오를 선택하여 상세 정보를 확인하세요</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Enhanced Activity & Statistics */}
        <div className="w-80 border-l bg-card flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-medium mb-4">테스트 통계</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Circular Progress Chart */}
              <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 mb-2">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-muted stroke-current"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-primary stroke-current"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray="87.5, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">87.5%</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">전체 성공률</span>
              </div>

              {/* Bar Chart */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">성공</span>
                  <span className="font-medium">14</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-chart-1 h-2 rounded-full" style={{ width: "87.5%" }}></div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">실패</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-destructive h-2 rounded-full" style={{ width: "12.5%" }}></div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">진행중</span>
                  <span className="font-medium">1</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-chart-2 h-2 rounded-full" style={{ width: "6.25%" }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-b">
            <h3 className="font-medium mb-3">회귀 테스트</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">마지막 실행</span>
                <span>2023-08-29 14:17</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">성공률</span>
                <span className="text-chart-1 font-medium">93.3%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">실패 건수</span>
                <span className="text-destructive font-medium">2건</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-primary/20 hover:bg-primary/5 bg-transparent"
                onClick={() => {
                  console.log("[v0] Starting regression test")
                  // Regression test logic would go here
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                회귀 테스트 실행
              </Button>
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">실패 알림</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  2개의 회귀 테스트가 실패했습니다. PIMS에 등록이 필요합니다.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-2 border-destructive/20 hover:bg-destructive/5 bg-transparent"
                  onClick={() => {
                    console.log("[v0] Bulk PIMS registration for failed tests")
                    // Bulk PIMS registration logic would go here
                  }}
                >
                  <Database className="h-4 w-4 mr-2" />
                  실패 테스트 PIMS 등록
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">실행 이력 & 활동</h3>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                테스트 결과 통계
              </h4>
              <Card>
                <CardContent className="p-3">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                      <div className="text-lg font-semibold text-chart-1">14</div>
                      <div className="text-xs text-muted-foreground">성공</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-destructive">2</div>
                      <div className="text-xs text-muted-foreground">실패</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                최근 활동
              </h4>
              <div className="space-y-3">
                {activities.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{activity.user[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{activity.user}</span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            activity.type === "completed"
                              ? "bg-chart-1/10 text-chart-1 border-chart-1/20"
                              : activity.type === "failed"
                                ? "bg-destructive/10 text-destructive border-destructive/20"
                                : activity.type === "running"
                                  ? "bg-chart-2/10 text-chart-2 border-chart-2/20"
                                  : activity.type === "pims"
                                    ? "bg-chart-3/10 text-chart-3 border-chart-3/20"
                                    : ""
                          }`}
                        >
                          {activity.result}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{activity.action}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{activity.time}</span>
                        <span>•</span>
                        <span>소요: {activity.duration}</span>
                      </div>
                      {activity.error && <p className="text-xs text-destructive mt-1">{activity.error}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">PIMS 연계 상태</h4>
              <Card>
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">등록된 결과</span>
                      <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                        12건
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">대기중</span>
                      <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                        3건
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">오류</span>
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                        1건
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 bg-transparent"
                      onClick={() => {
                        const failedScenarios = testScenarios.filter((s) => s.status === "failed")
                        if (failedScenarios.length > 0) {
                          handlePimsRegistration(failedScenarios[0])
                        }
                      }}
                    >
                      <Database className="h-4 w-4 mr-2" />
                      실패 결과 일괄 등록
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h4 className="font-medium mb-3">회귀 테스트</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>자동 실행</span>
                  <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                    활성화
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">UI 변경 감지 시 자동으로 회귀 테스트가 실행됩니다.</div>
                <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  수동 실행
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Generator Modal */}
      {showCodeGenerator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[80vh] m-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary">생성된 Playwright 코드</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/20 hover:bg-primary/5 bg-transparent"
                    onClick={copyCodeToClipboard}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    복사
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/20 hover:bg-primary/5 bg-transparent"
                    onClick={downloadCode}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    다운로드
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowCodeGenerator(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm overflow-auto max-h-96">
                <pre className="whitespace-pre-wrap">{generatedCode}</pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sample Report Modal */}
      {showSampleReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-6xl max-h-[90vh] m-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary">테스트 실행 보고서</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5 bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    PDF 다운로드
                  </Button>
                  <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5 bg-transparent">
                    <Database className="h-4 w-4 mr-2" />
                    PIMS에 등록
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowSampleReport(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="overflow-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Report Header */}
                <div className="border-b pb-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">테스트 개요</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">프로젝트:</span>
                          <span>UI 테스트 자동화</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">실행 일시:</span>
                          <span>2023-08-29 14:17:32</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">실행자:</span>
                          <span>김철수</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">총 소요시간:</span>
                          <span>2분 34초</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">실행 결과</h3>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-chart-1/10 rounded-lg p-3">
                          <div className="text-2xl font-bold text-chart-1">14</div>
                          <div className="text-xs text-muted-foreground">성공</div>
                        </div>
                        <div className="bg-destructive/10 rounded-lg p-3">
                          <div className="text-2xl font-bold text-destructive">2</div>
                          <div className="text-xs text-muted-foreground">실패</div>
                        </div>
                        <div className="bg-chart-2/10 rounded-lg p-3">
                          <div className="text-2xl font-bold text-chart-2">87.5%</div>
                          <div className="text-xs text-muted-foreground">성공률</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Test Results Table */}
                <div>
                  <h3 className="font-semibold mb-3">테스트 시나리오 실행 결과</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr className="text-left">
                          <th className="p-3 text-sm font-medium">시나리오 ID</th>
                          <th className="p-3 text-sm font-medium">시나리오명</th>
                          <th className="p-3 text-sm font-medium">실행 결과</th>
                          <th className="p-3 text-sm font-medium">소요시간</th>
                          <th className="p-3 text-sm font-medium">오류 내용</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-3 text-sm">REQ-BL-00001_TS_001</td>
                          <td className="p-3 text-sm">정상 창업 지원프로세스 처리</td>
                          <td className="p-3">
                            <Badge className="bg-chart-1/10 text-chart-1 border-chart-1/20">성공</Badge>
                          </td>
                          <td className="p-3 text-sm">12.3초</td>
                          <td className="p-3 text-sm text-muted-foreground">-</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-3 text-sm">REQ-BL-00001_TS_002</td>
                          <td className="p-3 text-sm">필수 입력값 누락 시 오류 처리</td>
                          <td className="p-3">
                            <Badge
                              variant="destructive"
                              className="bg-destructive/10 text-destructive border-destructive/20"
                            >
                              실패
                            </Badge>
                          </td>
                          <td className="p-3 text-sm">8.7초</td>
                          <td className="p-3 text-sm text-destructive">요소를 찾을 수 없음: #submit-button</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-3 text-sm">REQ-BL-00001_TS_003</td>
                          <td className="p-3 text-sm">유효하지 않은 데이터 입력 시 오류 처리</td>
                          <td className="p-3">
                            <Badge className="bg-chart-1/10 text-chart-1 border-chart-1/20">성공</Badge>
                          </td>
                          <td className="p-3 text-sm">15.2초</td>
                          <td className="p-3 text-sm text-muted-foreground">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">시각적 회귀 테스트 결과</h3>
                  <div className="space-y-4">
                    {/* Regression Test Summary */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">회귀 테스트 개요</h4>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-chart-1/10 text-chart-1 border-chart-1/20">전체 통과</Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div className="bg-chart-1/10 rounded-lg p-3">
                          <div className="text-xl font-bold text-chart-1">12</div>
                          <div className="text-xs text-muted-foreground">시각적 일치</div>
                        </div>
                        <div className="bg-chart-3/10 rounded-lg p-3">
                          <div className="text-xl font-bold text-chart-3">3</div>
                          <div className="text-xs text-muted-foreground">미세한 차이</div>
                        </div>
                        <div className="bg-destructive/10 rounded-lg p-3">
                          <div className="text-xl font-bold text-destructive">1</div>
                          <div className="text-xs text-muted-foreground">중대한 차이</div>
                        </div>
                        <div className="bg-chart-2/10 rounded-lg p-3">
                          <div className="text-xl font-bold text-chart-2">75%</div>
                          <div className="text-xs text-muted-foreground">일치율</div>
                        </div>
                      </div>
                    </div>

                    {/* Visual Comparison Results */}
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr className="text-left">
                            <th className="p-3 text-sm font-medium">페이지</th>
                            <th className="p-3 text-sm font-medium">비교 결과</th>
                            <th className="p-3 text-sm font-medium">차이점</th>
                            <th className="p-3 text-sm font-medium">임계값</th>
                            <th className="p-3 text-sm font-medium">상태</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t">
                            <td className="p-3 text-sm">메인 페이지</td>
                            <td className="p-3 text-sm">99.8% 일치</td>
                            <td className="p-3 text-sm text-muted-foreground">차이 없음</td>
                            <td className="p-3 text-sm">95%</td>
                            <td className="p-3">
                              <Badge className="bg-chart-1/10 text-chart-1 border-chart-1/20">통과</Badge>
                            </td>
                          </tr>
                          <tr className="border-t">
                            <td className="p-3 text-sm">로그인 페이지</td>
                            <td className="p-3 text-sm">97.2% 일치</td>
                            <td className="p-3 text-sm text-chart-3">버튼 색상 변경</td>
                            <td className="p-3 text-sm">95%</td>
                            <td className="p-3">
                              <Badge className="bg-chart-3/10 text-chart-3 border-chart-3/20">주의</Badge>
                            </td>
                          </tr>
                          <tr className="border-t">
                            <td className="p-3 text-sm">대시보드</td>
                            <td className="p-3 text-sm">89.1% 일치</td>
                            <td className="p-3 text-sm text-destructive">레이아웃 변경</td>
                            <td className="p-3 text-sm">95%</td>
                            <td className="p-3">
                              <Badge
                                variant="destructive"
                                className="bg-destructive/10 text-destructive border-destructive/20"
                              >
                                실패
                              </Badge>
                            </td>
                          </tr>
                          <tr className="border-t">
                            <td className="p-3 text-sm">설정 페이지</td>
                            <td className="p-3 text-sm">100% 일치</td>
                            <td className="p-3 text-sm text-muted-foreground">차이 없음</td>
                            <td className="p-3 text-sm">95%</td>
                            <td className="p-3">
                              <Badge className="bg-chart-1/10 text-chart-1 border-chart-1/20">통과</Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Visual Diff Screenshots */}
                    <div>
                      <h4 className="font-medium mb-3">시각적 차이 비교</h4>
                      <div className="space-y-4">
                        <Card>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">대시보드 페이지 - 레이아웃 변경 감지</CardTitle>
                              <Badge
                                variant="destructive"
                                className="bg-destructive/10 text-destructive border-destructive/20"
                              >
                                중대한 차이
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <div className="bg-muted/50 rounded h-32 flex items-center justify-center">
                                  <span className="text-sm text-muted-foreground">변경 전</span>
                                </div>
                                <p className="text-xs text-center text-muted-foreground">기준 스크린샷</p>
                              </div>
                              <div className="space-y-2">
                                <div className="bg-muted/50 rounded h-32 flex items-center justify-center">
                                  <span className="text-sm text-muted-foreground">변경 후</span>
                                </div>
                                <p className="text-xs text-center text-muted-foreground">현재 스크린샷</p>
                              </div>
                              <div className="space-y-2">
                                <div className="bg-destructive/10 rounded h-32 flex items-center justify-center">
                                  <span className="text-sm text-destructive">차이점 강조</span>
                                </div>
                                <p className="text-xs text-center text-muted-foreground">10.9% 차이 감지</p>
                              </div>
                            </div>
                            <div className="mt-3 p-3 bg-destructive/5 rounded text-sm">
                              <strong>감지된 변경사항:</strong>
                              <ul className="mt-1 space-y-1 text-destructive">
                                <li>• 사이드바 너비 변경 (240px → 280px)</li>
                                <li>• 헤더 높이 증가 (60px → 72px)</li>
                                <li>• 카드 간격 조정 (16px → 20px)</li>
                              </ul>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">로그인 페이지 - 버튼 스타일 변경</CardTitle>
                              <Badge className="bg-chart-3/10 text-chart-3 border-chart-3/20">미세한 차이</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <div className="bg-muted/50 rounded h-32 flex items-center justify-center">
                                  <span className="text-sm text-muted-foreground">변경 전</span>
                                </div>
                                <p className="text-xs text-center text-muted-foreground">기준 스크린샷</p>
                              </div>
                              <div className="space-y-2">
                                <div className="bg-muted/50 rounded h-32 flex items-center justify-center">
                                  <span className="text-sm text-muted-foreground">변경 후</span>
                                </div>
                                <p className="text-xs text-center text-muted-foreground">현재 스크린샷</p>
                              </div>
                              <div className="space-y-2">
                                <div className="bg-chart-3/10 rounded h-32 flex items-center justify-center">
                                  <span className="text-sm text-chart-3">차이점 강조</span>
                                </div>
                                <p className="text-xs text-center text-muted-foreground">2.8% 차이 감지</p>
                              </div>
                            </div>
                            <div className="mt-3 p-3 bg-chart-3/5 rounded text-sm">
                              <strong>감지된 변경사항:</strong>
                              <ul className="mt-1 space-y-1 text-chart-3">
                                <li>• 로그인 버튼 색상 변경 (#6366f1 → #8b5cf6)</li>
                                <li>• 버튼 모서리 둥글기 조정 (6px → 8px)</li>
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Step Results */}
                <div>
                  <h3 className="font-semibold mb-3">상세 실행 로그</h3>
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">REQ-BL-00001_TS_001 - 정상 창업 지원프로세스 처리</CardTitle>
                          <Badge className="bg-chart-1/10 text-chart-1 border-chart-1/20">성공</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 p-2 rounded bg-muted/30">
                            <CheckCircle className="h-4 w-4 text-chart-1" />
                            <span className="text-sm">Step 1: 페이지 로드 (1.2초)</span>
                          </div>
                          <div className="flex items-center gap-3 p-2 rounded bg-muted/30">
                            <CheckCircle className="h-4 w-4 text-chart-1" />
                            <span className="text-sm">Step 2: 로그인 폼 입력 (0.8초)</span>
                          </div>
                          <div className="flex items-center gap-3 p-2 rounded bg-muted/30">
                            <CheckCircle className="h-4 w-4 text-chart-1" />
                            <span className="text-sm">Step 3: 제출 버튼 클릭 (0.5초)</span>
                          </div>
                          <div className="flex items-center gap-3 p-2 rounded bg-muted/30">
                            <CheckCircle className="h-4 w-4 text-chart-1" />
                            <span className="text-sm">Step 4: 결과 확인 (9.8초)</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">
                            REQ-BL-00001_TS_002 - 필수 입력값 누락 시 오류 처리
                          </CardTitle>
                          <Badge
                            variant="destructive"
                            className="bg-destructive/10 text-destructive border-destructive/20"
                          >
                            실패
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 p-2 rounded bg-muted/30">
                            <CheckCircle className="h-4 w-4 text-chart-1" />
                            <span className="text-sm">Step 1: 페이지 로드 (1.1초)</span>
                          </div>
                          <div className="flex items-center gap-3 p-2 rounded bg-muted/30">
                            <CheckCircle className="h-4 w-4 text-chart-1" />
                            <span className="text-sm">Step 2: 빈 폼 상태 확인 (0.3초)</span>
                          </div>
                          <div className="flex items-center gap-3 p-2 rounded bg-destructive/10">
                            <XCircle className="h-4 w-4 text-destructive" />
                            <span className="text-sm">Step 3: 제출 버튼 클릭 실패 (7.3초)</span>
                          </div>
                          <div className="text-sm text-destructive bg-destructive/5 p-2 rounded">
                            오류: 요소를 찾을 수 없음: #submit-button. 페이지 구조가 변경되었을 가능성이 있습니다.
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Screenshots Section */}
                <div>
                  <h3 className="font-semibold mb-3">스크린샷</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3">
                      <div className="bg-muted/50 rounded h-32 flex items-center justify-center mb-2">
                        <span className="text-sm text-muted-foreground">성공 시나리오 스크린샷</span>
                      </div>
                      <p className="text-xs text-muted-foreground">REQ-BL-00001_TS_001 - 최종 결과 화면</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="bg-muted/50 rounded h-32 flex items-center justify-center mb-2">
                        <span className="text-sm text-muted-foreground">실패 시나리오 스크린샷</span>
                      </div>
                      <p className="text-xs text-muted-foreground">REQ-BL-00001_TS_002 - 오류 발생 시점</p>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">요약 및 권장사항</h3>
                  <div className="space-y-2 text-sm">
                    <p>• 전체 16개 시나리오 중 14개 성공, 2개 실패로 87.5%의 성공률을 기록했습니다.</p>
                    <p>• 실패한 시나리오는 모두 UI 요소 선택자 변경으로 인한 것으로 확인됩니다.</p>
                    <p>• 시각적 회귀 테스트에서 1개 페이지에서 중대한 레이아웃 변경이 감지되었습니다.</p>
                    <p>• 대시보드 페이지의 레이아웃 변경은 의도된 변경인지 확인이 필요합니다.</p>
                    <p>• 페이지 구조 변경에 대응하기 위해 더 안정적인 선택자 사용을 권장합니다.</p>
                    <p>• 다음 회귀 테스트 실행 전에 실패한 테스트 케이스의 선택자를 업데이트해야 합니다.</p>
                    <p>• 시각적 변경사항이 의도된 것이라면 기준 스크린샷을 업데이트하시기 바랍니다.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Scenario Modal */}
      {showEditModal && editingScenario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[80vh] m-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary">시나리오 편집</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowEditModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-auto max-h-[calc(80vh-120px)]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">시나리오 ID</label>
                    <Input
                      value={editingScenario.id}
                      onChange={(e) => setEditingScenario({ ...editingScenario, id: e.target.value })}
                      className="bg-muted/50"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">카테고리</label>
                    <Input
                      value={editingScenario.category}
                      onChange={(e) => setEditingScenario({ ...editingScenario, category: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">시나리오 제목</label>
                  <Input
                    value={editingScenario.title}
                    onChange={(e) => setEditingScenario({ ...editingScenario, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">사이트 URL</label>
                  <Input
                    placeholder="http://example.com"
                    onChange={(e) => setEditingScenario({ ...editingScenario, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">시나리오 상세</label>
                  <textarea
                    className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                    value={editingScenario.details}
                    onChange={(e) => setEditingScenario({ ...editingScenario, details: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">테스트 데이터</label>
                  <textarea
                    className="w-full min-h-[60px] p-3 border rounded-md resize-none font-mono text-sm"
                    value={editingScenario.testData}
                    onChange={(e) => setEditingScenario({ ...editingScenario, testData: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">예상 결과</label>
                  <textarea
                    className="w-full min-h-[80px] p-3 border rounded-md resize-none"
                    value={editingScenario.expectedResult}
                    onChange={(e) => setEditingScenario({ ...editingScenario, expectedResult: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">우선순위</label>
                    <Select
                      value={editingScenario.priority}
                      onValueChange={(value) => setEditingScenario({ ...editingScenario, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Simple">Simple</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Complex">Complex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">기능 유형</label>
                    <Select
                      value={editingScenario.functional}
                      onValueChange={(value) => setEditingScenario({ ...editingScenario, functional: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Functional">Functional</SelectItem>
                        <SelectItem value="Non-Functional">Non-Functional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">예상 소요시간</label>
                    <Input
                      value={editingScenario.duration}
                      onChange={(e) => setEditingScenario({ ...editingScenario, duration: e.target.value })}
                      placeholder="예: 0.2h"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingScenario.regressionTest}
                      onChange={(e) => setEditingScenario({ ...editingScenario, regressionTest: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">회귀 테스트 포함</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowEditModal(false)}>
                    취소
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90" onClick={handleSaveEditedScenario}>
                    저장
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add New Scenario Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[80vh] m-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary">새 시나리오 추가</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-auto max-h-[calc(80vh-120px)]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">시나리오 ID</label>
                    <Input value="자동 생성됨" className="bg-muted/50" disabled />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">카테고리</label>
                    <Input
                      value={newScenario.category}
                      onChange={(e) => setNewScenario({ ...newScenario, category: e.target.value })}
                      placeholder="예: 로그인, 결제, 검색"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">시나리오 제목</label>
                  <Input
                    value={newScenario.title}
                    onChange={(e) => setNewScenario({ ...newScenario, title: e.target.value })}
                    placeholder="테스트 시나리오 제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">사이트 URL</label>
                  <Input
                    placeholder="http://example.com"
                    onChange={(e) => setEditingScenario({ ...editingScenario, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">시나리오 상세</label>
                  <textarea
                    className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                    value={newScenario.details}
                    onChange={(e) => setNewScenario({ ...newScenario, details: e.target.value })}
                    placeholder="테스트 시나리오의 상세 내용을 입력하세요"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">테스트 데이터</label>
                  <textarea
                    className="w-full min-h-[60px] p-3 border rounded-md resize-none font-mono text-sm"
                    value={newScenario.testData}
                    onChange={(e) => setNewScenario({ ...newScenario, testData: e.target.value })}
                    placeholder="테스트에 사용할 데이터를 입력하세요"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">예상 결과</label>
                  <textarea
                    className="w-full min-h-[80px] p-3 border rounded-md resize-none"
                    value={newScenario.expectedResult}
                    onChange={(e) => setNewScenario({ ...newScenario, expectedResult: e.target.value })}
                    placeholder="예상되는 테스트 결과를 입력하세요"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">우선순위</label>
                    <Select
                      value={newScenario.priority}
                      onValueChange={(value) => setNewScenario({ ...newScenario, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Simple">Simple</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Complex">Complex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">기능 유형</label>
                    <Select
                      value={newScenario.functional}
                      onChange={(e) => setNewScenario({ ...newScenario, functional: e.target.value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Functional">Functional</SelectItem>
                        <SelectItem value="Non-Functional">Non-Functional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">예상 소요시간</label>
                    <Input
                      value={newScenario.duration}
                      onChange={(e) => setNewScenario({ ...newScenario, duration: e.target.value })}
                      placeholder="예: 0.2h"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newScenario.regressionTest}
                      onChange={(e) => setNewScenario({ ...newScenario, regressionTest: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">회귀 테스트 포함</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowAddModal(false)}>
                    취소
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90" onClick={handleSaveNewScenario}>
                    추가
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* PIMS Registration Modal */}
      {showPimsModal && pimsRegistrationData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">PIMS 시스템 연계</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowPimsModal(false)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">시나리오 ID</label>
                  <div className="p-3 bg-muted rounded-md text-sm">{pimsRegistrationData.scenarioId}</div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">실행 상태</label>
                  <div className="p-3 bg-muted rounded-md text-sm">
                    <Badge
                      className={
                        pimsRegistrationData.status === "passed"
                          ? "bg-chart-1/10 text-chart-1 border-chart-1/20"
                          : pimsRegistrationData.status === "failed"
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : "bg-chart-2/10 text-chart-2 border-chart-2/20"
                      }
                    >
                      {pimsRegistrationData.status === "passed"
                        ? "성공"
                        : pimsRegistrationData.status === "failed"
                          ? "실패"
                          : "진행중"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">시나리오명</label>
                <div className="p-3 bg-muted rounded-md text-sm">{pimsRegistrationData.scenarioTitle}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">마지막 실행</label>
                  <div className="p-3 bg-muted rounded-md text-sm">{pimsRegistrationData.lastExecuted}</div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">성공률</label>
                  <div className="p-3 bg-muted rounded-md text-sm">{pimsRegistrationData.successRate}%</div>
                </div>
              </div>

              {pimsRegistrationData.failureDetails && (
                <div>
                  <label className="text-sm font-medium mb-2 block">실패 상세 내역</label>
                  <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-md text-sm text-destructive">
                    {pimsRegistrationData.failureDetails}
                  </div>
                </div>
              )}

              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  PIMS 등록 정보
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>• 테스트 결과가 PIMS 시스템에 자동으로 등록됩니다</div>
                  <div>• 실패한 테스트의 경우 상세 오류 내역이 포함됩니다</div>
                  <div>• 등록 후 PIMS에서 결과를 확인할 수 있습니다</div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowPimsModal(false)}>
                취소
              </Button>
              <Button onClick={submitToPims} className="bg-primary hover:bg-primary/90">
                <Database className="h-4 w-4 mr-2" />
                PIMS에 등록
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
