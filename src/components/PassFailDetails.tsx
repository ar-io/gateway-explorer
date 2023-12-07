import { Badge, BadgeProps } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react";

interface PassFailDetailsProps {
  pass: boolean;
  passText?: string;
  failureText?: string;
  failureDetails?: string;
  size?: BadgeProps["size"];
}

export const PassFailDetails = ({ pass, passText, failureText, failureDetails, size }: PassFailDetailsProps) => {
  if (pass) {
    return (
      <Badge
        size={size}
        className="text-green-600 bg-green-100"
      >
        {passText ?? "Passed"}
      </Badge>
    )
  }

  if (failureDetails) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge
              size={size}
              className="text-red-600 bg-red-100"
            >
              {failureText ?? "Failed"}
              <InfoIcon
                size={"12"}
                className="ml-0.5"
              />
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <pre className="max-w-md overflow-x-auto">
              {failureDetails}
            </pre>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  
  return (
    <Badge
      size={size}
      className="text-red-600 bg-red-100"
    >
      {failureText ?? "Failed"}
    </Badge>
  )
}
