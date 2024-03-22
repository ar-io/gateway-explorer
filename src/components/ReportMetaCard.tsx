import { ObserverReport } from "@/lib/observer/types"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { timeAgo } from "@/lib/timeago";
import { ReportPasteAndGo } from "./ReportPasteAndGo";
import { z } from "zod";
import { zGatewayAddressRegistryItem } from "@/types";

interface Props {
  host: React.ReactNode;
  source: string;
  txId?: string;
  reportData?: ObserverReport;
  isError: boolean;
  garData?: Array<z.infer<typeof zGatewayAddressRegistryItem>>;
  fqdnKey: string;
}

export const ReportMetaCard = ({ host, source, txId, reportData, isError, garData, fqdnKey }: Props) => {
  const staticRows = (
    <>
      <TableRow>
        <TableCell className="font-medium">Observer Host</TableCell>
        <TableCell className="text-right">{host}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-medium">Report Source</TableCell>
        <TableCell className="text-right">{source}</TableCell>
      </TableRow>
      {txId !== undefined && (
        <TableRow>
          <TableCell className="font-medium">Source ID</TableCell>
          <TableCell className="">
            <div className="ml-auto mr-0 max-w-[26rem]">
              <ReportPasteAndGo
                initialTxId={txId}
                garData={garData}
                fallbackFqdnKey={fqdnKey}
              />
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )

  let rows: React.ReactNode;

  if (isError) {
    rows = (
      <>
        {staticRows}
        <TableRow>
          <TableCell className="font-medium">Observer Address</TableCell>
          <TableCell className="text-right"><span className="text-muted-foreground">Failed</span></TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Epoch Start Height</TableCell>
          <TableCell className="text-right"><span className="text-muted-foreground">Failed</span></TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Generated At</TableCell>
          <TableCell className="text-right"><span className="text-muted-foreground">Failed</span></TableCell>
        </TableRow>
      </>
    )
  } else if (reportData === undefined) {
    rows = (
      <>
        {staticRows}
        <TableRow>
          <TableCell className="font-medium">Observer Address</TableCell>
          <TableCell className="text-right"><Skeleton className="h-4 w-96 ml-auto" /></TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Epoch Start Height</TableCell>
          <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Generated At</TableCell>
          <TableCell className="text-right"><Skeleton className="h-4 w-64 ml-auto" /></TableCell>
        </TableRow>
      </>
    )
  } else {
    const {
      observerAddress,
      generatedAt,
      epochStartHeight,
    } = reportData;

    const datetimeString = new Date(generatedAt * 1000).toLocaleString()
    const generatedAtString = timeAgo.format(generatedAt * 1000)
    const timeString = `${datetimeString} (${generatedAtString})`

    rows = (
      <>
        {staticRows}
        <TableRow>
          <TableCell className="font-medium">Observer Address</TableCell>
          <TableCell className="text-right"><code>{observerAddress}</code></TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Epoch Start Height</TableCell>
          <TableCell className="text-right"><code>{epochStartHeight}</code></TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Generated At</TableCell>
          <TableCell className="text-right">{timeString}</TableCell>
        </TableRow>
      </>
    )
  }

  return (
    <Card>
      <CardContent className="pt-3 px-4">
        <Table>
          <TableBody>
            {rows}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
