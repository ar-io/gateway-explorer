import { useNetwork } from "@/hooks/useNetwork";
import { fetchDistributions } from "@/lib/distribution/fetchDistributions";
import { useQuery } from "@tanstack/react-query";
import { fetchBalanceContract } from "@/lib/balance/fetchBalance";
import { networkConfigMap } from "@/lib/networks";
import { capitalizeWord, mIoToIo } from "@/lib/utils";
import { DISTRIBUTION_PROPORTION_PER_EPOCH } from "@/lib/distribution/distribution";

const DistributionDetails = () => {
  const { network } = useNetwork();
  const { data: distributionsData } = useQuery({
    queryKey: ['distributions', network],
    queryFn: () => fetchDistributions(network),
  });

  const { data: balanceContractData } = useQuery({
    queryKey: ['balance', network],
    queryFn: () => fetchBalanceContract(network),
  })

  if (distributionsData === undefined || balanceContractData === undefined) 
    return <div>Loading...</div>;

  return (
    <div>
      <p className="text-lg pb-0.5">
        <a href={`https://viewblock.io/arweave/tx/${networkConfigMap[network].contractTxIds.garCache}`} target="_blank" className="underline cursor-pointer"><span className=" ">{capitalizeWord(network)}</span> contract</a>&nbsp;
        <span className="text-sm text-secondary-foreground/80">
          (block <code className="text-xs">{distributionsData.epochZeroStartHeight}</code>+)
        </span>
      </p>
      <p className="text-secondary-foreground/80">Epoch #{distributionsData.epochPeriod}&nbsp;
        <span className="text-sm">
          (block <code className="text-xs">{distributionsData.epochStartHeight}</code>–<code className="text-xs">{distributionsData.epochEndHeight}</code>)
        </span>
      </p>
      <div className="text-secondary-foreground/80">
        <p className="text-sm">Distributing ~{mIoToIo(balanceContractData * DISTRIBUTION_PROPORTION_PER_EPOCH).toFixed(2)} <a href="https://docs.ar.io/token/" className="underline cursor-pointer">$IO</a> at block <code className="text-xs">{distributionsData.nextDistributionHeight}</code></p>
      </div>
    </div>
  )
}

export { DistributionDetails }