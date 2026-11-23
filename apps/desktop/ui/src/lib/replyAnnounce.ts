/**
 * What a screen reader is told (politely, never mid-sentence) when the conversation changes.
 * The answer itself is not read out while it streams: that would be a flood of fragments.
 * One short line is announced when a run ends.
 */
export type Announcement = "replied" | "failed" | null;

export function runEndAnnouncement(wasActive: boolean, active: boolean, endedWithText: boolean, failed: boolean): Announcement {
  if (!wasActive || active) return null;
  if (failed) return "failed";
  return endedWithText ? "replied" : null;
}
