"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Play,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  AlertCircle,
  Database,
  X,
  BarChart3,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  ChevronUp,
} from "lucide-react"

interface ExecutionHistory {
  id: string
  executedAt: string
  executedBy: string
  status: "success" | "failed" | "warning"
  successRate: number
  totalTests: number
  passedTests: number
  failedTests: number
  duration: string
  version: string
}

interface PimsScenarioDetailProps {
  scenarioId: string
}

const mockScenario = {
  id: "REQ-BL-00001_TS_001",
  title: "정상 창업 지원프로세스 처리",
  description:
    "사용자 업 지원 신청 접수부터 승인까지의 전체 프로세스를 검증합니다. 3단계 검증 과정을 거쳐 최종 승인까지의 워크플로우를 테스트합니다.",
  category: "창업지원",
  status: "success",
  lastRun: "2023-08-29 14:17",
  duration: "0.2h",
  successRate: 93.3,
  totalRuns: 15,
  author: "김철수",
  createdAt: "2023-08-01",
  tags: ["회귀테스트", "스모크테스트", "자동화"],
  requirementId: "REQ-BL-00001",
  requirementName: "창업 지원 프로세스 관리",
  detailContent:
    "창업 지원 신청부터 승인까지의 전체 프로세스를 자동화하여 처리하는 시스템입니다. 신청자의 정보 입력, 서류 검토, 승인 절차를 포함합니다.",
  precondition:
    "1. 시스템에 로그인된 상태여야 함\n2. 창업 지원 메뉴에 접근 권한이 있어야 함\n3. 필수 서류가 준비되어 있어야 함",
  testData:
    "사용자ID: test_user01\n비밀번호: test123!\n사업자등록번호: 123-45-67890\n대표자명: 홍길동\n사업장주소: 서울시 강남구 테헤란로 123",
  expectedResult:
    "1. 로그인 성공 후 메인 화면 이동\n2. 창업 지원 메뉴 정상 접근\n3. 신청서 작성 완료\n4. 제출 후 접수 완료 메시지 표시\n5. 신청 내역 조회 가능",
  steps: [
    { action: "1. 로그인 페이지 접속", description: "사용자 ID/PW 입력 후 로그인" },
    { action: "2. 창업 지원 메뉴 선택", description: "메인 화면에서 창업 지원 메뉴로 이동" },
    { action: "3. 신청서 작성", description: "필수 정보 입력 및 첨부 파일 업로드" },
    { action: "4. 신청서 제출", description: "작성 내용 확인 후 최종 제출" },
  ],
  executionCount: 15,
}

const mockExecutionHistory: ExecutionHistory[] = [
  {
    id: "1",
    executedAt: "2023-08-29 14:17",
    executedBy: "김철수",
    status: "success",
    successRate: 93.3,
    totalTests: 15,
    passedTests: 14,
    failedTests: 1,
    duration: "12분 34초",
    version: "v2.1.0",
  },
  {
    id: "2",
    executedAt: "2023-08-28 16:45",
    executedBy: "이영희",
    status: "failed",
    successRate: 73.3,
    totalTests: 15,
    passedTests: 11,
    failedTests: 4,
    duration: "15분 22초",
    version: "v2.0.9",
  },
  {
    id: "3",
    executedAt: "2023-08-28 10:30",
    executedBy: "박민수",
    status: "success",
    successRate: 100.0,
    totalTests: 15,
    passedTests: 15,
    failedTests: 0,
    duration: "11분 18초",
    version: "v2.0.8",
  },
  {
    id: "4",
    executedAt: "2023-08-27 14:22",
    executedBy: "김철수",
    status: "warning",
    successRate: 86.7,
    totalTests: 15,
    passedTests: 13,
    failedTests: 2,
    duration: "13분 45초",
    version: "v2.0.7",
  },
  {
    id: "5",
    executedAt: "2023-08-26 11:15",
    executedBy: "정수진",
    status: "success",
    successRate: 93.3,
    totalTests: 15,
    passedTests: 14,
    failedTests: 1,
    duration: "10분 52초",
    version: "v2.0.6",
  },
]

const mockScenarioList = [
  {
    id: "REQ-BL-00001_TS_001",
    title: "정상 창업 지원프로세스 처리",
    status: "success",
    category: "창업지원",
    lastRun: "2023-08-29 14:17",
    duration: "0.2h",
    successRate: 93.3,
    totalRuns: 15,
    author: "김철수",
    createdAt: "2023-08-01",
    requirementId: "REQ-BL-00001",
    requirementName: "창업 지원 프로세스 관리",
    description:
      "사용자 창업 지원 신청 접수부터 승인까지의 전체 프로세스를 검증합니다. 3단계 검증 과정을 거쳐 최종 승인까지의 워크플로우를 테스트합니다.",
    detailContent:
      "창업 지원 신청부터 승인까지의 전체 프로세스를 자동화하여 처리하는 시스템입니다. 신청자의 정보 입력, 서류 검토, 승인 절차를 포함합니다.",
    precondition:
      "1. 시스템에 로그인된 상태여야 함\n2. 창업 지원 메뉴에 접근 권한이 있어야 함\n3. 필수 서류가 준비되어 있어야 함",
    testData:
      "사용자ID: test_user01\n비밀번호: test123!\n사업자등록번호: 123-45-67890\n대표자명: 홍길동\n사업장주소: 서울시 강남구 테헤란로 123",
    expectedResult:
      "1. 로그인 성공 후 메인 화면 이동\n2. 창업 지원 메뉴 정상 접근\n3. 신청서 작성 완료\n4. 제출 후 접수 완료 메시지 표시\n5. 신청 내역 조회 가능",
    tags: ["회귀테스트", "스모크테스트", "자동화"],
  },
  {
    id: "REQ-BL-00002_TS_002",
    title: "창업 지원 신청 반려 처리",
    status: "failed",
    category: "창업지원",
    lastRun: "2023-08-28 16:30",
    duration: "0.15h",
    successRate: 87.5,
    totalRuns: 8,
    author: "이영희",
    createdAt: "2023-08-02",
    requirementId: "REQ-BL-00002",
    requirementName: "창업 지원 신청 반려 프로세스",
    description:
      "창업 지원 신청이 반려되는 경우의 처리 프로세스를 검증합니다. 반려 사유 안내 및 재신청 가능 여부를 확인합니다.",
    detailContent:
      "신청서 검토 과정에서 요건 미충족 시 반려 처리하는 시스템입니다. 반려 사유를 명확히 안내하고 재신청 절차를 제공합니다.",
    precondition: "1. 창업 지원 신청이 접수된 상태\n2. 검토자 권한으로 로그인\n3. 반려 사유가 명확해야 함",
    testData: "신청번호: APP-2023-001\n반려사유: 사업자등록증 미제출\n검토자ID: reviewer01",
    expectedResult: "1. 반려 처리 완료\n2. 신청자에게 반려 알림 발송\n3. 반려 사유 상세 안내\n4. 재신청 가능 안내",
    tags: ["예외처리", "알림테스트"],
  },
  {
    id: "REQ-BL-00003_TS_003",
    title: "사업자 등록 검증 프로세스",
    status: "running",
    category: "사업자관리",
    lastRun: "2023-08-29 15:45",
    duration: "0.3h",
    successRate: 95.2,
    totalRuns: 21,
    author: "박민수",
    createdAt: "2023-08-03",
    requirementId: "REQ-BL-00003",
    requirementName: "사업자 등록 정보 검증",
    description:
      "사업자 등록번호의 유효성을 검증하고 국세청 연계를 통해 실제 사업자 정보를 확인하는 프로세스를 테스트합니다.",
    detailContent: "입력된 사업자등록번호가 실제 존재하는지 국세청 API를 통해 검증하고, 사업자 상태 정보를 확인합니다.",
    precondition: "1. 국세청 API 연결 상태 정상\n2. 유효한 사업자등록번호 보유\n3. API 호출 권한 확인",
    testData: "사업자등록번호: 123-45-67890\n대표자명: 홍길동\n상호명: (주)테스트컴퍼니",
    expectedResult:
      "1. 사업자등록번호 유효성 확인\n2. 사업자 상태 정보 조회\n3. 대표자명 일치 여부 확인\n4. 검증 결과 저장",
    tags: ["API연동", "데이터검증"],
  },
  {
    id: "REQ-BL-00004_TS_004",
    title: "지원금 지급 프로세스",
    status: "ready",
    category: "지원금관리",
    lastRun: "2023-08-27 11:20",
    duration: "0.25h",
    successRate: 91.7,
    totalRuns: 12,
    author: "최지은",
    createdAt: "2023-08-04",
    requirementId: "REQ-BL-00004",
    requirementName: "지원금 지급 관리",
    description:
      "승인된 창업 지원 신청에 대해 지원금을 지급하는 전체 프로세스를 검증합니다. 계좌 확인부터 실제 이체까지의 과정을 테스트합니다.",
    detailContent:
      "지원금 지급 대상자 선정, 계좌 정보 확인, 지급 승인, 실제 이체 처리까지의 전체 워크플로우를 관리합니다.",
    precondition: "1. 지원금 지급 승인 완료\n2. 수급자 계좌 정보 등록\n3. 지급 예산 확보",
    testData: "지원금액: 5,000,000원\n수급자: 홍길동\n계좌번호: 110-123-456789\n은행: 국민은행",
    expectedResult: "1. 계좌 정보 유효성 확인\n2. 지급 승인 처리\n3. 이체 실행\n4. 지급 완료 알림",
    tags: ["금융연동", "승인프로세스"],
  },
  {
    id: "REQ-BL-00004_TS_005",
    title: "지원금 지급 오류 처리",
    status: "creating",
    category: "지원금관리",
    lastRun: "2023-08-26 09:15",
    duration: "0.18h",
    successRate: 88.9,
    totalRuns: 9,
    author: "정수현",
    createdAt: "2023-08-05",
    requirementId: "REQ-BL-00004",
    requirementName: "지원금 지급 관리",
    description:
      "지원금 지급 과정에서 발생할 수 있는 오류 상황을 처리하는 프로세스를 검증합니다. 계좌 오류, 한도 초과 등의 예외 상황을 테스트합니다.",
    detailContent: "지급 과정에서 발생하는 다양한 오류 상황에 대한 예외 처리 및 복구 절차를 관리합니다.",
    precondition: "1. 지급 오류 시나리오 설정\n2. 오류 처리 권한 확보\n3. 복구 절차 준비",
    testData: "오류유형: 계좌정보불일치\n지원금액: 3,000,000원\n오류계좌: 999-999-999999",
    expectedResult: "1. 오류 감지 및 알림\n2. 오류 사유 분석\n3. 복구 절차 안내\n4. 재처리 또는 반려",
    tags: ["예외처리", "오류복구"],
  },
]

interface Props {
  scenarioId: string
}

function PimsScenarioDetailComponent({ scenarioId }: Props) {
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null)
  const [showScenarioReport, setShowScenarioReport] = useState(false)
  const [showExecutionReport, setShowExecutionReport] = useState(false)
  const [selectedExecutionId, setSelectedExecutionId] = useState<string | null>(null)
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>({})
  const [showPlaywrightCode, setShowPlaywrightCode] = useState(false)
  const [showDetailInfo, setShowDetailInfo] = useState(false)

  const router = useRouter()
  const [showSampleReport, setShowSampleReport] = useState(false)
  const [expandedPageLogs, setExpandedPageLogs] = useState<{ [key: string]: boolean }>({})

  const currentScenario = mockScenarioList.find((scenario) => scenario.id === scenarioId) || mockScenarioList[0]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-chart-1" />
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-chart-2" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return "성공"
      case "failed":
        return "실패"
      case "creating":
        return "준비중"
      case "running":
        return "실행중"
      case "ready":
        return "준비 완료"
      default:
        return "오류"
    }
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return "text-chart-1"
    if (rate >= 70) return "text-chart-2"
    return "text-destructive"
  }

  const togglePageLogs = (pageId: string) => {
    setExpandedPages((prev) => ({
      ...prev,
      [pageId]: !prev[pageId],
    }))
  }

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "text-destructive"
      case "warn":
        return "text-chart-2"
      case "info":
        return "text-muted-foreground"
      default:
        return "text-muted-foreground"
    }
  }

  const getLogLevelBg = (level: string) => {
    switch (level) {
      case "error":
        return "bg-destructive/5"
      case "warn":
        return "bg-chart-2/5"
      case "info":
        return "bg-muted/20"
      default:
        return "bg-muted/20"
    }
  }

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-chart-1" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-chart-2" />
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "creating":
        return <Clock className="h-4 w-4 text-muted-foreground" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const mockExecutionSteps = [
    {
      id: "step-1",
      stepName: "1. 로그인 페이지 접속",
      description: "사용자 ID/PW 입력 후 로그인",
      status: "success",
      duration: "2.5초",
      screenshotSaved: true,
      consoleLogs: [
        { timestamp: "14:17:32", level: "info", message: "Navigated to login page" },
        { timestamp: "14:17:33", level: "info", message: "Entered username: test_user01" },
        { timestamp: "14:17:34", level: "info", message: "Entered password: test123!" },
      ],
    },
    {
      id: "step-2",
      stepName: "2. 창업 지원 메뉴 선택",
      description: "메인 화면에서 창업 지원 메뉴로 이동",
      status: "success",
      duration: "1.8초",
      screenshotSaved: true,
      consoleLogs: [
        { timestamp: "14:17:35", level: "info", message: "Clicked on 창업 지원 menu" },
        { timestamp: "14:17:36", level: "info", message: "Navigated to 창업 지원 page" },
      ],
    },
    {
      id: "step-3",
      stepName: "3. 신청서 작성",
      description: "필수 정보 입력 및 첨부 파일 업로드",
      status: "failed",
      duration: "5.2초",
      screenshotSaved: true,
      consoleLogs: [
        { timestamp: "14:17:37", level: "info", message: "Started filling the application form" },
        { timestamp: "14:17:38", level: "warn", message: "사업자등록번호 field is empty" },
        { timestamp: "14:17:40", level: "error", message: "Validation error: 사업자등록번호 is required" },
      ],
    },
    {
      id: "step-4",
      stepName: "4. 신청서 제출",
      description: "작성 내용 확인 후 최종 제출",
      status: "creating",
      duration: "0.7초",
      screenshotSaved: false,
      consoleLogs: [
        { timestamp: "14:17:41", level: "info", message: "Attempting to submit the form" },
        { timestamp: "14:17:41", level: "warn", message: "Submit button is disabled" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/test-scenarios")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="bg-muted/50 text-muted-foreground">
                    {currentScenario.category}
                  </Badge>
                  <span>•</span>
                  <span>{currentScenario.requirementId}</span>
                  <span>•</span>
                  <span>{currentScenario.requirementName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(currentScenario.status)}
                    <h1 className="text-xl font-bold text-primary">{currentScenario.title}</h1>
                  </div>
                  <Badge variant="outline">{currentScenario.id}</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setShowScenarioReport(true)}>
                <Download className="h-4 w-4 mr-2" />
                시나리오 보고서
              </Button>
              <Button variant="default" size="sm">
                <Play className="h-4 w-4 mr-2" />
                테스트 실행
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarFallback>김</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar - Scenario List */}
        <div className="w-80 border-r bg-card flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-primary mb-4">테스트 시나리오 목록</h2>
          </div>
          <div className="flex-1 overflow-auto p-2 space-y-2">
            {mockScenarioList.map((scenario) => (
              <Card
                key={scenario.id}
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                  scenario.id === scenarioId ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => router.push(`/test-scenarios/${scenario.id}`)}
              >
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm leading-tight">{scenario.title}</h4>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          scenario.status === "success"
                            ? "default"
                            : scenario.status === "failed"
                              ? "destructive"
                              : scenario.status === "running"
                                ? "secondary"
                                : "outline"
                        }
                        className={`text-xs ${
                          scenario.status === "success"
                            ? "bg-chart-1/10 text-chart-1 border-chart-1/20"
                            : scenario.status === "failed"
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : scenario.status === "running"
                                ? "bg-chart-2/10 text-chart-2 border-chart-2/20"
                                : ""
                        }`}
                      >
                        {getStatusText(scenario.status)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{scenario.id}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Center - Scenario Details and History */}
          <div className="flex-1 p-6 overflow-auto">
            {/* Scenario Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  시나리오 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">요구사항 ID:</span>
                    <span className="ml-2 font-medium">{currentScenario.requirementId}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">요구사항명:</span>
                    <span className="ml-2 font-medium">{currentScenario.requirementName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">카테고리:</span>
                    <span className="ml-2 font-medium">{currentScenario.category}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">작성자:</span>
                    <span className="ml-2 font-medium">{currentScenario.author}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">생성일:</span>
                    <span className="ml-2 font-medium">{currentScenario.createdAt}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">총 실행 횟수:</span>
                    <span className="ml-2 font-medium">{currentScenario.totalRuns}회</span>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-sm text-muted-foreground mb-2">설명:</p>
                  <p className="text-sm">{currentScenario.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDetailInfo(!showDetailInfo)}
                      className="flex items-center gap-2"
                    >
                      {showDetailInfo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      상세정보 보기
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPlaywrightCode(!showPlaywrightCode)}
                      className="flex items-center gap-2"
                    >
                      {showPlaywrightCode ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      Playwright 코드 보기
                    </Button>
                  </div>
                </div>

                {showPlaywrightCode && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">생성된 Playwright 코드</h4>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const code = `import { test, expect } from '@playwright/test';

test('${currentScenario.title}', async ({ page }) => {
  // 1. 로그인 페이지 접속
  await page.goto('https://example.com/login');
  await page.fill('#username', 'test_user01');
  await page.fill('#password', 'test123!');
  await page.click('#login-button');
  
  // 2. 창업 지원 메뉴 선택
  await page.waitForSelector('.main-menu');
  await page.click('text=창업 지원');
  
  // 3. 신청서 작성
  await page.fill('#business-number', '123-45-67890');
  await page.fill('#representative-name', '홍길동');
  await page.fill('#business-address', '서울시 강남구 테헤란로 123');
  
  // 4. 신청서 제출
  await page.click('#submit-button');
  await expect(page.locator('.success-message')).toBeVisible();
});`
                              navigator.clipboard.writeText(code)
                            }}
                            className="text-xs"
                          >
                            복사
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const element = document.createElement("a")
                              const file = new Blob(
                                [
                                  `import { test, expect } from '@playwright/test';

test('${currentScenario.title}', async ({ page }) => {
  // 1. 로그인 페이지 접속
  await page.goto('https://example.com/login');
  await page.fill('#username', 'test_user01');
  await page.fill('#password', 'test123!');
  await page.click('#login-button');
  
  // 2. 창업 지원 메뉴 선택
  await page.waitForSelector('.main-menu');
  await page.click('text=창업 지원');
  
  // 3. 신청서 작성
  await page.fill('#business-number', '123-45-67890');
  await page.fill('#representative-name', '홍길동');
  await page.fill('#business-address', '서울시 강남구 테헤란로 123');
  
  // 4. 신청서 제출
  await page.click('#submit-button');
  await expect(page.locator('.success-message')).toBeVisible();
});`,
                                ],
                                { type: "text/plain" },
                              )
                              element.href = URL.createObjectURL(file)
                              element.download = `${currentScenario.id}.spec.ts`
                              document.body.appendChild(element)
                              element.click()
                              document.body.removeChild(element)
                            }}
                            className="text-xs"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            다운로드
                          </Button>
                        </div>
                      </div>
                      <pre className="text-sm bg-muted/30 p-4 rounded-md overflow-x-auto font-mono border">
                        <code>{`import { test, expect } from '@playwright/test';

test('${currentScenario.title}', async ({ page }) => {
  // 1. 로그인 페이지 접속
  await page.goto('https://example.com/login');
  await page.fill('#username', 'test_user01');
  await page.fill('#password', 'test123!');
  await page.click('#login-button');
  
  // 2. 창업 지원 메뉴 선택
  await page.waitForSelector('.main-menu');
  await page.click('text=창업 지원');
  
  // 3. 신청서 작성
  await page.fill('#business-number', '123-45-67890');
  await page.fill('#representative-name', '홍길동');
  await page.fill('#business-address', '서울시 강남구 테헤란로 123');
  
  // 4. 신청서 제출
  await page.click('#submit-button');
  await expect(page.locator('.success-message')).toBeVisible();
});`}</code>
                      </pre>
                      <p className="text-xs text-muted-foreground mt-2">
                        * 이 코드는 테스트 시나리오를 기반으로 자동 생성되었습니다. 실제 환경에 맞게 셀렉터와 URL을
                        수정해주세요.
                      </p>
                    </div>
                  </div>
                )}

                {showDetailInfo && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <h4 className="font-medium mb-2">상세내용</h4>
                      <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                        {currentScenario.detailContent}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">사전조건</h4>
                      <pre className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md whitespace-pre-wrap">
                        {currentScenario.precondition}
                      </pre>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">테스트 데이터</h4>
                      <pre className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md whitespace-pre-wrap font-mono">
                        {currentScenario.testData}
                      </pre>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">예상결과</h4>
                      <pre className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md whitespace-pre-wrap">
                        {currentScenario.expectedResult}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  실행 이력
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockExecutionHistory.map((history) => (
                    <div
                      key={history.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedHistory === history.id ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => {
                        setSelectedExecutionId(history.id)
                        setShowExecutionReport(true)
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(history.status)}
                          <div>
                            <div className="font-medium text-sm flex items-center gap-2">
                              <span>{history.executedBy}</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-muted-foreground">{history.version}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">{history.executedAt}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant={
                                history.status === "success"
                                  ? "default"
                                  : history.status === "failed"
                                    ? "destructive"
                                    : "secondary"
                              }
                              className={`text-xs ${
                                history.status === "success"
                                  ? "bg-chart-1/10 text-chart-1 border-chart-1/20"
                                  : history.status === "failed"
                                    ? "bg-destructive/10 text-destructive border-destructive/20"
                                    : "bg-chart-2/10 text-chart-2 border-chart-2/20"
                              }`}
                            >
                              {getStatusText(history.status)}
                            </Badge>
                            <span className={`text-sm font-medium ${getSuccessRateColor(history.successRate)}`}>
                              {history.successRate}%
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">{history.duration}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <div className="text-muted-foreground">
                          총 {history.totalTests}개 테스트 • 성공 {history.passedTests}개 • 실패 {history.failedTests}개
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {selectedHistory && (
            <div className="w-96 border-l bg-card p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">실행 이력 상세</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedHistory(null)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">실행자</label>
                    <p className="text-sm">{selectedHistory.executedBy}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">실행 시간</label>
                    <p className="text-sm">{selectedHistory.executedAt}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">소요 시간</label>
                    <p className="text-sm">{selectedHistory.duration}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">버전</label>
                    <p className="text-sm">{selectedHistory.version}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">실행 결과</label>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(selectedHistory.status)}
                      <Badge
                        variant={
                          selectedHistory.status === "success"
                            ? "default"
                            : selectedHistory.status === "failed"
                              ? "destructive"
                              : "secondary"
                        }
                        className={`text-xs ${
                          selectedHistory.status === "success"
                            ? "bg-chart-1/10 text-chart-1 border-chart-1/20"
                            : selectedHistory.status === "failed"
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : "bg-chart-2/10 text-chart-2 border-chart-2/20"
                        }`}
                      >
                        {getStatusText(selectedHistory.status)}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">성공률</label>
                    <p className={`text-sm mt-1 font-medium ${getSuccessRateColor(selectedHistory.successRate)}`}>
                      {selectedHistory.successRate}%
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">테스트 결과</label>
                    <div className="mt-1 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">총 테스트:</span>
                        <span>{selectedHistory.totalTests}개</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-chart-1">성공:</span>
                        <span className="text-chart-1">{selectedHistory.passedTests}개</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-destructive">실패:</span>
                        <span className="text-destructive">{selectedHistory.failedTests}개</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => {
                    setSelectedExecutionId(selectedHistory.id)
                    setShowExecutionReport(true)
                  }}
                >
                  실행 보고서 보기
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showScenarioReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-6xl max-h-[90vh] m-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary">시나리오 종합 보고서</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5 bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    PDF 다운로드
                  </Button>
                  <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5 bg-transparent">
                    <Database className="h-4 w-4 mr-2" />
                    PIMS에 등록
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowScenarioReport(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="overflow-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Scenario Overview */}
                <div className="border-b pb-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">시나리오 개요</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">시나리오 ID:</span>
                          <span>{mockScenario.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">시나리오명:</span>
                          <span>{mockScenario.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">카테고리:</span>
                          <span>{mockScenario.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">생성일:</span>
                          <span>2023-08-15</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">마지막 수정:</span>
                          <span>2023-08-29</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">실행 통계</h3>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-chart-1/10 rounded-lg p-3">
                          <div className="text-2xl font-bold text-chart-1">15</div>
                          <div className="text-xs text-muted-foreground">총 실행</div>
                        </div>
                        <div className="bg-chart-2/10 rounded-lg p-3">
                          <div className="text-2xl font-bold text-chart-2">89.2%</div>
                          <div className="text-xs text-muted-foreground">평균 성공률</div>
                        </div>
                        <div className="bg-chart-3/10 rounded-lg p-3">
                          <div className="text-2xl font-bold text-chart-3">2분 18초</div>
                          <div className="text-xs text-muted-foreground">평균 소요시간</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Execution History Summary */}
                <div>
                  <h3 className="font-semibold mb-3">실행 이력 요약</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr className="text-left">
                          <th className="p-3 text-sm font-medium">실행 일시</th>
                          <th className="p-3 text-sm font-medium">실행자</th>
                          <th className="p-3 text-sm font-medium">버전</th>
                          <th className="p-3 text-sm font-medium">결과</th>
                          <th className="p-3 text-sm font-medium">성공률</th>
                          <th className="p-3 text-sm font-medium">소요시간</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockExecutionHistory.map((history) => (
                          <tr key={history.id} className="border-t">
                            <td className="p-3 text-sm">{history.executedAt}</td>
                            <td className="p-3 text-sm">{history.executedBy}</td>
                            <td className="p-3 text-sm">{history.version}</td>
                            <td className="p-3">
                              <Badge
                                variant={
                                  history.status === "success"
                                    ? "default"
                                    : history.status === "failed"
                                      ? "destructive"
                                      : "secondary"
                                }
                                className={`text-xs ${
                                  history.status === "success"
                                    ? "bg-chart-1/10 text-chart-1 border-chart-1/20"
                                    : history.status === "failed"
                                      ? "bg-destructive/10 text-destructive border-destructive/20"
                                      : "bg-chart-2/10 text-chart-2 border-chart-2/20"
                                }`}
                              >
                                {getStatusText(history.status)}
                              </Badge>
                            </td>
                            <td className={`p-3 text-sm font-medium ${getSuccessRateColor(history.successRate)}`}>
                              {history.successRate}%
                            </td>
                            <td className="p-3 text-sm">{history.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Test Results Table */}
                {/*
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
                */}

                {/* Test Steps */}
                <div>
                  <h3 className="font-semibold mb-3">테스트 단계</h3>
                  <div className="space-y-3">
                    {mockScenario.steps.map((step, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center mt-0.5">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{step.action}</div>
                            <div className="text-xs text-muted-foreground mt-1">{step.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showExecutionReport && selectedExecutionId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-6xl max-h-[90vh] m-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary">
                  실행 보고서 - {mockExecutionHistory.find((h) => h.id === selectedExecutionId)?.executedAt}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5 bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    PDF 다운로드
                  </Button>
                  <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5 bg-transparent">
                    <Database className="h-4 w-4 mr-2" />
                    PIMS에 등록
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowExecutionReport(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="overflow-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Execution Overview */}
                <div className="border-b pb-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">실행 개요</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">실행 ID:</span>
                          <span>{mockExecutionHistory.find((h) => h.id === selectedExecutionId)?.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">실행 일시:</span>
                          <span>{mockExecutionHistory.find((h) => h.id === selectedExecutionId)?.executedAt}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">실행자:</span>
                          <span>{mockExecutionHistory.find((h) => h.id === selectedExecutionId)?.executedBy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">버전:</span>
                          <span>{mockExecutionHistory.find((h) => h.id === selectedExecutionId)?.version}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">총 소요시간:</span>
                          <span>{mockExecutionHistory.find((h) => h.id === selectedExecutionId)?.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">실행 결과</h3>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-chart-1/10 rounded-lg p-3">
                          <div className="text-2xl font-bold text-chart-1">
                            {mockExecutionHistory.find((h) => h.id === selectedExecutionId)?.passedTests}
                          </div>
                          <div className="text-xs text-muted-foreground">성공</div>
                        </div>
                        <div className="bg-destructive/10 rounded-lg p-3">
                          <div className="text-2xl font-bold text-destructive">
                            {mockExecutionHistory.find((h) => h.id === selectedExecutionId)?.failedTests}
                          </div>
                          <div className="text-xs text-muted-foreground">실패</div>
                        </div>
                        <div className="bg-chart-2/10 rounded-lg p-3">
                          <div
                            className={`text-2xl font-bold ${getSuccessRateColor(mockExecutionHistory.find((h) => h.id === selectedExecutionId)?.successRate || 0)}`}
                          >
                            {mockExecutionHistory.find((h) => h.id === selectedExecutionId)?.successRate}%
                          </div>
                          <div className="text-xs text-muted-foreground">성공률</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Step Results */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    실행 로그
                  </h3>
                  <div className="space-y-4">
                    {mockExecutionSteps.map((step, index) => (
                      <Card key={step.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                  {index + 1}
                                </span>
                                {getStepStatusIcon(step.status)}
                              </div>
                              <div>
                                <CardTitle className="text-base">{step.stepName}</CardTitle>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right text-sm">
                                <div className="font-medium">소요시간: {step.duration}</div>
                                {step.screenshotSaved && <div className="text-muted-foreground">스크린샷 저장됨</div>}
                              </div>
                              {step.consoleLogs.length > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => togglePageLogs(step.id)}
                                  className="p-1 h-6 w-6"
                                >
                                  {expandedPages[step.id] ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        {expandedPages[step.id] && step.consoleLogs.length > 0 && (
                          <CardContent className="pt-0">
                            <div className="space-y-2">
                              <div className="bg-muted/50 rounded h-32 flex items-center justify-center">
                                <span className="text-sm text-muted-foreground">스크린샷</span>
                              </div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-2">Console 로그</h4>
                              <div className="space-y-1 max-h-48 overflow-y-auto">
                                {step.consoleLogs.map((log, logIndex) => (
                                  <div
                                    key={logIndex}
                                    className={`p-2 rounded text-xs font-mono ${getLogLevelBg(log.level)}`}
                                  >
                                    <div className="flex items-start gap-2">
                                      <span className="text-muted-foreground shrink-0">{log.timestamp}</span>
                                      <span
                                        className={`uppercase font-semibold shrink-0 ${getLogLevelColor(log.level)}`}
                                      >
                                        [{log.level}]
                                      </span>
                                      <span className={getLogLevelColor(log.level)}>{log.message}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Screenshots Section */}
                {/* <div>
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
                /*}

                {/* Scenario Video Viewer Section */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    시나리오 실행 동영상
                  </h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                          <video className="w-full h-full" controls poster="/test-scenario-video-thumbnail.jpg">
                            <source src="/placeholder-video.mp4" type="video/mp4" />
                            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                              <div className="text-center">
                                <Play className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">동영상을 재생할 수 없습니다</p>
                              </div>
                            </div>
                          </video>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium">정상 창업 지원프로세스 처리 - 전체 실행 영상</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>실행 시간: 2분 34초</span>
                              <span>해상도: 1920x1080</span>
                              <span>파일 크기: 15.2MB</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              다운로드
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h5 className="font-medium mb-2">동영상 정보</h5>
                            <div className="space-y-1 text-muted-foreground">
                              <div className="flex justify-between">
                                <span>녹화 시작:</span>
                                <span>2023-08-29 14:17:32</span>
                              </div>
                              <div className="flex justify-between">
                                <span>녹화 종료:</span>
                                <span>2023-08-29 14:20:06</span>
                              </div>
                              <div className="flex justify-between">
                                <span>브라우저:</span>
                                <span>Chrome 116.0.5845.96</span>
                              </div>
                              <div className="flex justify-between">
                                <span>화면 해상도:</span>
                                <span>1920x1080</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium mb-2">실행 단계</h5>
                            <div className="space-y-1 text-muted-foreground">
                              <div className="flex justify-between">
                                <span>1. 로그인 페이지 접속</span>
                                <span>0:00 - 0:15</span>
                              </div>
                              <div className="flex justify-between">
                                <span>2. 사용자 인증</span>
                                <span>0:15 - 0:30</span>
                              </div>
                              <div className="flex justify-between">
                                <span>3. 창업 신청 폼 작성</span>
                                <span>0:30 - 1:45</span>
                              </div>
                              <div className="flex justify-between">
                                <span>4. 신청서 제출 및 확인</span>
                                <span>1:45 - 2:34</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <AlertCircle className="h-4 w-4" />
                            <span>
                              이 동영상은 테스트 실행 과정을 실시간으로 녹화한 것입니다. 민감한 정보는 자동으로 마스킹
                              처리되었습니다.
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
    </div>
  )
}

export { PimsScenarioDetailComponent as PimsScenarioDetail }
export default PimsScenarioDetailComponent
