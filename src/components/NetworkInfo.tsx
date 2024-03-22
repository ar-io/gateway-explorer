import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { DistributionDetails } from "./DistributionDetails"
import { useNetwork } from "@/hooks/useNetwork";
import { ArrowLeftRightIcon, InfoIcon } from "lucide-react";
import { Network } from "@/lib/networks";
import { useState } from "react";

interface Props {
  nextNetwork: Network;
}

const networkTextMap: Map<Network, string> = new Map([
  ['mainnet', ''],
  ['devnet', 'dev'],
  ['testnet', 'test'],
])

const NetworkInfo = (props: Props) => {
  const { nextNetwork } = props;
  const { network, setNetwork } = useNetwork();

  const [open, setOpen] = useState(false);
  
  return (
    <sup className='text-lg text-muted-foreground'>
      <TooltipProvider>
        <Tooltip open={open} onOpenChange={(o) => setOpen(o)}>
          <TooltipTrigger className="flex flex-row items-baseline" onClick={() => setOpen(true)}>
            &nbsp;{networkTextMap.get(network)}
            <InfoIcon size={12} className="ml-0.5" />
          </TooltipTrigger>
          <TooltipContent align="start" className="z-50 font-normal text-sm">
            <DistributionDetails />
            <a onClick={(e) => {
              e.preventDefault()
              setNetwork(nextNetwork)
              window.location.reload()
            }} className="underline cursor-pointer flex flex-row items-baseline mt-2">
              <span className="">Switch to {networkTextMap.get(nextNetwork)}</span><ArrowLeftRightIcon size={12} className='flex ml-0.5' />
            </a>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </sup>
  )
}

export { NetworkInfo }