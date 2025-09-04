export interface PimsScenario {
  id: string
  title: string
  description: string
  status: "completed" | "failed" | "running" | "ready" | "creating" | "error" | "success"
  lastRun: string
  duration: string
  successRate: number
  category: string
  totalRuns: number
  author: string
  createdAt: string
  requirementId: string
  requirementName: string
  detailContent: string
  precondition: string
  testData: string
  expectedResult: string
  tags: string[]
  steps?: { action: string; description: string }[]
}

export interface ExecutionHistory {
  id: string
  executedAt: string
  executedBy: string
  status: "success" | "failed" | "warning" | "running"
  successRate: number
  totalTests: number
  passedTests: number
  failedTests: number
  duration: string
  version: string
}

// 내부 시나리오 데이터 (기본으로 표시되는 시나리오들)
export const internalScenariosData: PimsScenario[] = [
  {
    id: "REQ-BL-00001_TS_001",
    title: "정상 창업 지원프로세스 처리",
    description: "사용자 창업 지원 신청 접수부터 승인까지의 전체 프로세스를 검증합니다. 신청서 작성, 서류 검토, 심사 과정, 최종 승인 단계를 포함합니다.",
    status: "completed",
    lastRun: "2023-08-29 14:17",
    duration: "0.2h",
    successRate: 93.3,
    category: "창업지원",
    totalRuns: 15,
    author: "김예림",
    createdAt: "2023-08-01",
    requirementId: "REQ-BL-00001",
    requirementName: "창업 지원 프로세스 관리",
    detailContent: "창업 지원 신청부터 승인까지의 전체 워크플로우를 관리하며, 각 단계별 검증 로직을 포함합니다.",
    precondition: "1. 사용자 로그인 완료\n2. 창업 지원 신청 권한 확보\n3. 필수 서류 준비",
    testData: "신청자명: 홍길동\n사업자번호: 123-45-67890\n지원금액: 5,000,000원",
    expectedResult: "1. 신청서 정상 제출\n2. 서류 검토 완료\n3. 심사 진행\n4. 승인 처리",
    tags: ["창업지원", "프로세스"],
    steps: [
      { action: "1. 로그인 페이지 접속", description: "사용자 ID/PW 입력 후 로그인" },
      { action: "2. 창업 지원 메뉴 선택", description: "메인 화면에서 창업 지원 메뉴로 이동" },
      { action: "3. 신청서 작성", description: "필수 정보 입력 및 첨부 파일 업로드" },
      { action: "4. 신청서 제출", description: "작성 내용 확인 후 최종 제출" },
    ],
  },
  {
    id: "REQ-BL-00002_TS_002",
    title: "창업 지원 신청 반려 처리",
    description: "부적절한 창업 지원 신청에 대한 반려 프로세스를 검증합니다. 서류 미비, 자격 요건 불충족 등의 사유로 반려되는 경우를 테스트합니다.",
    status: "failed",
    lastRun: "2023-08-29 13:45",
    duration: "0.15h",
    successRate: 87.5,
    category: "창업지원",
    totalRuns: 8,
    author: "이수진",
    createdAt: "2023-08-02",
    requirementId: "REQ-BL-00002",
    requirementName: "창업 지원 반려 프로세스",
    detailContent: "반려 사유 분석, 반려 통지, 재신청 안내 등의 프로세스를 관리합니다.",
    precondition: "1. 반려 대상 신청서 준비\n2. 반려 사유 설정\n3. 반려 권한 확보",
    testData: "신청자명: 김철수\n반려사유: 서류미비\n미비서류: 사업계획서",
    expectedResult: "1. 반려 사유 확인\n2. 반려 처리\n3. 반려 통지 발송\n4. 재신청 안내",
    tags: ["반려처리", "예외상황"],
  },
  {
    id: "REQ-BL-00003_TS_003",
    title: "사업자 등록 검증 프로세스",
    description: "사업자 등록번호 유효성 검증 및 중복 확인 프로세스를 테스트합니다. 국세청 연계를 통한 실시간 검증을 포함합니다.",
    status: "running",
    lastRun: "2023-08-29 15:20",
    duration: "0.3h",
    successRate: 95.2,
    category: "사업자등록",
    totalRuns: 21,
    author: "박민수",
    createdAt: "2023-08-03",
    requirementId: "REQ-BL-00003",
    requirementName: "사업자 등록 검증",
    detailContent: "사업자 등록번호의 형식 검증, 체크섬 확인, 국세청 API 연동을 통한 실시간 검증을 수행합니다.",
    precondition: "1. 국세청 API 연결 확인\n2. 검증 권한 설정\n3. 테스트 사업자번호 준비",
    testData: "사업자번호: 123-45-67890\n대표자명: 홍길동\n상호명: (주)테스트",
    expectedResult: "1. 형식 검증 통과\n2. 국세청 조회 성공\n3. 유효성 확인\n4. 중복 검사 완료",
    tags: ["사업자등록", "검증"],
  },
  {
    id: "REQ-BL-00004_TS_004",
    title: "지원금 지급 프로세스",
    description: "승인된 창업 지원 신청에 대한 지원금 지급 프로세스를 검증합니다. 계좌 확인, 지급 승인, 실제 이체까지의 전 과정을 테스트합니다.",
    status: "ready",
    lastRun: "2023-08-28 16:30",
    duration: "0.25h",
    successRate: 91.7,
    category: "지원금",
    totalRuns: 12,
    author: "최영희",
    createdAt: "2023-08-04",
    requirementId: "REQ-BL-00004",
    requirementName: "지원금 지급 관리",
    detailContent: "지급 대상 확인, 계좌 검증, 지급 승인, 이체 처리, 지급 완료 통지까지의 전체 프로세스를 관리합니다.",
    precondition: "1. 승인된 지원 신청 존재\n2. 지급 계좌 정보 확인\n3. 지급 권한 설정",
    testData: "지급대상: 홍길동\n지급금액: 5,000,000원\n계좌번호: 123-456-789012",
    expectedResult: "1. 지급 대상 확인\n2. 계좌 검증\n3. 지급 승인\n4. 이체 완료",
    tags: ["지원금", "지급"],
  },
  {
    id: "REQ-BL-00004_TS_005",
    title: "지원금 지급 프로세스2",
    description: "지원금 지급 과정에서 발생할 수 있는 오류 상황을 처리하는 프로세스를 검증합니다. 계좌 오류, 한도 초과 등의 예외 상황을 테스트합니다.",
    status: "creating",
    lastRun: "2023-08-28 16:30",
    duration: "0.25h",
    successRate: 91.7,
    category: "지원금",
    totalRuns: 9,
    author: "정수현",
    createdAt: "2023-08-05",
    requirementId: "REQ-BL-00004",
    requirementName: "지원금 지급 관리",
    detailContent: "지급 과정에서 발생하는 다양한 오류 상황에 대한 예외 처리 및 복구 절차를 관리합니다.",
    precondition: "1. 지급 오류 시나리오 설정\n2. 오류 처리 권한 확보\n3. 복구 절차 준비",
    testData: "오류유형: 계좌정보불일치\n지원금액: 3,000,000원\n오류계좌: 999-999-999999",
    expectedResult: "1. 오류 감지 및 알림\n2. 오류 사유 분석\n3. 복구 절차 안내\n4. 재처리 또는 반려",
    tags: ["예외처리", "오류복구"],
  },
]

// PIMS에서 가져올 새로운 시나리오들
export const pimsImportScenarios: PimsScenario[] = [
  {
    id: "PIMS-001_TS_001",
    title: "온라인 사업자 등록 신청",
    description: "온라인을 통한 사업자 등록 신청 프로세스의 전체 워크플로우를 검증합니다.",
    status: "error",
    lastRun: "2023-09-03 10:30",
    duration: "0.4h",
    successRate: 89.2,
    category: "사업자등록",
    totalRuns: 5,
    author: "김개발",
    createdAt: "2023-09-01",
    requirementId: "PIMS-001",
    requirementName: "온라인 사업자 등록",
    detailContent: "온라인 사업자 등록 신청부터 승인까지의 디지털 프로세스를 관리합니다.",
    precondition: "1. 온라인 시스템 접속\n2. 필수 서류 디지털화\n3. 전자서명 준비",
    testData: "신청자명: 테스트사용자\n사업자번호: 999-99-99999\n업종: 소프트웨어개발",
    expectedResult: "1. 온라인 신청 완료\n2. 서류 업로드\n3. 전자서명\n4. 접수 확인",
    tags: ["온라인", "사업자등록"],
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
    totalRuns: 3,
    author: "김개발",
    createdAt: "2023-09-02",
    requirementId: "PIMS-002",
    requirementName: "세무 신고 자동화",
    detailContent: "세무 신고 자동화 시스템의 정확성과 안정성을 검증합니다.",
    precondition: "1. 세무 데이터 준비\n2. 자동화 시스템 설정\n3. 신고 권한 확보",
    testData: "신고유형: 부가세\n신고기간: 2023년 3분기\n사업자번호: 123-45-67890",
    expectedResult: "1. 데이터 자동 수집\n2. 신고서 자동 작성\n3. 검증 완료\n4. 자동 제출",
    tags: ["세무", "자동화"],
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
    totalRuns: 2,
    author: "김개발",
    createdAt: "2023-09-03",
    requirementId: "PIMS-003",
    requirementName: "지원금 통합 신청",
    detailContent: "여러 정부 지원금을 통합 신청하는 프로세스의 효율성을 검증합니다.",
    precondition: "1. 지원금 정보 확인\n2. 신청 자격 검증\n3. 필수 서류 준비",
    testData: "신청금종: 창업지원금, R&D지원금\n신청금액: 10,000,000원\n신청자: 테스트기업",
    expectedResult: "1. 통합 신청서 작성\n2. 자격 요건 검증\n3. 서류 제출\n4. 신청 완료",
    tags: ["지원금", "통합신청"],
  },
]

// 전체 시나리오 데이터 (내부 + PIMS 시나리오)
export const allScenariosData: PimsScenario[] = [...internalScenariosData, ...pimsImportScenarios]

// 기본 시나리오 데이터 (호환성을 위해 유지)
export const scenariosData: PimsScenario[] = allScenariosData

// 실행 이력 데이터
export const executionHistoryData: ExecutionHistory[] = [
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
    status: "success",
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

// 유틸리티 함수들
export const getScenarioById = (id: string): PimsScenario | undefined => {
  return scenariosData.find(scenario => scenario.id === id)
}

export const getScenariosByCategory = (category: string): PimsScenario[] => {
  if (category === "all") return scenariosData
  return scenariosData.filter(scenario => scenario.category === category)
}

export const getExecutionHistoryById = (id: string): ExecutionHistory | undefined => {
  return executionHistoryData.find(history => history.id === id)
}