import { generateGatewayAssessmentForHost } from "@/lib/observer/runObservation";
import { Button } from "./ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { garQuery } from "@/lib/query";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useRef, useState } from "react";
import { generateGatewayAssessmentSummary } from "@/lib/observer/report";
import { AssessmentDetails } from "./AssessmentDetails";
import { GatewayAssessmentStandalone, observationDb } from "@/lib/idb/observation";
import { ColumnDef, SortingState, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { PassFailCell } from "./PassFailCell";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { ColumnSelection } from "./ColumnSelection";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { useToast } from "./ui/use-toast";

const DEFAULT_ARNS = 'dapp_ardrive';

const columns: ColumnDef<GatewayAssessmentStandalone>[] = [
  {
    id: "Timestamp",
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: (cell) => <span className="text-xs">{new Date(cell.row.original.timestamp).toLocaleString()}</span>
  },
  {
    id: "Observed Host",
    accessorKey: "gatewayAssessmentSummary.gatewayHost",
    header: "Observed Host",
    enableHiding: false,
  },
  {
    id: "Expected Owner",
    accessorKey: "gatewayAssessmentSummary.gatewayAssessment.ownershipAssessment.expectedWallet",
    header: "Expected Owner",
    cell: (cell) => <code className="break-all text-xs">{cell.row.original.gatewayAssessmentSummary.gatewayAssessment.ownershipAssessment.expectedWallet ?? '<none>'}</code>
  },
  {
    id: "Observed Owner",
    accessorKey: "gatewayAssessmentSummary.gatewayAssessment.ownershipAssessment.observedWallet",
    header: "Observed Owner",
    cell: (cell) => <code className="break-all text-xs">{cell.row.original.gatewayAssessmentSummary.gatewayAssessment.ownershipAssessment.observedWallet ?? '<none>'}</code>
  },
  {
    id: "Ownership Result",
    accessorKey: "gatewayAssessmentSummary.gatewayAssessment.ownershipAssessment.pass",
    header: "Ownership Result",
    cell: (cell) => <PassFailCell pass={cell.row.original.gatewayAssessmentSummary.gatewayAssessment.ownershipAssessment.pass} />,
  },
  {
    id: "ArNS Result",
    accessorKey: "gatewayAssessmentSummary.gatewayAssessment.arnsAssessments.pass",
    header: "ArNS Result",
    cell: (cell) => (
      <PassFailCell pass={cell.row.original.gatewayAssessmentSummary.gatewayAssessment.arnsAssessments.pass}>
        <span className="text-xs text-muted-foreground line-clamp-1">
         ({cell.row.original.gatewayAssessmentSummary.statistics.passFail.allNames.pass}
         /
         {cell.row.original.gatewayAssessmentSummary.statistics.passFail.allNames.total})
        </span>
      </PassFailCell>
    ),
  },
  {
    id: "Overall Result",
    accessorKey: "gatewayAssessmentSummary.gatewayAssessment.pass",
    header: "Overall Result",
    cell: (cell) => <PassFailCell pass={cell.row.original.gatewayAssessmentSummary.gatewayAssessment.pass} />,
  },
];

interface Props {
  host: string;
}

export const ObservationListSingleGateway = ({ host }: Props) => {
  const [isAssessmentSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<GatewayAssessmentStandalone | undefined>(undefined);

  const {
    data: garData,
    isError,
  } = useQuery(garQuery);

  const target = garData?.find((item) => item.settings.fqdn === host)
  const targetNotFound = (garData !== undefined) && (target === undefined);

  const {
    mutate,
    isPending,
  } = useMutation({
    mutationKey: ['observationReportCurrent', target?.id],
    mutationFn: async (arnsNames: string[]) => {
      if (target === undefined) throw Error('Target is undefined');
      if (arnsNames.length === 0) throw Error('ArNS Names is undefined');
      const res = await generateGatewayAssessmentForHost(
        target,
        [],
        arnsNames,
      );
      return res;
    },
    onSuccess: async (data) => {
      console.log(`Generated Assessment for ${host}`, data)

      const gatewayAssessmentSummary = generateGatewayAssessmentSummary(host, data);
      const gatewayAssessmentStandalone: GatewayAssessmentStandalone = {
        id: window.crypto.randomUUID(),
        type: "browser",
        timestamp: Date.now(),
        targetGatewayHost: host,
        gatewayAssessmentSummary,
      }

      // Show Summary
      console.log(`Showing summary`, gatewayAssessmentSummary)
      setSelectedAssessment(gatewayAssessmentStandalone)
      setIsDetailsSheetOpen(true)
      
      // Persist
      console.log(`Saving assessment row`, gatewayAssessmentStandalone)
      const result = await observationDb.gatewayAssessments.add(gatewayAssessmentStandalone);
      console.log(`Save result`, result)
    }
  })

  const dbLoadedData = useLiveQuery(
    () => observationDb.gatewayAssessments
      .where('targetGatewayHost')
      .equals(host)
      .toArray(),
    [host],
  );

  const gatewayAssessmentData = dbLoadedData ?? []
  
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "Timestamp",
      desc: true,
    }
  ])

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
        "Observed Host": false,
        "Expected Owner": false,
        "Observed Owner": false,
      }
    }
  })

  const navigate = useNavigate()
  const arnsNamesRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  if (isError) {
    return (
      <div>
        Failed to load Gateway Info
      </div>
    )
  }

  if (targetNotFound) {
    return (
      <div>
        Gateway not found
      </div>
    )
  }

  const canRunAssessment = target !== undefined && !isPending;
  const assessmentCount = gatewayAssessmentData.length ?? 0
  const assessmentPassedCount = gatewayAssessmentData.filter(item => item.gatewayAssessmentSummary.gatewayAssessment.pass).length

  return (
    <div>
      <div className="flex flex-row justify-center lg:justify-start px-1 pb-2">
        <span className="text-2xl">
          Observe Gateway
        </span>
      </div>
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-2 py-2">
        <Select
          defaultValue={host}
          onValueChange={(value) => {
            if(value !== host) {
              setIsDetailsSheetOpen(false)
              setSelectedAssessment(undefined)
              navigate({
                to: "/gateway/$host/observe",
                params: { host: value },
              })
            }
          }}
        >
          <SelectTrigger className={`max-w-[23.5rem] lg:max-w-[12rem] xl:max-w-[23.5rem]`}>
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
        <form
          className="flex flex-row items-baseline gap-2 px-1"
          onSubmit={(event) => {
            event.preventDefault()
            console.log(`Submit`, event)
            
            const arnsNamesRefCurrent = arnsNamesRef.current
            if (arnsNamesRefCurrent === null) return;

            let arnsNames = arnsNamesRefCurrent.value;
            console.log(`ArNS Names`, arnsNames)
            if (arnsNames.length === 0) {
              arnsNamesRefCurrent.value = DEFAULT_ARNS
              arnsNames = DEFAULT_ARNS
            }

            const arnsNamesList = arnsNames
              .split(',')
              .map(item => item.trim())
              .filter(item => item.length > 0)
            // TODO: Validate ArNS Names
            console.log(`ArNS Names`, arnsNamesList)
            if (arnsNamesList.length === 0) {
              toast({
                title: `Please enter valid ArNS name(s)`,
              })
              return;
            }

            mutate(arnsNamesList);
          }}
        >
          <label htmlFor="arnsNames" className="text-sm">
            ArNS:
          </label>
          <Input
            id="arnsNames"
            name="arnsNames"
            ref={arnsNamesRef}
            defaultValue={DEFAULT_ARNS}
            placeholder="e.g. bazar,gateways"
            className={`max-w-[12rem]`}
          />
          <Button
            type="submit"
            className={`w-36 ${!canRunAssessment ? 'cursor-wait' : ''} ${isPending ? 'animate-pulse' : ''}`}
          >
            <span className="line-clamp-1">
              Observe
            </span>
          </Button>
        </form>
      </div>
      <div className="relative">
          <div className="right-0 lg:absolute lg:-top-12">
            <div className="pb-2 flex flex-row items-end gap-2">
              <div className="ml-2 mr-auto lg:mr-0 lg:ml-auto text-muted-foreground">
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
                    setSelectedAssessment(row.original)
                    setIsDetailsSheetOpen(true)
                  }}
                  className={selectedAssessment?.id === row.original.id ? "bg-muted hover:bg-muted" : ""}
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
                  {(isError) ? "Failed to load assessments." : "No assessments."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Sheet
        open={isAssessmentSheetOpen}
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
            selectedAssessment &&
              <AssessmentDetails
                reportDatum={selectedAssessment.gatewayAssessmentSummary}
              />
          }
        </SheetContent>
      </Sheet>
    </div>
  )
}
