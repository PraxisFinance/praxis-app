import type { RandomPoolRemainingTime } from "@/shared/types/randomPool";

export function formatRandomPoolRemainingTime(t: RandomPoolRemainingTime): string {
  return `Remain time: ${t.days}d ${t.hours}h ${t.minutes}m ${t.seconds}s`;
}

export function decrementRandomPoolRemainingTime(
  time: RandomPoolRemainingTime,
): RandomPoolRemainingTime {
  let { days, hours, minutes, seconds } = time;

  if (seconds > 0) {
    seconds -= 1;
  } else if (minutes > 0) {
    minutes -= 1;
    seconds = 59;
  } else if (hours > 0) {
    hours -= 1;
    minutes = 59;
    seconds = 59;
  } else if (days > 0) {
    days -= 1;
    hours = 23;
    minutes = 59;
    seconds = 59;
  }

  return { days, hours, minutes, seconds };
}
