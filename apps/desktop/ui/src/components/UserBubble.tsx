import { ChevronDown } from "lucide-react";
import { type ReactNode, useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { isLongMessage, LONG_ANSWER } from "../lib/longMessage";
import styles from "../views/ChatView.module.css";

/**
 * The user's own bubble. A very long message is folded to a few lines with a
 * fade and a "Show more" toggle; the full text stays in the DOM (find in chat,
 * copy and screen readers still see all of it).
 */
export function UserBubble({ text, children }: { text: string; children: ReactNode }) {
  return <FoldedBody text={text} className={styles.userBubble}>{children}</FoldedBody>;
}

/** A body that folds when `text` is very long (see UserBubble). The assistant's answers use it too. */
export function FoldedBody({
  text,
  className,
  answer = false,
  children
}: {
  text: string;
  className?: string;
  /** An assistant answer: folds later than a typed message. */
  answer?: boolean;
  /** Kept for callers that style the folded state separately; the fold itself is `data-folded`. */
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const long = isLongMessage(text, answer ? LONG_ANSWER : undefined);
  const [open, setOpen] = useState(false);
  const id = useId();
  const folded = long && !open;
  return (
    <>
      <div id={id} className={className} data-folded={folded ? "true" : undefined}>
        {children}
      </div>
      {long ? (
        <button
          type="button"
          className={styles.foldToggle}
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? t("chat.longMessage.less") : t("chat.longMessage.more")}
          <ChevronDown className={open ? styles.foldOpen : undefined} aria-hidden="true" />
        </button>
      ) : null}
    </>
  );
}
