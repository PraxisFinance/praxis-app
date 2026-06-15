"use client";

import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import type {
  HubMatchDetailTeam,
  HubMatchProbabilityChartPoint,
} from "@/shared/types/hubMatchDetail";
import {
  HUB_MATCH_DETAIL_TEAM1_COLOR,
  HUB_MATCH_DETAIL_TEAM2_COLOR,
} from "./hubMatchDetailTheme";

interface HubMatchDetailProbabilityChartProps {
  volumeLabel: string;
  points: HubMatchProbabilityChartPoint[];
  team1: HubMatchDetailTeam;
  team2: HubMatchDetailTeam;
}

type TeamSnapshot = {
  name: string;
  percent: number;
  color: string;
};

function buildTeamSnapshot(name: string, percent: number, color: string): TeamSnapshot {
  return { name, percent, color };
}

export function HubMatchDetailProbabilityChart({
  volumeLabel,
  points,
  team1,
  team2,
}: HubMatchDetailProbabilityChartProps) {
  const chartData = useMemo(
    () =>
      points.map((point) => ({
        timeLabel: point.timeLabel,
        participantAPercent: point.participantAPercent,
        participantBPercent: point.participantBPercent,
      })),
    [points],
  );

  const { topTeam, bottomTeam } = useMemo(() => {
    const lastPoint = points[points.length - 1];
    if (!lastPoint) {
      return {
        topTeam: buildTeamSnapshot(team2.name, 0, HUB_MATCH_DETAIL_TEAM2_COLOR),
        bottomTeam: buildTeamSnapshot(team1.name, 0, HUB_MATCH_DETAIL_TEAM1_COLOR),
      };
    }

    const team1Snapshot = buildTeamSnapshot(
      team1.name,
      lastPoint.participantAPercent,
      HUB_MATCH_DETAIL_TEAM1_COLOR,
    );
    const team2Snapshot = buildTeamSnapshot(
      team2.name,
      lastPoint.participantBPercent,
      HUB_MATCH_DETAIL_TEAM2_COLOR,
    );

    if (lastPoint.participantAPercent >= lastPoint.participantBPercent) {
      return { topTeam: team1Snapshot, bottomTeam: team2Snapshot };
    }
    return { topTeam: team2Snapshot, bottomTeam: team1Snapshot };
  }, [points, team1.name, team2.name]);

  const chartConfig = {
    participantAPercent: { label: team1.name, color: HUB_MATCH_DETAIL_TEAM1_COLOR },
    participantBPercent: { label: team2.name, color: HUB_MATCH_DETAIL_TEAM2_COLOR },
  } satisfies ChartConfig;

  return (
    <section className="bg-main-lightGray flex flex-col gap-2 rounded-[10px] p-3">
      <p className="text-main-darkPurple/55 text-2xs">{volumeLabel}</p>

      <p
        className="text-right text-2xs leading-tight font-semibold tabular-nums"
        style={{ color: topTeam.color }}
      >
        {topTeam.percent}% {topTeam.name}
      </p>

      <ChartContainer config={chartConfig} className="h-[160px] w-full">
        <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
          <CartesianGrid vertical={false} stroke="#dad8e6" strokeDasharray="3 3" />
          <XAxis
            dataKey="timeLabel"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: "#9787f4" }}
            tickMargin={8}
            interval="preserveStartEnd"
          />
          <YAxis
            orientation="right"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: "#9787f4" }}
            tickMargin={4}
            domain={[30, 65]}
            tickFormatter={(value) => `${value}%`}
          />
          <Line
            type="monotone"
            dataKey="participantAPercent"
            stroke={HUB_MATCH_DETAIL_TEAM1_COLOR}
            strokeWidth={2}
            dot={false}
            activeDot={false}
          />
          <Line
            type="monotone"
            dataKey="participantBPercent"
            stroke={HUB_MATCH_DETAIL_TEAM2_COLOR}
            strokeWidth={2}
            dot={false}
            activeDot={false}
          />
        </LineChart>
      </ChartContainer>

      <p
        className="text-right text-2xs leading-tight font-semibold tabular-nums"
        style={{ color: bottomTeam.color }}
      >
        {bottomTeam.name} {bottomTeam.percent}%
      </p>
    </section>
  );
}
