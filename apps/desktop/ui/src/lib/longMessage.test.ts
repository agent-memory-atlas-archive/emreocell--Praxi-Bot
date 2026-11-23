import assert from "node:assert/strict";
import { test } from "node:test";
import { isLongMessage, LONG_ANSWER, LONG_MESSAGE_CHARS, LONG_MESSAGE_LINES } from "./longMessage.ts";

test("short messages stay open", () => {
  assert.equal(isLongMessage("hello"), false);
  assert.equal(isLongMessage("x".repeat(LONG_MESSAGE_CHARS)), false);
});

test("very long or very tall messages fold", () => {
  assert.equal(isLongMessage("x".repeat(LONG_MESSAGE_CHARS + 1)), true);
  assert.equal(isLongMessage(Array(LONG_MESSAGE_LINES + 1).fill("a").join("\n")), true);
  assert.equal(isLongMessage(Array(LONG_MESSAGE_LINES).fill("a").join("\n")), false);
});

test("an answer folds only past the larger answer limits", () => {
  const medium = "x".repeat(LONG_MESSAGE_CHARS + 1);
  assert.equal(isLongMessage(medium, LONG_ANSWER), false);
  assert.equal(isLongMessage("x".repeat(LONG_ANSWER.chars + 1), LONG_ANSWER), true);
  assert.equal(isLongMessage(Array(LONG_ANSWER.lines + 1).fill("a").join("\n"), LONG_ANSWER), true);
});
