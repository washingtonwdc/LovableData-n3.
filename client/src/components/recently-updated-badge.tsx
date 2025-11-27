import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sparkles } from "lucide-react";

interface RecentlyUpdatedBadgeProps {
    updatedAt: string;
    daysThreshold?: number;
}

export function RecentlyUpdatedBadge({ updatedAt, daysThreshold = 7 }: RecentlyUpdatedBadgeProps) {
    const daysSinceUpdate = Math.floor(
        (Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceUpdate > daysThreshold) {
        return null;
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800 animate-pulse"
                    >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Atualizado
                    </Badge>
                </TooltipTrigger>
                <TooltipContent>
                    Atualizado há {daysSinceUpdate} {daysSinceUpdate === 1 ? 'dia' : 'dias'}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
