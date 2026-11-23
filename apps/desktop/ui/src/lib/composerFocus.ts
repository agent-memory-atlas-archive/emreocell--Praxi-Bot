/**
 * Focus rules of the chat composer, kept pure so they can be tested without a browser:
 * - clicking the empty surface of the composer box focuses the text field;
 * - typing a character anywhere in the chat view (nothing else wants the keys) focuses it too.
 */

const EDITABLE = "input, textarea, select, [contenteditable=''], [contenteditable='true'], [contenteditable='plaintext-only']";
const INTERACTIVE =
  "button, a[href], summary, [role='button'], [role='menuitem'], [role='tab'], [role='option'], [role='checkbox'], [role='switch'], [role='radio'], [role='slider'], [role='combobox'], [role='listbox'], [role='treeitem']";

/** The slice of a DOM element these rules need (so they run without a browser). */
export interface ElementLike {
  closest(selector: string): unknown;
}

function isElementLike(t: unknown): t is ElementLike {
  return typeof t === "object" && t !== null && typeof (t as ElementLike).closest === "function";
}

/** Which hint the empty composer shows. It is only ever the textarea's `placeholder`, never its value. */
export function composerPlaceholderKey(s: { awaitingApproval: boolean; runActive: boolean }): string {
  return s.awaitingApproval ? "chat.placeholderWaiting" : s.runActive ? "chat.placeholderBusy" : "chat.placeholder";
}

/** True when the click landed on the box itself or on plain layout around the field, not on a control. */
export function shouldFocusOnBoxClick(target: unknown, box: { contains(n: unknown): boolean }): boolean {
  if (!isElementLike(target) || !box.contains(target)) return false;
  if (target.closest(`${INTERACTIVE}, ${EDITABLE}, label, [data-no-composer-focus]`)) return false;
  return true;
}

export interface TypeKeyEvent {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  isComposing?: boolean;
  keyCode?: number;
  defaultPrevented?: boolean;
  target: unknown;
}

/** `selectionActive`: the reader selected message text (do not steal that selection with the first key). */
export function shouldTypeToFocus(
  e: TypeKeyEvent,
  state: { composerReady: boolean; dialogOpen: boolean; selectionActive: boolean }
): boolean {
  if (!state.composerReady || state.dialogOpen || state.selectionActive) return false;
  if (e.defaultPrevented || e.isComposing || e.keyCode === 229) return false;
  if (e.ctrlKey || e.metaKey || e.altKey) return false;
  // One printable character; "Enter", "Tab", "Escape", arrows, "Dead" and IME's "Process" are longer.
  if ([...e.key].length !== 1) return false;
  const target = e.target;
  if (isElementLike(target)) {
    if (target.closest(EDITABLE)) return false;
    // Space activates a focused control: leave it alone.
    if (e.key === " " && target.closest(INTERACTIVE)) return false;
  }
  return true;
}
