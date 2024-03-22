import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"
import { z } from "zod"
import { useState } from "react"
import { zGatewayAddressRegistryItem } from "@/types"
import { DelegateSummary } from "./DelegateSummary"
import { mIoToIo } from "@/lib/utils"

interface Props {
  totalDelegatedStake: z.infer<typeof zGatewayAddressRegistryItem>['totalDelegatedStake']
  delegates: z.infer<typeof zGatewayAddressRegistryItem>['delegates']
}

const DelegatedStakeHoverCard = ({totalDelegatedStake, delegates}: Props) => {
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
        <span className="line-clamp-1 underline cursor-pointer text-center">
          {mIoToIo(totalDelegatedStake).toFixed(2)}
        </span>
      </HoverCardTrigger>
      <HoverCardContent 
        onClick={(e) => e.stopPropagation()}
        className="w-full"
      >
        <DelegateSummary delegates={delegates} />
      </HoverCardContent>
    </HoverCard>
  )
}

export default DelegatedStakeHoverCard