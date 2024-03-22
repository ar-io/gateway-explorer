import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { incentiveInfoSchema } from "@/lib/incentive/schema";
import { useMemo } from "react"
import { z } from "zod";

const weightNames = [
  "stakeWeight",
  "tenureWeight",
  "gatewayRewardRatioWeight",
  "observerRewardRatioWeight",
  "compositeWeight",
  "normalizedCompositeWeight",
] as const;

const weightLabels: Record<typeof weightNames[number], string> = {
  stakeWeight: "Stake",
  tenureWeight: "Tenure",
  observerRewardRatioWeight: "Observer Reward",
  gatewayRewardRatioWeight: "Gateway Reward",
  compositeWeight: "Composite",
  normalizedCompositeWeight: "Normalized Composite",
};

interface Props {
  weights: z.infer<typeof incentiveInfoSchema>["weights"];
}

export const IncentiveWeights = ({ weights }: Props) => {
  const weightRows = useMemo(
    () => {
      const weightObjects = weightNames
        .map((weightName) => [weightName, weights?.[weightName]])
        .filter(([, value]) => value !== undefined) as [typeof weightNames[number], number][];
      return weightObjects
        .map(([name, value]) => ({
          name,
          value,
          label: weightLabels[name],
        }))
    },
    [weights],
  );

  return (
    <Table>
      <TableHeader>
      </TableHeader>
      <TableBody>
        {weightRows.map((weightRow) => (
          <TableRow key={weightRow.label} className="py-2">
            <TableCell className="font-medium py-2">
              {weightRow.label}
            </TableCell>
            <TableCell className="text-right py-2">
              {
                weightRow.name === "normalizedCompositeWeight" 
                  ? `${(weightRow.value * 100).toPrecision(4)}%` 
                  : weightRow.value.toPrecision(4)
              }
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

