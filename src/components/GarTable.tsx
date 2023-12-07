import { zGatewayAddressRegistryItem } from "@/types"
import { z } from "zod"
import * as React from "react"
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
import { RefreshButton } from "./RefreshButton"
import { 
  ArrowUpDown,
  ArrowDown,
  ArrowUp
} from "lucide-react"
import { Button } from "./ui/button"
import { formatDuration } from "@/lib/utils"
import { Link } from "@tanstack/react-router"

const columns: ColumnDef<z.infer<typeof zGatewayAddressRegistryItem>>[] = [
  {
    id: "Label",
    accessorKey: "settings.label",
    header: "Label",
    enableHiding: false,
  },
  {
    id: "Address",
    accessorKey: "settings.fqdn",
    header: "Address",
    cell: (cell) => {
      return (
        <a
          href={`${cell.row.original.linkFull}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
          onClick={(e) => {e.stopPropagation()}}
        >
          {cell.row.original.linkDisplay}
        </a>
      )
    }
  },
  {
    id: "Owner ID",
    accessorKey: "id",
    header: "Owner ID",
    cell: (cell) => {
      return (
        <code className="break-all text-xs">
          {cell.row.original.id}
        </code>
      )
    }
  },
  {
    id: "Properties ID",
    accessorKey: "settings.properties",
    header: "Properties ID",
    cell: (cell) => {
      return (
        <code className="break-all text-xs">
          {cell.row.original.settings.properties}
        </code>
      )
    }
  },
  {
    id: "Stake",
    accessorKey: "operatorStake",
    header: "Stake",
  },
  {
    id: "Status",
    accessorKey: "status",
    header: "Status",
    cell: (cell) => <code>{cell.row.original.status}</code> 
  },
  {
    id: "Start Block",
    accessorKey: "start",
    header: "Start Block",
    sortDescFirst: false,
  },
  {
    id: "Note",
    accessorKey: "settings.note",
    header: "Note",
    cell: (cell) => <div className="max-w-[16rem]"><span className="text-muted-foreground line-clamp-1">{cell.row.original.settings.note}</span></div>
  },
  {
    id: "Ping",
    accessorKey: "ping.value",
    header: "Ping",
    size: 1,
    cell: (cell) => {
      const status = cell.row.original.ping.status;
      switch (status) {
        case "success":
          return (
            <div className="flex flex-row items-center">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <span className="ml-1 text-xs text-muted-foreground">{cell.row.original.ping.value}ms</span>
            </div>
          )
        case "pending":
          return (
            <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
          )
        case "error":
          return (
            <div className="h-2 w-2 rounded-full bg-red-500" />
          )
        default:
          return (
            <div className="h-2 w-2 rounded-full bg-gray-400" />
          )
      }
    },
    sortDescFirst: false,
    sortUndefined: 1,
  },
  {
    id: "Uptime",
    accessorKey: "health.uptime",
    header: "Uptime",
    size: 20,
    cell: (cell) => {
      const status = cell.row.original.health.status;
      switch (status) {
        case "success":
          return (
            <div className="flex flex-row items-center max-w-[6rem]">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <span className="ml-1 text-xs text-muted-foreground line-clamp-1 text-clip">{formatDuration(cell.row.original.health.uptime * 1000, true)}</span>
            </div>
          )
        case "pending":
          return (
            <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
          )
        case "error":
          return (
            <div className="h-2 w-2 rounded-full bg-red-500" />
          )
        default:
          return (
            <div className="h-2 w-2 rounded-full bg-gray-400" />
          )
      }
    },
    sortUndefined: -1,
  },
  {
    id: "Observer Reports",
    accessorKey: "settings.fqdn",
    header: "Observer Reports",
    cell: (cell) => {
      const item = cell.row.original;
      return (
        <Button
          className="h-auto px-1 py-0 text-xs text-muted-foreground"
          size={"sm"}
          variant={"outline"}
          asChild
        >
          <Link
            to="/gateway/$host/reports"
            params={{ host: item.settings.fqdn }}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="line-clamp-1">
              View Reports
            </span>
          </Link>
        </Button>
      )
    },
    enableSorting: false,
  },
  {
    id: "Observe",
    accessorKey: "observation.status",
    header: "Observe",
    cell: (cell) => {
      const item = cell.row.original;
      return (
        <Button
          className="h-auto px-1 py-0 text-xs text-muted-foreground"
          size={"sm"}
          variant={"outline"}
          asChild
        >
          <Link
            to="/gateway/$host/observe"
            params={{ host: item.settings.fqdn }}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="line-clamp-1">
              Observe Now
            </span>
          </Link>
        </Button>
      )
    },
    enableSorting: false,
  },
]

interface Props {
  data: Array<z.infer<typeof zGatewayAddressRegistryItem>>
  onRefresh: () => void
  isRefreshing: boolean
  onItemUpdate: (item: z.infer<typeof zGatewayAddressRegistryItem>) => void
  onItemSelect: (item: z.infer<typeof zGatewayAddressRegistryItem>) => void
  selectedItemId?: string
}

const GarTable = ({ data, onRefresh, isRefreshing, onItemSelect, selectedItemId }: Props) => {
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "Stake",
      desc: true,
    },
  ])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
      columnVisibility: {
        "Owner ID": false,
        "Properties ID": false,
        "Status": false,
        "Start Block": false,
        "Note": false,
        "Uptime": false,
      },
    }
  })

  const healthy = data.filter((item) => item.health.status === "success").length
 
  return (
    <div className="relative">
      <div className="right-0 md:absolute md:-top-12">
        <div className="pb-2 flex flex-row items-end gap-2">
          <div className="ml-2 mr-auto md:mr-0 md:ml-auto text-muted-foreground">{healthy}/{data.length} online</div>
          <ColumnSelection table={table} />
          <RefreshButton onClick={onRefresh} isRefreshing={isRefreshing}/>
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
                  onClick={() => onItemSelect(row.original)}
                  className={selectedItemId === row.original.id ? "bg-muted hover:bg-muted" : ""}
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
                  Loading Gateway Address Registry...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export { GarTable }