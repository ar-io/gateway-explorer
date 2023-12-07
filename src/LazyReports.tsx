import { useParams } from "@tanstack/react-router"
import { reportsCurrentRoute, reportsIndexRoute, reportsTxIdRoute } from "./routes"
import { CurrentReport } from "./components/CurrentReport"
import { ReportListSingleGateway } from "./components/ReportListSingleGateway"
import { HistoricReport } from "./components/HistoricReport"

export const ReportsIndex = () => {
  const params = useParams({ from: reportsIndexRoute.id })
  return <ReportListSingleGateway host={params.host} />
}

export const ReportsCurrent = () => {
  const params = useParams({ from: reportsCurrentRoute.id })
  return <CurrentReport host={params.host} />
}

export const ReportsTxId = () => {
  const params = useParams({ from: reportsTxIdRoute.id })
  return <HistoricReport host={params.host} txId={params.txId} />
}
