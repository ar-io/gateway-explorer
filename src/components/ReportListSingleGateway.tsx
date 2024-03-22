
import { ReportListTable } from "./ReportListTable";
import { useGarData } from "@/hooks/useGarData";

interface Props {
  host: string;
}

export const ReportListSingleGateway = ({ host }: Props) => {
  const {
    data: garData,
    isError: isGarError,
  } = useGarData();

  const observer = garData?.find((item) => item.fqdnKey === host)
  const observerNotFound = (garData !== undefined) && (observer === undefined);

  if (observerNotFound) {
    return (
      <div>
        Observer not found
      </div>
    )
  }

  return (
    <ReportListTable
      host={host}
      garData={garData}
      isGarError={isGarError}
      observer={observer}
    />
  )
}
