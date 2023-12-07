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

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en')

interface Props {
  host: React.ReactNode;
  source: string;
  sourceId?: string;
  reportData?: ObserverReport;
  isError: boolean;
}

export const ReportMetaCard = ({ host, source, sourceId, reportData, isError }: Props) => {
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
      {sourceId !== undefined && (
        <TableRow>
          <TableCell className="font-medium">Source ID</TableCell>
          <TableCell className="text-right"><code>{sourceId}</code></TableCell>
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
