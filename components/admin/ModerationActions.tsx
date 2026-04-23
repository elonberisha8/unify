import * as React from "react";
import { CheckIcon, CloseIcon, FlagIcon, PauseIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface ModerationActionsProps {
  onApprove?: () => void;
  onReject?: () => void;
  onFlag?: () => void;
  onPause?: () => void;
  className?: string;
}

export function ModerationActions({ onApprove, onReject, onFlag, onPause, className }: ModerationActionsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {onApprove && (
        <Button variant="primary" size="sm" onClick={onApprove} className="bg-unify-green hover:bg-unify-green/90">
          <CheckIcon className="h-4 w-4" /> Aprovo
        </Button>
      )}
      {onReject && (
        <Button variant="destructive" size="sm" onClick={onReject}>
          <CloseIcon className="h-4 w-4" /> Refuzo
        </Button>
      )}
      {onFlag && (
        <Button variant="outline" size="sm" onClick={onFlag}>
          <FlagIcon className="h-4 w-4" /> Shëno
        </Button>
      )}
      {onPause && (
        <Button variant="ghost" size="sm" onClick={onPause}>
          <PauseIcon className="h-4 w-4" /> Pauzo
        </Button>
      )}
    </div>
  );
}
