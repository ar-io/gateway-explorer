interface PassFailCellProps {
  pass: boolean;
  children?: React.ReactNode;
}

export const PassFailCell = ({ pass, children }: PassFailCellProps) => {
  return (
    pass ? (
      <div className="flex flex-row items-center max-w-[10rem] gap-1">
        <div className="h-2 w-2 rounded-full bg-green-400" />
        <span className="ml-1 text-xs text-muted-foreground line-clamp-1">Pass</span>
        {children}
      </div>
    ) : (
      <div className="flex flex-row items-center max-w-[8rem] gap-1">
        <div className="h-2 w-2 rounded-full bg-red-400" />
        <span className="ml-1 text-xs text-muted-foreground line-clamp-1">Fail</span>
        {children}
      </div>
    )
  )
}
