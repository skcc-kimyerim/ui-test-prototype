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
  Loader2,
  RotateCcw,
} from "lucide-react"
import {
  scenariosData,
  executionHistoryData,
  type PimsScenario,
  type ExecutionHistory,
} from "@/lib/scenarios-data"
import {
  getStatusIcon,
  getStatusText,
  getSuccessRateColor,
  getStatusBadgeVariant,
  getStatusBadgeClassName,
  getLogLevelColor,
  getLogLevelBg,
  getStepStatusIcon,
} from "@/lib/scenario-utils"

interface PimsScenarioDetailProps {
  scenarioId: string
}



function PimsScenarioDetailComponent({ scenarioId }: PimsScenarioDetailProps) {
  const [selectedHistory, setSelectedHistory] = useState<ExecutionHistory | null>(null)
  const [showScenarioReport, setShowScenarioReport] = useState(false)
  const [showExecutionReport, setShowExecutionReport] = useState(false)
  const [selectedExecutionId, setSelectedExecutionId] = useState<string | null>(null)
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>({})
  const [showPlaywrightCode, setShowPlaywrightCode] = useState(false)
  const [showDetailInfo, setShowDetailInfo] = useState(false)

  const router = useRouter()
  const [showSampleReport, setShowSampleReport] = useState(false)
  const [expandedPageLogs, setExpandedPageLogs] = useState<{ [key: string]: boolean }>({})

  const currentScenario = scenariosData.find((scenario) => scenario.id === scenarioId) || scenariosData[0]


  const togglePageLogs = (pageId: string) => {
    setExpandedPages((prev) => ({
      ...prev,
      [pageId]: !prev[pageId],
    }))
  }


  const getExecutionStepsForHistory = (historyId: string) => {
    const history = executionHistoryData.find((h) => h.id === historyId)
    if (!history) return []

    const baseSteps = [
      {
        id: "step-1",
        stepName: "1. 로그인 페이지 접속",
        description: "사용자 ID/PW 입력 후 로그인",
      },
      {
        id: "step-2",
        stepName: "2. 창업 지원 메뉴 선택",
        description: "메인 화면에서 창업 지원 메뉴로 이동",
      },
      {
        id: "step-3",
        stepName: "3. 신청서 작성",
        description: "필수 정보 입력 및 첨부 파일 업로드",
      },
      {
        id: "step-4",
        stepName: "4. 신청서 제출",
        description: "작성 내용 확인 후 최종 제출",
      },
      {
        id: "step-5",
        stepName: "5. 결과 확인",
        description: "신청 완료 및 접수번호 확인",
      },
    ]

    switch (history.status) {
      case "success":
        // 성공: 모든 스텝 완료, 일부 경고 가능
        return baseSteps.map((step, index) => ({
          ...step,
          status: index === 2 ? "warning" : "success", // 3번째 스텝에서 경고
          duration: `${(Math.random() * 3 + 1).toFixed(1)}초`,
          screenshotSaved: true,
          consoleLogs:
            index === 2
              ? [
                  { timestamp: "14:17:37", level: "info", message: "Started filling the application form" },
                  { timestamp: "14:17:38", level: "warn", message: "사업자등록번호 형식 확인 필요" },
                  { timestamp: "14:17:39", level: "info", message: "Form validation passed with warnings" },
                ]
              : [
                  {
                    timestamp: `14:17:${30 + index * 5}`,
                    level: "info",
                    message: `${step.stepName} completed successfully`,
                  },
                  { timestamp: `14:17:${31 + index * 5}`, level: "info", message: "Screenshot captured" },
                ],
        }))

      case "failed":
        // 실패: 중간에 중단, 일부 스텝만 진행
        return baseSteps.slice(0, 3).map((step, index) => ({
          ...step,
          status: index === 2 ? "failed" : "success", // 3번째 스텝에서 실패
          duration: index === 2 ? "8.5초" : `${(Math.random() * 3 + 1).toFixed(1)}초`,
          screenshotSaved: index !== 2,
          consoleLogs:
            index === 2
              ? [
                  { timestamp: "14:17:37", level: "info", message: "Started filling the application form" },
                  { timestamp: "14:17:40", level: "error", message: "Network timeout: 서버 응답 없음" },
                  { timestamp: "14:17:45", level: "error", message: "Test execution failed: Connection lost" },
                ]
              : [
                  {
                    timestamp: `14:17:${30 + index * 5}`,
                    level: "info",
                    message: `${step.stepName} completed successfully`,
                  },
                ],
        }))

      case "warning":
        // 경고: 모든 스텝 완료되었지만 여러 경고 발생
        return baseSteps.map((step, index) => ({
          ...step,
          status: [1, 3].includes(index) ? "warning" : "success", // 2, 4번째 스텝에서 경고
          duration: `${(Math.random() * 4 + 1).toFixed(1)}초`,
          screenshotSaved: true,
          consoleLogs: [1, 3].includes(index)
            ? [
                { timestamp: `14:17:${30 + index * 5}`, level: "info", message: `${step.stepName} started` },
                { timestamp: `14:17:${32 + index * 5}`, level: "warn", message: "Performance warning: 응답 시간 지연" },
                { timestamp: `14:17:${34 + index * 5}`, level: "info", message: "Step completed with warnings" },
              ]
            : [
                {
                  timestamp: `14:17:${30 + index * 5}`,
                  level: "info",
                  message: `${step.stepName} completed successfully`,
                },
              ],
        }))

      case "running":
        // 실행 중: 일부 스텝 완료, 현재 진행 중인 스텝 있음
        return baseSteps.slice(0, 4).map((step, index) => ({
          ...step,
          status: index === 3 ? "running" : "success", // 4번째 스텝 실행 중
          duration: index === 3 ? "진행 중..." : `${(Math.random() * 3 + 1).toFixed(1)}초`,
          screenshotSaved: index !== 3,
          consoleLogs:
            index === 3
              ? [
                  { timestamp: "14:17:41", level: "info", message: "Starting form submission process" },
                  { timestamp: "14:17:42", level: "info", message: "Validating form data..." },
                  { timestamp: "14:17:43", level: "info", message: "Uploading attachments..." },
                ]
              : [
                  {
                    timestamp: `14:17:${30 + index * 5}`,
                    level: "info",
                    message: `${step.stepName} completed successfully`,
                  },
                ],
        }))

      default:
        return []
    }
  }

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
            {scenariosData.map((scenario) => (
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
                          variant={getStatusBadgeVariant(scenario.status)}
                          className={getStatusBadgeClassName(scenario.status)}
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
            {currentScenario.status === "creating" ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">AI가 적합한 테스트를 준비중입니다</h3>
                    <p className="text-muted-foreground">시나리오 분석 및 테스트 코드 생성 중...</p>
                  </div>
                  <div className="flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            ) : currentScenario.status === "ready" ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <CheckCircle className="h-16 w-16 text-chart-1 mx-auto" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">테스트 실행 준비 완료</h3>
                    <p className="text-muted-foreground">이 시나리오는 아직 실행된 적이 없습니다.</p>
                  </div>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Play className="h-4 w-4 mr-2" />
                  테스트 실행하기
                </Button>
                </div>
              </div>
            ) : currentScenario.status === "running" ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <Play className="h-16 w-16 text-chart-2 mx-auto" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">테스트 실행 중</h3>
                    <p className="text-muted-foreground">현재 테스트가 진행되고 있습니다.</p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-chart-2 h-2 rounded-full animate-pulse" style={{ width: "65%" }}></div>
                    </div>
                    <p className="text-sm text-muted-foreground">진행률: 65% (8/12 단계 완료)</p>
                  </div>
                </div>
              </div>
            ) : currentScenario.status === "error" ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center space-y-6 max-w-md">
                  <div className="relative">
                    <XCircle className="h-16 w-16 text-destructive mx-auto" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-destructive">테스트 코드 생성 오류</h3>
                    <div className="space-y-3 text-left">
                      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <div className="flex items-center gap-2 text-destructive text-sm font-medium mb-2">
                          <AlertTriangle className="h-4 w-4" />
                          오류 상세 내용
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="text-destructive">• 시나리오 분석 중 오류가 발생했습니다</p>
                          <p className="text-destructive">• 테스트 코드를 생성할 수 없습니다</p>
                          <p className="text-muted-foreground">• 시나리오 내용을 확인해주세요</p>
                        </div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-sm font-medium mb-2">가능한 해결 방법:</div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>1. 시나리오 설명을 더 구체적으로 작성</p>
                          <p>2. 테스트 단계를 명확히 정의</p>
                          <p>3. 예상 결과를 상세히 기술</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        시나리오 수정
                      </Button>
                      <Button className="bg-primary hover:bg-primary/90">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        다시 생성
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
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
                        {/*
                    <div>
                      <h4 className="font-medium mb-2">테스트 사전조건</h4>
                      <pre className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md whitespace-pre-wrap">
                        {currentScenario.detailContent}
                      </pre>
                    </div>
                    */}
                        <div>
                          <h4 className="font-medium mb-2">테스트 데이터</h4>
                          <pre className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md whitespace-pre-wrap font-mono">
                            {currentScenario.testData}
                          </pre>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">상세내용</h4>
                          <pre className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md whitespace-pre-wrap">
                            {currentScenario.expectedResult}
                          </pre>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">상세내용</h4>
                          <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md whitespace-pre-wrap">
                            {currentScenario.precondition}
                          </p>
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
                      {currentScenario.status === "failed" && (
                        <Badge variant="destructive" className="ml-2">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          실행 중단됨
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentScenario.status === "failed" && (
                      <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <div className="flex items-center gap-2 text-destructive text-sm">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="font-medium">테스트가 중간에 중단되었습니다</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          모든 테스트 단계가 완료되지 못했습니다. 아래 실행 이력에서 실패 원인을 확인하세요.
                        </p>
                      </div>
                    )}
                    <div className="space-y-2">
                      {executionHistoryData.map((history) => (
                        <div
                          key={history.id}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                            selectedHistory?.id === history.id ? "border-primary bg-primary/5" : ""
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
                              총 {history.totalTests}개 테스트 • 성공 {history.passedTests}개 • 실패{" "}
                              {history.failedTests}개
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
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
                          <span>{currentScenario.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">시나리오명:</span>
                          <span>{currentScenario.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">카테고리:</span>
                          <span>{currentScenario.category}</span>
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
                        {executionHistoryData.map((history) => (
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

                {/* Execution Log Analysis */}
                <div>
                  <h3 className="font-semibold mb-3">실행 로그 분석</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Error Pattern Analysis */}
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3 text-destructive">오류 패턴 분석</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>네트워크 타임아웃:</span>
                          <span className="text-destructive">3회 발생</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>UI 요소 누락:</span>
                          <span className="text-destructive">2회 발생</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>데이터 검증 실패:</span>
                          <span className="text-destructive">1회 발생</span>
                        </div>
                      </div>
                      <div className="mt-3 p-2 bg-destructive/10 rounded text-xs text-destructive">
                        ⚠ 네트워크 연결 불안정성이 주요 실패 원인으로 확인됨
                      </div>
                    </div>

                    {/* Performance Analysis */}
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3 text-chart-2">성능 분석</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>평균 실행 시간:</span>
                          <span>12분 34초</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>최고 성능:</span>
                          <span className="text-chart-1">10분 52초</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>최저 성능:</span>
                          <span className="text-destructive">15분 22초</span>
                        </div>
                      </div>
                      <div className="mt-3 p-2 bg-chart-2/10 rounded text-xs text-chart-2">
                        📈 최근 3회 실행에서 성능 개선 추세 확인됨
                      </div>
                    </div>
                  </div>

                  {/* Step-by-Step Log Analysis */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">단계별 로그 분석</h4>
                    <div className="space-y-3">
                      <div className="border-l-4 border-chart-1 pl-4">
                        <div className="font-medium text-sm">1단계: 로그인 페이지 접속</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          • 평균 응답시간: 1.2초 • 성공률: 100% • 주요 로그: 정상 연결 확인
                        </div>
                      </div>
                      <div className="border-l-4 border-chart-2 pl-4">
                        <div className="font-medium text-sm">2단계: 창업 지원 메뉴 선택</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          • 평균 응답시간: 2.1초 • 성공률: 95% • 주요 로그: 메뉴 로딩 지연 1회 발생
                        </div>
                      </div>
                      <div className="border-l-4 border-destructive pl-4">
                        <div className="font-medium text-sm">3단계: 신청서 작성</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          • 평균 응답시간: 5.8초 • 성공률: 87% • 주요 로그: 사업자번호 형식 검증 경고
                        </div>
                      </div>
                      <div className="border-l-4 border-chart-1 pl-4">
                        <div className="font-medium text-sm">4단계: 신청서 제출</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          • 평균 응답시간: 3.3초 • 성공률: 93% • 주요 로그: 정상 제출 확인
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Console Log Trends */}
                <div>
                  <h3 className="font-semibold mb-3">콘솔 로그 트렌드</h3>
                  <div className="border rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-chart-1">146</div>
                        <div className="text-xs text-muted-foreground">INFO 로그</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-chart-2">23</div>
                        <div className="text-xs text-muted-foreground">WARN 로그</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-destructive">8</div>
                        <div className="text-xs text-muted-foreground">ERROR 로그</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">주요 경고 메시지</h5>
                      <div className="bg-chart-2/10 p-3 rounded text-xs">
                        <div className="font-mono">WARN: 사업자등록번호 형식 확인 필요 (3회 발생)</div>
                        <div className="font-mono">WARN: 응답 시간 지연 감지 (2회 발생)</div>
                      </div>
                      
                      <h5 className="font-medium text-sm mt-4">주요 오류 메시지</h5>
                      <div className="bg-destructive/10 p-3 rounded text-xs">
                        <div className="font-mono">ERROR: Network timeout: 서버 응답 없음 (2회 발생)</div>
                        <div className="font-mono">ERROR: Test execution failed: Connection lost (1회 발생)</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Test Steps */}
                <div>
                  <h3 className="font-semibold mb-3">테스트 단계</h3>
                  <div className="space-y-3">
                    {(currentScenario.steps || []).map((step, index) => (
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
                  실행 보고서 - {executionHistoryData.find((h) => h.id === selectedExecutionId)?.executedAt}
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
                          <span>{executionHistoryData.find((h) => h.id === selectedExecutionId)?.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">실행 일시:</span>
                          <span>{executionHistoryData.find((h) => h.id === selectedExecutionId)?.executedAt}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">실행자:</span>
                          <span>{executionHistoryData.find((h) => h.id === selectedExecutionId)?.executedBy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">버전:</span>
                          <span>{executionHistoryData.find((h) => h.id === selectedExecutionId)?.version}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">총 소요시간:</span>
                          <span>{executionHistoryData.find((h) => h.id === selectedExecutionId)?.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">실행 결과</h3>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-chart-1/10 rounded-lg p-3">
                          <div className="text-2xl font-bold text-chart-1">
                            {executionHistoryData.find((h) => h.id === selectedExecutionId)?.passedTests}
                          </div>
                          <div className="text-xs text-muted-foreground">성공</div>
                        </div>
                        <div className="bg-destructive/10 rounded-lg p-3">
                          <div className="text-2xl font-bold text-destructive">
                            {executionHistoryData.find((h) => h.id === selectedExecutionId)?.failedTests}
                          </div>
                          <div className="text-xs text-muted-foreground">실패</div>
                        </div>
                        <div className="bg-chart-2/10 rounded-lg p-3">
                          <div
                            className={`text-2xl font-bold ${getSuccessRateColor(executionHistoryData.find((h) => h.id === selectedExecutionId)?.successRate || 0)}`}
                          >
                            {executionHistoryData.find((h) => h.id === selectedExecutionId)?.successRate}%
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
                    {getExecutionStepsForHistory(selectedExecutionId).map((step, index) => (
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
                                <span>���화 종료:</span>
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

                {/* Summary and Recommendations */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">실행 로그 기반 요약 및 권장사항</h3>
                  
                  {/* Key Findings */}
                  <div className="bg-muted/20 p-4 rounded-lg mb-4">
                    <h4 className="font-medium mb-2 text-primary">🔍 주요 발견사항</h4>
                    <div className="space-y-2 text-sm">
                      <p>• <strong>성공률 93.3%</strong>: 최근 5회 실행 중 평균 성공률로 양호한 수준</p>
                      <p>• <strong>네트워크 이슈</strong>: 전체 실패의 60%가 네트워크 타임아웃으로 발생</p>
                      <p>• <strong>성능 개선</strong>: 최근 3회 실행에서 평균 실행시간이 8% 단축됨</p>
                      <p>• <strong>데이터 검증</strong>: 사업자번호 형식 검증에서 3회 경고 발생</p>
                    </div>
                  </div>

                  {/* Critical Issues */}
                  <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg mb-4">
                    <h4 className="font-medium mb-2 text-destructive">🚨 즉시 조치 필요</h4>
                    <div className="space-y-2 text-sm">
                      <p>• <strong>네트워크 안정성 개선</strong>: 서버 응답 시간 최적화 및 재시도 로직 추가</p>
                      <p>• <strong>UI 선택자 업데이트</strong>: 변경된 DOM 구조에 맞는 안정적인 선택자 적용</p>
                      <p>• <strong>데이터 검증 강화</strong>: 사업자번호 입력 시 실시간 형식 검증 로직 개선</p>
                    </div>
                  </div>

                  {/* Performance Optimization */}
                  <div className="bg-chart-2/10 border border-chart-2/20 p-4 rounded-lg mb-4">
                    <h4 className="font-medium mb-2 text-chart-2">⚡ 성능 최적화 권장사항</h4>
                    <div className="space-y-2 text-sm">
                      <p>• <strong>응답시간 개선</strong>: 3단계(신청서 작성)의 평균 응답시간 5.8초 → 3초 목표</p>
                      <p>• <strong>로딩 최적화</strong>: 메뉴 로딩 지연 문제 해결을 위한 캐싱 전략 적용</p>
                      <p>• <strong>병렬 처리</strong>: 독립적인 검증 로직을 병렬로 실행하여 전체 시간 단축</p>
                    </div>
                  </div>

                  {/* Long-term Improvements */}
                  <div className="bg-chart-1/10 border border-chart-1/20 p-4 rounded-lg mb-4">
                    <h4 className="font-medium mb-2 text-chart-1">📈 장기 개선 계획</h4>
                    <div className="space-y-2 text-sm">
                      <p>• <strong>모니터링 강화</strong>: 실시간 로그 분석 대시보드 구축</p>
                      <p>• <strong>자동 복구</strong>: 일시적 오류 발생 시 자동 재시도 메커니즘 도입</p>
                      <p>• <strong>예측 분석</strong>: 로그 패턴 분석을 통한 장애 예측 시스템 구축</p>
                      <p>• <strong>성능 벤치마크</strong>: 각 단계별 목표 성능 지표 설정 및 모니터링</p>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-primary">🎯 다음 단계</h4>
                    <div className="space-y-1 text-sm">
                      <p>1. <strong>우선순위 1</strong>: 네트워크 타임아웃 이슈 해결 (1주 내)</p>
                      <p>2. <strong>우선순위 2</strong>: UI 선택자 안정성 개선 (2주 내)</p>
                      <p>3. <strong>우선순위 3</strong>: 데이터 검증 로직 강화 (3주 내)</p>
                      <p>4. <strong>장기 목표</strong>: 전체 성공률 98% 이상, 평균 실행시간 10분 이하 달성</p>
                    </div>
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
