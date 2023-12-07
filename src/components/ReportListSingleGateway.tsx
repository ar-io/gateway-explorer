
import { useQuery } from "@tanstack/react-query"
import { ReportListTable } from "./ReportListTable";
import { garQuery } from "@/lib/query";

interface Props {
  host: string;
}

export const ReportListSingleGateway = ({ host }: Props) => {
  const {
    data: garData,
    isError: isGarError,
  } = useQuery(garQuery);

  const observer = garData?.find((item) => item.settings.fqdn === host)
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
