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
import { ColumnSelection } from "./ColumnSelection"
import { 
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
} from "lucide-react"
import { Button } from "./ui/button"
import { useMemo, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link, useNavigate } from "@tanstack/react-router"
import { zGatewayAddressRegistryItem } from "@/types"
import { z } from "zod"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { downloadObserverInfo, queryObserverReportTransactions } from "@/lib/observer/downloadObservation";
import { SortOrder, Transaction } from "arweave-graphql";
import { ReportHistoryTableData, generateReportHistoryTableData } from "@/lib/observer/history";
import { filesize } from "filesize"

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addDefaultLocale(en)

const timeAgo = new TimeAgo('en')

const columns: ColumnDef<ReportHistoryTableData>[] = [
  {
    id: "Observer Id",
    accessorKey: "observer",
    header: "Observer Id",
    cell: (cell) => {
      return (
        <code className="break-all text-xs">
          {cell.row.original.observerId}
        </code>
      )
    }
  },
  {
    id: "Transaction Id",
    accessorKey: "txId",
    header: "Transaction Id",
    cell: (cell) => {
      return (
        <code className="break-all text-xs">
          {cell.row.original.txId}
        </code>
      )
    }
  },
  {
    id: "Timestamp",
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: (cell) => {
      const ts = cell.row.original.timestamp;
      return (
        <code className="break-all text-xs">
          {ts === undefined ? "unknown" : ts}
        </code>
      )
    }
  },
  {
    id: "Uploaded",
    accessorKey: "timestamp",
    header: "Uploaded",
    cell: (cell) => {
      const ts = cell.row.original.timestamp;
      if (ts === undefined) return (<>Unknown</>)
      const u = new Date(0).setUTCSeconds(ts)
      return (
        <>
          {
            Intl.DateTimeFormat("locale", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            }).format(u)
          }
        </>
      )
    }
  },
  {
    id: "Age",
    accessorKey: "timestamp",
    header: "Age",
    cell: (cell) => {
      const ts = cell.row.original.timestamp;
      if (ts === undefined) return (<>Unknown</>)
      const timeAgoString = timeAgo.format(ts * 1000)
      return (
        <>
          {timeAgoString}
        </>
      )
    }
  },
  {
    id: "Size",
    accessorKey: "size",
    header: "Size",
    cell: (cell) => {
      const sizeString = filesize(cell.row.original.size)
      return (
        <>
          {sizeString}
        </>
      )
    }
  },
  {
    id: "Encoding",
    accessorKey: "encoding",
    header: "Encoding",
    cell: (cell) => {
      const encoding = cell.row.original.encoding;
      return (
        <code>
          {encoding ?? "none"}
        </code>
      )
    }
  },
];

interface Props {
  host: string;
  observer?: z.infer<typeof zGatewayAddressRegistryItem>;
  garData?: Array<z.infer<typeof zGatewayAddressRegistryItem>>;
  isGarError: boolean;
}

export const ReportListTable = ({ host, observer, garData, isGarError }: Props) => {
  const {
    data: observerInfo,
    isError: isObserverInfoError,
  } = useQuery({
    queryKey: ['observerInfo', observer?.linkFull],
    queryFn: async () => {
      const res = await downloadObserverInfo(observer!.linkFull)
      return res;
    },
    enabled: observer !== undefined,
  })

  const owners = [
    ...new Set([
      observer?.observerWallet,
      observerInfo?.wallet,
    ]),
  ].filter((item) => item !== undefined).sort() as string[];

  const {
    data: gqlData,
    isError: isGqlError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['observerReportListArweave', owners], 
    queryFn: async ({ pageParam }) => {
      const queryRes = await queryObserverReportTransactions({
        owners: owners,
        sort: SortOrder.HeightDesc,
        after: pageParam,
        first: 20,
      });
      return queryRes;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.transactions.pageInfo.hasNextPage) return undefined;
      const edges = lastPage.transactions.edges;
      return edges[edges.length - 1].cursor;
    },
    getPreviousPageParam: undefined,
    enabled: observer !== undefined && (observerInfo !== undefined || isObserverInfoError),
  });
  const gqlQueryEmpty = gqlData?.pages?.[0].transactions.edges?.length === 0;
  const gqlQueryLengthUnknown = gqlData?.pages[gqlData.pages.length -1].transactions.pageInfo.hasNextPage ?? true;

  const tableData = useMemo(() => {
    if (gqlData === undefined) {
      return []
    }
    return gqlData.pages.map((page) => {
      return page.transactions.edges.map((item) => {
        return generateReportHistoryTableData(item.node as Transaction)
      })
    }).flat()
  }, [gqlData])
  
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
      columnVisibility: {
        "Observer Id": false,
        // "Transaction Id": false,
        "Timestamp": false,
        "Encoding": false,
      }
    }
  })

  const navigate = useNavigate()

  return (
    <>
      <div>
        <div className="text-center md:text-left text-2xl px-1 pb-2">
          Gateway Reports
        </div>
        <div className="pb-2 flex items-center gap-2">
          {/* <Button
            variant={"ghost"}
            size={"iconSm"}
            asChild
          >
            <Link to={"/"} >
              <ArrowLeft />
            </Link>
          </Button> */}
          <Select
            defaultValue={host}
            onValueChange={(value) => {
              if(value !== host) {
                navigate({
                  to: "/gateway/$host/reports",
                  params: { host: value },
                })
              }
            }}
          >
            <SelectTrigger className="md:max-w-xs">
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
          <Button
            variant={"default"}
            asChild
          >
            <Link
              to={"/gateway/$host/reports/current"}
              params={{ host }}
            >
              Go to Current
            </Link>
          </Button>
        </div>
        <div className="relative">
          <div className="right-0 md:absolute md:-top-12">
            <div className="pb-2 flex flex-row items-end gap-2">
              <div className="ml-2 mr-auto md:mr-0 md:ml-auto text-muted-foreground">
                {tableData.length}
                {gqlQueryLengthUnknown ? `/?` : `/${tableData.length}`}
                {' '}loaded
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
              {
              table.getRowModel().rows?.length ? (
                <>
                  {
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        onClick={() => {
                          navigate({
                            to: "/gateway/$host/reports/tx/$txId",
                            params: { host: host, txId: row.original.txId },
                          })
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  }
                  {
                    hasNextPage && (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="text-center">
                          <Button
                            variant="outline"
                            onClick={isFetchingNextPage
                              ? undefined 
                              : () => {fetchNextPage()}
                            }
                            disabled={isFetchingNextPage}
                            className={isFetchingNextPage ? "animate-pulse cursor-wait" : ""}
                          >
                            Load more
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  }
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {(isGarError || isGqlError) 
                      ? "Failed to load history." 
                      : (gqlQueryEmpty
                        ? "No history found."
                        : "Loading history...")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}
