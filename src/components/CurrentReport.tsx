
import { useQuery } from "@tanstack/react-query"
import { downloadCurrentReportInfoFromGateway } from "@/lib/observer/downloadObservation"
import { ReportSummaryTable } from "./ReportSummaryTable";
import { useGarData } from "@/hooks/useGarData";

interface Props {
  host: string;
}

export const CurrentReport = ({ host }: Props) => {
  const {
    data: garData,
    isError: isGarError,
  } = useGarData();

  const observer = garData?.find((item) => item.fqdnKey === host)
  const observerNotFound = (garData !== undefined) && (observer === undefined);

  const {
    data: reportData,
    isError: isReportError,
  } = useQuery({
    queryKey: ['observationReportCurrent', observer?.id],
    queryFn: async () => {
      return await downloadCurrentReportInfoFromGateway(observer!.linkFull)
    },
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
      source={"Current"}
      // sourceId={}
      garData={garData}
      isGarError={isGarError}
      reportData={reportData}
      isReportError={isReportError}
    />
  )
}
