import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "@tanstack/react-router";
import { MoreVertical } from "lucide-react";

interface HostLinksDropdownProps {
  fqdnKey: string
}

const HostLinksDropdown = (props: HostLinksDropdownProps) => {
  const { fqdnKey } = props;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
        <MoreVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link
          to="/gateway/$host/observe"
          params={{ host: fqdnKey }}
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuItem>
            Run Observation
          </DropdownMenuItem>
        </Link>
        <Link
          to="/gateway/$host/reports"
          params={{ host: fqdnKey }}
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuItem
            className="cursor-pointer"
          >
            View Reports
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

  export { HostLinksDropdown }