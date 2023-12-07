import { CheckSquare, HelpCircle, InfoIcon, XSquare } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Props {
  label: string;
  expected: string | null | undefined;
  actual: string | null | undefined;
}

export const StringComparitor = ({ label, expected, actual }: Props) => {
  if (typeof expected !== "string") {
    return (
      <div className="flex flex-row items-center gap-1 overflow-x-auto">
        <HelpCircle
          size={16}
          className="text-yellow-500 min-w-[16px]"
        />
        <span>{label}: </span>
        <code className="text-muted-foreground">
          ({actual ?? JSON.stringify(actual)})
        </code>
      </div>
    )
  }

  if (expected === actual) {
    return (
      <div className="flex flex-row items-center gap-1 overflow-x-auto">
        <CheckSquare
          size={16}
          className="text-green-500 min-w-[16px]"
        />
        <span>{label}: </span>
        <code className="text-muted-foreground">
          {actual}
        </code>
      </div>
    )
  }

  return (
    <div className="flex flex-row items-center gap-1 overflow-x-auto">
      <XSquare
        size={16}
        className="text-red-500 min-w-[16px]"
      />
      <span>{label}: </span>
      <code className="text-muted-foreground">
        ({actual ?? typeof actual})
      </code>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <InfoIcon
              size={"14"}
            />
          </TooltipTrigger>
          <TooltipContent>
            <span>expected <code className="text-muted-foreground">{expected}</code></span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}