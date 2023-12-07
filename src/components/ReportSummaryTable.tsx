import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ColumnSelection } from "./ColumnSelection"
import { 
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
} from "lucide-react"
import { Button } from "./ui/button"
import { useMemo, useState } from "react"
import { PassFailCell } from "./PassFailCell"
import { GatewayAssessmentSummary, generateGatewayAssessmentSummary } from "@/lib/observer/report"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link, useNavigate } from "@tanstack/react-router"
import { ObserverReport } from "@/lib/observer/types"
import { zGatewayAddressRegistryItem } from "@/types"
import { z } from "zod"
import { AssessmentDetails } from "./AssessmentDetails";
import { ReportMetaCard } from "./ReportMetaCard";

const columns: ColumnDef<GatewayAssessmentSummary>[] = [
  {
    id: "Observed Host",
    accessorKey: "gatewayHost",
    header: "Observed Host",
    enableHiding: false,
  },
  {
    id: "Expected Owner",
    accessorKey: "gatewayAssessment.ownershipAssessment.expectedWallet",
    header: "Expected Owner",
    cell: (cell) => <code className="break-all text-xs">{cell.row.original.gatewayAssessment.ownershipAssessment.expectedWallet ?? '<none>'}</code>
  },
  {
    id: "Observed Owner",
    accessorKey: "gatewayAssessment.ownershipAssessment.observedWallet",
    header: "Observed Owner",
    cell: (cell) => <code className="break-all text-xs">{cell.row.original.gatewayAssessment.ownershipAssessment.observedWallet ?? '<none>'}</code>
  },
  {
    id: "Ownership Result",
    accessorKey: "gatewayAssessment.ownershipAssessment.pass",
    header: "Ownership Result",
    cell: (cell) => <PassFailCell pass={cell.row.original.gatewayAssessment.ownershipAssessment.pass} />,
  },
  {
    id: "ArNS Result",
    accessorKey: "gatewayAssessment.arnsAssessments.pass",
    header: "ArNS Result",
    cell: (cell) => (
      <PassFailCell pass={cell.row.original.gatewayAssessment.arnsAssessments.pass}>
        <span className="text-xs text-muted-foreground line-clamp-1">
         ({cell.row.original.statistics.passFail.allNames.pass}
         /
         {cell.row.original.statistics.passFail.allNames.total})
        </span>
      </PassFailCell>
    ),
  },
  {
    id: "Overall Result",
    accessorKey: "gatewayAssessment.pass",
    header: "Overall Result",
    cell: (cell) => <PassFailCell pass={cell.row.original.gatewayAssessment.pass} />,
  },
];

interface Props {
  host: string;
  source: string;
  sourceId?: string;
  garData?: Array<z.infer<typeof zGatewayAddressRegistryItem>>;
  isGarError: boolean;
  reportData?: ObserverReport;
  // TODO: Add reportMeta
  // reportMeta?: ObserverReportMeta;
  isReportError: boolean;
}

const ReportSummaryTable = ({ host, source, sourceId, garData, isGarError, reportData, isReportError }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([])

  const gatewayAssessmentData: GatewayAssessmentSummary[] = useMemo(() => 
    Object.entries(reportData?.gatewayAssessments ?? {})
    .map(
      ([gatewayHost, gatewayAssessment]) => 
        generateGatewayAssessmentSummary(gatewayHost, gatewayAssessment)
    ),
    [reportData?.gatewayAssessments],
  );

  const table = useReactTable({
    data: gatewayAssessmentData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
      columnVisibility: {
        "Expected Owner": false,
        "Observed Owner": false,
      }
    }
  })

  const assessmentCount = gatewayAssessmentData.length ?? 0
  const assessmentPassedCount = gatewayAssessmentData.filter(item => item.gatewayAssessment.pass).length
  
  const navigate = useNavigate()

  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false)
  const [selectedDetailsItemHost, setSelectedDetailsItemHost] = useState<string | undefined>(undefined)

  const selectedDetailsItem = gatewayAssessmentData.find((item) => item.gatewayHost === selectedDetailsItemHost)

  return (
    <>
      <div>
        <div className="flex flex-row justify-center md:justify-start gap-2 md:gap-1 pb-2">
          <Button
            variant={"ghost"}
            size={"iconSm"}
            asChild
          >
            <Link
              to="/gateway/$host/reports"
              params={{ host }}
            >
              <ArrowLeft />
            </Link>
          </Button>
          <span className="text-2xl">
            Gateway Report Results
          </span>
          <div className="sm:w-8" />
        </div>
        <div className="pb-4">
          <ReportMetaCard
            host={(source !== "Current") ? (
              <span>{host}</span>
            ) : (
              <Select
                defaultValue={host}
                onValueChange={(value) => {
                  if(value !== host) {
                    setIsDetailsSheetOpen(false)
                    setSelectedDetailsItemHost(undefined)
                    navigate({
                      to: "/gateway/$host/reports/current",
                      params: { host: value },
                    })
                  }
                }}
              >
                <SelectTrigger className={`ml-auto max-w-sm`}>
                  <SelectValue placeholder={"Select observer"} />
                </SelectTrigger>
                <SelectContent>
                  {
                    garData?.map((item) => (
                      <SelectItem key={item.id} value={item.settings.fqdn}>
                        {item.settings.label} ({item.linkDisplay})
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            )}
            source={source}
            sourceId={sourceId}
            reportData={reportData}
            isError={isGarError || isReportError}
          />
        </div>
        <div className="px-1 py-2 flex items-center gap-2">
          <span className="text-2xl">
            Gateway Assessments
          </span>
        </div>
        <div className="relative">
          <div className="right-0 md:absolute md:-top-12">
            <div className="pb-2 flex flex-row items-end gap-2">
              <div className="ml-2 mr-auto md:mr-0 md:ml-auto text-muted-foreground">
                {assessmentPassedCount}/{assessmentCount} passed
              </div>
              <ColumnSelection table={table} />
            </div>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 bg-secondary/95">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : (
                            header.column.getCanSort() ? (
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  const firstDir = header.column.getFirstSortDir()
                                  const currentDir = header.column.getIsSorted()
                                  if (currentDir == false) {
                                    header.column.toggleSorting(firstDir === "desc")
                                  } else {
                                    if (currentDir === firstDir) {
                                      header.column.toggleSorting(firstDir !== "desc")
                                    } else {
                                      header.column.clearSorting();
                                    }
                                  }
                                }}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {header.column.getIsSorted() ? (
                                  header.column.getIsSorted() === "asc" ? (
                                    <ArrowUp className={`ml-2 h-4 w-4`} />
                                  ) : (
                                    <ArrowDown className={`ml-2 h-4 w-4`} />
                                  )
                                ) : (
                                  <ArrowUpDown className={`ml-2 h-4 w-4`} />
                                )}
                              </Button>
                            ) : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => {
                      setSelectedDetailsItemHost(row.original.gatewayHost)
                      setIsDetailsSheetOpen(true)
                    }}
                    className={selectedDetailsItemHost === row.original.gatewayHost ? "bg-muted hover:bg-muted" : ""}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {(isGarError || isReportError) ? "Failed to load report." : "Loading report..."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <Sheet
        open={isDetailsSheetOpen}
        // onOpenChange={(isOpen) => {
        //   setIsSheetOpen(isOpen)
        // }}
        modal={false}
      >
        <SheetContent
          side="bottom"
          onCloseButtonClick={() => {
            setIsDetailsSheetOpen(false)
            // setSelectedItemId(undefined)
          }}
        >
          <SheetHeader>
            <SheetTitle className='pb-4'>
              Assessment Details
              {/* {selectedItem?.settings.label && <> - <code>{selectedItem?.settings.label}</code></>} */}
            </SheetTitle>
          </SheetHeader>
          {
            selectedDetailsItem &&
              <AssessmentDetails
                reportDatum={selectedDetailsItem}
              />
          }
        </SheetContent>
      </Sheet>
    </>
  )
}

export { ReportSummaryTable }