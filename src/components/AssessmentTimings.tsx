import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArnsNameAssessment } from "@/lib/observer/types"
import { useMemo } from "react"

const timingNames = [
  "wait",
  "dns",
  "tcp",
  "tls",
  "firstByte",
  "download",
  "total",
] as const;

const timingLabels: Record<typeof timingNames[number], string> = {
  wait: "Wait",
  dns: "DNS",
  tcp: "TCP",
  tls: "TLS",
  firstByte: "First Byte",
  download: "Download",
  total: "Total",
};

interface Props {
  timings: ArnsNameAssessment["timings"];
}

export const AssessmentTimings = ({ timings }: Props) => {
  const timingRows = useMemo(
    () => {
      const timingObjects = timingNames
        .map((timingName) => [timingName, timings?.[timingName]])
        .filter(([, value]) => value !== undefined) as [typeof timingNames[number], number][];
      return timingObjects
        .map(([name, value]) => ({
          name,
          value,
          label: timingLabels[name],
        }))
    },
    [timings],
  );

  const shouldExpandDefault = timingRows.length === 1;

  return (
    <Accordion type="single" collapsible defaultValue={shouldExpandDefault ? "timings" : undefined}>
      <AccordionItem value="timings" className="max-w-screen-sm">
        <AccordionTrigger disabled={timings === undefined}>Timings</AccordionTrigger>
        <AccordionContent>
          {
            timings && (
              <Table>
                <TableHeader>
                </TableHeader>
                <TableBody>
                  {timingRows.map((timingRow) => (
                    <TableRow key={timingRow.label}>
                      <TableCell className="font-medium">{timingRow.label}</TableCell>
                      <TableCell className="text-right">{timingRow.value}ms</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )
          }
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

