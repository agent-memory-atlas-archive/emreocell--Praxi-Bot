/** A message longer than this many characters or lines is folded in the list until opened. */
export const LONG_MESSAGE_CHARS = 900;
export const LONG_MESSAGE_LINES = 14;

/** Should a user's message start collapsed? Pure: the view only decides how to draw it. */
export function isLongMessage(
  text: string,
  limits: { chars: number; lines: number } = { chars: LONG_MESSAGE_CHARS, lines: LONG_MESSAGE_LINES }
): boolean {
  if (text.length > limits.chars) {
    return true;
  }
  let lines = 1;
  for (let i = 0; i < text.length; i += 1) {
    if (text.charCodeAt(i) === 10 && (lines += 1) > limits.lines) {
      return true;
    }
  }
  return false;
}

/** Answers are read, not typed: they fold much later than a user's own message. */
export const LONG_ANSWER = { chars: 3500, lines: 45 } as const;
