import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatBadge } from "@/components/ui/StatBadge";
import { PoolHeader } from "@/components/ui/PoolHeader";
import type { ProfilePredictionItem } from "@/shared/types/profile";

interface ProfilePredictionCardProps {
  item: ProfilePredictionItem;
  onClaim: (id: string) => void;
}

export function ProfilePredictionCard({ item, onClaim }: ProfilePredictionCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <PoolHeader iconUrl={item.iconUrl} name={item.name} />

        <div className="flex items-center gap-1.5 shrink-0">
          {item.ended && (
            <span className="text-main-darkPurple/50 text-xs font-medium">Ended</span>
          )}
          {item.userWon && (
            <span className="rounded-sm bg-main-success px-2 py-0.5 text-2xs font-semibold text-white">
              Your won
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {item.kind === "pool" ? (
          <>
            <StatBadge label="TVL" value={item.tvl} />
            <StatBadge label="Earnings" value={item.earnings} />
            <StatBadge label="Users won" value={item.usersWon} />
          </>
        ) : (
          <>
            <StatBadge label="Coeff" value={item.coeff} />
            <StatBadge label="Prediction" value={item.prediction} />
            <StatBadge label="Earnings" value={item.earnings} />
          </>
        )}
      </div>

      {item.kind === "pool" && (
        <ProgressBar value={item.progressPercent} variant={item.ended ? "ended" : "live"} />
      )}

      {item.ended ? (
        item.userWon ? (
          <Button variant="primary" size="action" onClick={() => onClaim(item.id)}>
            Claim rewards
          </Button>
        ) : (
          <Button variant="secondaryBrand" size="action" disabled>
            Pool lifetime ended
          </Button>
        )
      ) : (
        <Button variant="secondaryBrand" size="action" disabled>
          In progress
        </Button>
      )}
    </Card>
  );
}
