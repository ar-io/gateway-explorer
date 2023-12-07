import { GatewayAssessmentSummary } from "@/lib/observer/report"
import { ScrollArea } from "@/components/ui/scroll-area";
import { AssessmentDetailsArNS } from "./AssessmentDetailsArNS";
import { StringComparitor } from "./StringComparitor";
import { PassFailDetails } from "./PassFailDetails";

interface Props {
  reportDatum: GatewayAssessmentSummary
}

export const AssessmentDetails = ({ reportDatum }: Props) => {
  const {
    gatewayHost,
    gatewayAssessment,
    statistics,
  } = reportDatum;

  const {
    ownershipAssessment,
    arnsAssessments,
    pass,
  } = gatewayAssessment;
  
  const {
    expectedWallet,
    observedWallet,
    pass: ownershipPass,
    failureReason: ownershipFailureReason,
  } = ownershipAssessment;

  const {
    pass: arnsPass,
    chosenNames,
    prescribedNames,
  } = arnsAssessments;

  const arnsAllPass = `${statistics.passFail.allNames.pass}/${statistics.passFail.allNames.total}`

  return (
    <ScrollArea className="h-[65vh] sm:h-[55vh] w-full pr-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2 items-center">
          <span className="text-xl">{gatewayHost}</span>
          <PassFailDetails
            pass={pass}
          />
        </div>
        <div>
          <div className="flex flex-row gap-2 items-center pb-2">
            <span className="text-lg">Ownership</span>
            <PassFailDetails
              pass={ownershipPass}
              passText={`Passed (1/1)`}
              failureText={'Failed (0/1)'}
              failureDetails={ownershipFailureReason}
            />
          </div>
          <StringComparitor 
            label="Wallet"
            expected={expectedWallet}
            actual={observedWallet ?? undefined}
          />
        </div>
        <div>
          <div className="flex flex-row gap-2 items-center pb-2">
            <span className="text-lg">ArNS Assessments</span>
            <PassFailDetails
              pass={arnsPass}
              passText={`Passed (${arnsAllPass})`}
              failureText={`Failed (${arnsAllPass})`}
            />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
            {
              Object.entries(chosenNames).map(([arnsName, arnsAssessment]) => (
                <AssessmentDetailsArNS
                  key={arnsName}
                  arnsName={arnsName}
                  arnsAssessment={arnsAssessment}
                  assessmentType="Chosen Name"
                />
              ))
            }
            {
              Object.entries(prescribedNames).map(([arnsName, arnsAssessment]) => (
                <AssessmentDetailsArNS
                  key={arnsName}
                  arnsName={arnsName}
                  arnsAssessment={arnsAssessment}
                  assessmentType="Prescribed Name"
                />
              ))
            }
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
