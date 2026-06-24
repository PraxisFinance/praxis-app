import { HintIcon } from "@/components/icons/base/hintIcon";
import { AchievmentsCommonStatsBg } from "@/components/icons/progress";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getAchievementsLevelProgressPercent } from "@/shared/constants/achievements";

export interface AchievementsCommonStatsProps {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  description: string;
}

export function AchievementsCommonStats({
  level,
  currentXp,
  xpToNextLevel,
  description,
}: AchievementsCommonStatsProps) {
  const progressPercent = getAchievementsLevelProgressPercent(currentXp, xpToNextLevel);

  return (
    <section className="bg-main-lightGray relative h-[140px] overflow-hidden rounded-lg p-[10px]">
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 size-[124px] -translate-y-1/2"
        aria-hidden
      >
        <AchievmentsCommonStatsBg className="size-full" />
      </div>

      <div className="relative z-10 flex h-full w-full flex-col justify-between">
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <h2 className="text-header-3 text-main-darkPurple">Your progress</h2>
            <button
              type="button"
              className="text-main-darkPurple/70 hover:text-main-darkPurple inline-flex shrink-0 transition-colors"
              aria-label="About your progress"
            >
              <HintIcon className="size-3.5" />
            </button>
          </div>
          <p className="text-text-6 text-main-darkPurple w-2/3">{description}</p>
        </div>

        <div className="flex w-full flex-col gap-1.5">
          <ProgressBar
            value={progressPercent}
            variant="ended"
            className="bg-main-grayPurple/80 h-2.5"
          />
          <div className="text-header-5 text-main-darkPurple flex w-full items-center justify-between">
            <span>LvL {level}</span>
            <span className="tabular-nums">
              {currentXp}/{xpToNextLevel} XP
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
