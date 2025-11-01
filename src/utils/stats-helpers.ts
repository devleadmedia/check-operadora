import { Stats } from "@/services/checker";

export function hasValidStats(
  stats: Stats | null | undefined | object
): stats is Stats {
  if (!stats || typeof stats !== "object") return false;
  return Object.keys(stats).length > 0;
}

export function getStatsValue(
  stats: Stats | null | undefined | object,
  field: Exclude<keyof Stats, "ddd" | "operadora">,
  fallback: string | number = "-"
): string | number {
  if (!hasValidStats(stats)) return fallback;

  const value = stats[field];

  if (value === undefined || value === null) return fallback;

  return value;
}

export function countDDDs(
  stats: Stats | null | undefined | object
): number | string {
  if (!hasValidStats(stats)) return "-";

  const dddObj = stats.ddd;

  if (!dddObj || typeof dddObj !== "object") return "-";

  return Object.keys(dddObj).length;
}

export function formatNumber(value: number | string | undefined): string {
  if (value === undefined || value === null || value === "-") return "-";

  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) return "-";

  return num.toLocaleString("pt-BR");
}
