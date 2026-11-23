import assert from "node:assert/strict";
import { test } from "node:test";
import { runEndAnnouncement } from "./replyAnnounce.ts";

test("nothing is announced while a run streams or when nothing changed", () => {
  assert.equal(runEndAnnouncement(false, true, true, false), null);
  assert.equal(runEndAnnouncement(true, true, true, false), null);
  assert.equal(runEndAnnouncement(false, false, true, false), null);
});

test("one line is announced when a run ends with an answer or fails", () => {
  assert.equal(runEndAnnouncement(true, false, true, false), "replied");
  assert.equal(runEndAnnouncement(true, false, false, false), null);
  assert.equal(runEndAnnouncement(true, false, true, true), "failed");
});
