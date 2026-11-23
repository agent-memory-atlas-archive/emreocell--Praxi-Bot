import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import styles from "./MessageActions.module.css";

/**
 * Hover/focus action row anchored under a user or assistant message bubble.
 * Action buttons stay keyboard-focusable and reveal smoothly on row hover,
 * focus-within, or while an action is active (e.g. "Copied" confirmation).
 */
export function MessageActions({
  side,
  meta,
  children
}: {
  side: "bot" | "me";
  /** Persistent subtle metadata such as the message timestamp. */
  meta?: ReactNode;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const group = (
    <div
      className={styles.actions}
      role="group"
      aria-label={t("chat.messageActions")}
      data-testid="message-actions"
    >
      {children}
    </div>
  );
  return (
    <div className={`${styles.row} ${side === "me" ? styles.rowUser : styles.rowBot}`}>
      {side === "me" ? (
        <>
          {group}
          {meta}
        </>
      ) : (
        <>
          {meta}
          {group}
        </>
      )}
    </div>
  );
}
