import type { ToolItem } from "../state/timeline.ts";
import { isInFlight } from "./stepStuck.ts";

/**
 * The four states a step in the "working" list can show, one icon each:
 * running (spinner), done (check), failed (cross), skipped (dash: it never ran
 * because it was refused or the owner did not answer in time).
 * `waiting` is a step held for the owner's answer; it reads as running.
 */
export type StepState = "running" | "done" | "failed" | "skipped";

/** `orphan`: an in-flight step in a chain that is over (its end never arrived). */
export function stepState(status: ToolItem["status"], orphan = false): StepState {
  if (orphan) return "failed";
  if (status === "done") return "done";
  if (status === "error") return "failed";
  if (status === "denied" || status === "expired") return "skipped";
  return isInFlight(status) || status === "awaiting_approval" ? "running" : "done";
}

/** A finished step's duration is shown only when it is worth a glance (not for instant ones). */
export const QUIET_STEP_MS = 1000;

export function showStepDuration(ms: number | undefined, state: StepState): boolean {
  return ms !== undefined && state !== "running" && ms >= QUIET_STEP_MS;
}
