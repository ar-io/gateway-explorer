import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"
import { IncentiveSummary } from "./IncentiveSummary"
import { z } from "zod"
import { useState } from "react"
import { zGatewayAddressRegistryItem } from "@/types"

interface Props {
  garItem: z.infer<typeof zGatewayAddressRegistryItem>
}

const IncentiveHoverCard = ({garItem}: Props) => {
  const [open, setOpen] = useState(false);  

  return (
    <HoverCard
      open={open}
      onOpenChange={(o) => setOpen(o)}
    >
      <HoverCardTrigger
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <div className="max-w-[16rem]"><span className="text-secondary-foreground/80 line-clamp-1 underline cursor-pointer text-center">
          {`${(garItem.gatewayRating * 100).toFixed(1)}%`}
        </span></div>
      </HoverCardTrigger>
      <HoverCardContent 
        onClick={(e) => e.stopPropagation()}
        className="w-72"
      >
        <IncentiveSummary incentiveInfo={garItem} />
      </HoverCardContent>
    </HoverCard>
  )
}

export default IncentiveHoverCard