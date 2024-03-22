import { incentiveInfoSchema } from "@/lib/incentive/schema"
import { z } from "zod"
import { IncentiveWeights } from "./IncentiveWeights";

interface IncentiveSummary {
  incentiveInfo: z.infer<typeof incentiveInfoSchema>
}

const IncentiveSummary = ({incentiveInfo}: IncentiveSummary) => {
  // Stats
  const epochPassedText = `Passed ${incentiveInfo.stats.passedEpochCount} / ${incentiveInfo.stats.totalEpochParticipationCount} epochs`;
  const epochSubmittedText = `Submitted in ${incentiveInfo.stats.submittedEpochCount} / ${incentiveInfo.stats.totalEpochParticipationCount} epochs`;
  const epochTotalPrescribedVsParticipatedText = `Prescribed in ${incentiveInfo.stats.totalEpochsPrescribedCount} / ${incentiveInfo.stats.totalEpochParticipationCount} epochs`;
  const epochFailedText = `Failed the last ${incentiveInfo.stats.failedConsecutiveEpochs} epochs!`;

  return (
    <div>
      <div>
        <p className="text-lg">Stats</p>
        <ul>
          <li>{epochPassedText}</li>
          <li>{epochSubmittedText}</li>
          <li>{epochTotalPrescribedVsParticipatedText}</li>
          {
            incentiveInfo.stats.failedConsecutiveEpochs > 0 && (
              <li className="text-red-500">{epochFailedText}</li>
            )
          }
        </ul>
      </div>
      <hr className="my-4" />
      <div>
        <p className="text-lg">Weights</p>
        <IncentiveWeights weights={incentiveInfo.weights} />
      </div>
    </div>
  )
}

export { IncentiveSummary }