
import { useQuery } from "@tanstack/react-query"
import { ReportSummaryTable } from "./ReportSummaryTable";
import { garQuery, reportTxQueryBuilder } from "@/lib/query";

interface Props {
  host: string
  txId: string;
}

export const HistoricReport = ({ host, txId }: Props) => {
  const {
    data: garData,
    isError: isGarError,
  } = useQuery(garQuery);

  const observer = garData?.find((item) => item.fqdnKey === host)
  const observerNotFound = (garData !== undefined) && (observer === undefined);

  const {
    data: reportTxData,
    isError: isReportTxError,
  } = useQuery({
    ...reportTxQueryBuilder(txId),
    enabled: observer !== undefined,
  });

  if (observerNotFound) {
    return (
      <div>
        Observer not found
      </div>
    )
  }

  return (
    <ReportSummaryTable
      host={host}
      source={"Arweave Tx"}
      sourceId={txId}
      garData={garData}
      isGarError={isGarError}
      reportData={reportTxData?.reportData}
      isReportError={isReportTxError}
    />
  )
}
