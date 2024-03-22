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
  ArrowUp,
} from "lucide-react"
import { Button } from "./ui/button"
import { formatDuration, mIoToIo } from "@/lib/utils"
import { HostLinksDropdown } from "./HostLinksDropdown"
import { useVisibilityStatePersistent } from "@/hooks/useVisibilityStatePersisent"
import IncentiveHoverCard from "./IncentiveHoverCard"
import DelegatedStakeHoverCard from "./DelegatedStakeHoverCard"

const columns: ColumnDef<z.infer<typeof zGatewayAddressRegistryItem>>[] = [
  {
    id: "Label",
    accessorKey: "settings.label",
    header: "Label",
    // enableHiding: false,
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
    cell: (cell) => {
      return (
        <p className="text-right">
          {mIoToIo(cell.row.original.operatorStake).toFixed(2)}
        </p>
      )
    }
  },
  {
    id: "Auto Stake",
    accessorKey: "settings.autoStake",
    header: "Auto Stake",
    cell: (cell) => <p className="text-center">{cell.row.original.settings.autoStake ? 'Enabled' : 'Disabled'}</p>
  },
  {
    id: "Delegated Stake",
    accessorKey: "totalDelegatedStake",
    header: "Delegated Stake",
    cell: (cell) => {
      if (cell.row.original.totalDelegatedStake === 0) {
        return (
          <p className="text-right">0.00</p>
        )
      }
      return <div className="flex justify-end">
        <DelegatedStakeHoverCard 
          totalDelegatedStake={cell.row.original.totalDelegatedStake}
          delegates={cell.row.original.delegates}
        />
      </div>
    }
  },
  {
    id: "Delegate Status",
    accessorKey: "settings.allowDelegatedStaking",
    header: "Delegate Status",
    cell: (cell) => <p className="text-center">{cell.row.original.settings.allowDelegatedStaking ? 'Allowed' : 'Disabled'}</p>
  },
  {
    id: "Delegate Count",
    accessorKey: "delegateCount",
    header: "Delegate Count",
    cell: (cell) => <p className="text-center">{cell.row.original.delegateCount}</p>
  },
  {
    id: "Delegate Rewards",
    accessorKey: "delegateEffectiveRewardProportion",
    header: "Delegate Rewards",
    cell: (cell) => {
      const isEnabled = cell.row.original.settings.allowDelegatedStaking;
      const originalProportionNonZero = cell.row.original.delegateRewardProportion !== 0;
      return (
        <p className={`text-center ${isEnabled ? "" : `text-muted-foreground ${originalProportionNonZero ? "line-through" : ""}`}`}>
          {(cell.row.original.delegateRewardProportion * 100).toFixed(1)}%
        </p>
      )
    }
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
    id: "Rating",
    accessorKey: 'gatewayRating',
    header: "Rating",
    cell: (cell) => {
      return (
        <IncentiveHoverCard garItem={cell.row.original} />
      )
    }
  },
  {
    id: "Epochs Participated",
    accessorKey: 'stats.totalEpochParticipationCount',
    header: "Epochs Participated",
    cell: (cell) => <p className="text-center">{cell.getValue() as number}</p>,
  },
  {
    id: "Epochs Passed",
    accessorKey: 'stats.passedEpochCount',
    header: "Epochs Passed",
    cell: (cell) => <p className="text-center">{cell.getValue() as number}</p>
  },
  {
    id: "Epochs Submitted",
    accessorKey: 'stats.submittedEpochCount',
    header: "Epochs Submitted",
    cell: (cell) => <p className="text-center">{cell.getValue() as number}</p>
  },
  {
    id: "Epochs Prescribed",
    accessorKey: 'stats.totalEpochsPrescribedCount',
    header: "Epochs Participated",
    cell: (cell) => <p className="text-center">{cell.getValue() as number}</p>
  },
  {
    id: "Epochs Failed",
    accessorKey: 'stats.failedConsecutiveEpochs',
    header: "Epochs Failed",
    cell: (cell) => <p className="text-center">{cell.getValue() as number}</p>
  },
  {
    id: "Observation Chance",
    accessorKey: 'weights.normalizedCompositeWeight',
    header: "Observation Chance",
    cell: (cell) => <p className="text-center">{((cell.getValue() as number) * 100).toFixed(2)}%</p>
  },
  {
    id: "Dropdown Extra",
    accessorKey: "settings.fqdnKey",
    header: "",
    cell: (cell) => {
      const item = cell.row.original;
      return (
        <HostLinksDropdown fqdnKey={item.fqdnKey} />
      )
    },
    enableSorting: false,
    enableHiding: false,
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

  const [columnVisibility, onColumnVisibilityChange] = useVisibilityStatePersistent('gar-table', {
    "Owner ID": false,
    "Properties ID": false,
    "Auto Stake": false,
    "Delegate Status": false,
    "Delegate Count": false,
    "Delegate Rewards": false,
    "Status": false,
    "Start Block": false,
    "Note": false,
    "Uptime": false,
    "Epochs Participated": false,
    "Epochs Passed": false,
    "Epochs Submitted": false,
    "Epochs Prescribed": false,
    "Epochs Failed": false,
    "Observation Chance": false,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange,
    state: {
      sorting,
      columnVisibility,
    },
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