import {
  CheckCircle,
  XCircle,
  Play,
  Clock,
  Loader2,
  AlertTriangle,
} from "lucide-react"

export type ScenarioStatus = "completed" | "failed" | "running" | "ready" | "creating" | "error" | "success"

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
    case "success":
      return <CheckCircle className="h-4 w-4 text-chart-1" />
    case "failed":
    case "error":
      return <XCircle className="h-4 w-4 text-destructive" />
    case "running":
      return <Play className="h-4 w-4 text-chart-2" />
    case "creating":
      return <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-chart-2" />
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />
  }
}

export const getStatusText = (status: string) => {
  switch (status) {
    case "completed":
    case "success":
      return "성공"
    case "failed":
      return "실패"
    case "running":
      return "실행중"
    case "ready":
      return "준비 완료"
    case "creating":
      return "준비중"
    case "error":
      return "오류"
    case "warning":
      return "경고"
    default:
      return "알 수 없음"
  }
}

export const getSuccessRateColor = (rate: number) => {
  if (rate >= 90) return "text-chart-1"
  if (rate >= 70) return "text-chart-2"
  return "text-destructive"
}

export const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "completed":
    case "success":
      return "default"
    case "failed":
    case "error":
      return "destructive"
    case "running":
      return "secondary"
    case "ready":
      return "secondary"
    case "creating":
      return "outline"
    case "warning":
      return "secondary"
    default:
      return "destructive"
  }
}

export const getStatusBadgeClassName = (status: string) => {
  switch (status) {
    case "completed":
    case "success":
      return "bg-chart-1/10 text-chart-1 border-chart-1/20"
    case "failed":
    case "error":
      return "bg-destructive/10 text-destructive border-destructive/20"
    case "running":
      return "bg-chart-2/10 text-chart-2 border-chart-2/20"
    case "ready":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20"
    case "creating":
      return "bg-muted/10 text-muted-foreground border-muted/20"
    case "warning":
      return "bg-chart-2/10 text-chart-2 border-chart-2/20"
    default:
      return "bg-destructive/10 text-destructive border-destructive/20"
  }
}

export const getLogLevelColor = (level: string) => {
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

export const getLogLevelBg = (level: string) => {
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

export const getStepStatusIcon = (status: string) => {
  switch (status) {
    case "success":
      return <CheckCircle className="h-4 w-4 text-chart-1" />
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-chart-2" />
    case "failed":
      return <XCircle className="h-4 w-4 text-destructive" />
    case "running":
      return <Play className="h-4 w-4 text-chart-2" />
    case "creating":
      return <Clock className="h-4 w-4 text-muted-foreground" />
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />
  }
}
