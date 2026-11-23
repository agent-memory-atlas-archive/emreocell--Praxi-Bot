import assert from "node:assert/strict";
import { test } from "node:test";
import { showStepDuration, stepState } from "./stepState.ts";

test("each tool status maps to one clear state", () => {
  assert.equal(stepState("requested"), "running");
  assert.equal(stepState("running"), "running");
  assert.equal(stepState("awaiting_approval"), "running");
  assert.equal(stepState("done"), "done");
  assert.equal(stepState("error"), "failed");
  assert.equal(stepState("denied"), "skipped");
  assert.equal(stepState("expired"), "skipped");
});

test("a step whose end never arrived in a finished chain is failed, never running", () => {
  assert.equal(stepState("running", true), "failed");
});

test("durations stay quiet: only for finished steps that took a second or more", () => {
  assert.equal(showStepDuration(250, "done"), false);
  assert.equal(showStepDuration(2400, "done"), true);
  assert.equal(showStepDuration(2400, "running"), false);
  assert.equal(showStepDuration(undefined, "done"), false);
});
