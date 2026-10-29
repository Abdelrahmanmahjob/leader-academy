import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type DockItemContentProps = {
  Icon: LucideIcon;
  label: string;
  selected: boolean;
  /** Extra element that collapses together with the label (e.g. a chevron). */
  trailing?: ReactNode;
};

/**
 * Icon + collapsible label. The label opens when the parent (.group/dock) is selected, open,
 * hovered or keyboard-focused. It stays in the DOM, so the accessible name is always there.
 * The width animates with the grid 0fr -> 1fr technique, so no measuring or JS is needed.
 */
export function DockItemContent({
  Icon,
  label,
  selected,
  trailing,
}: DockItemContentProps) {
  const open =
    "group-hover/dock:grid-cols-[1fr] group-focus-visible/dock:grid-cols-[1fr] " +
    "group-data-[selected=true]/dock:grid-cols-[1fr] group-data-[open=true]/dock:grid-cols-[1fr]";
  const show =
    "group-hover/dock:opacity-100 group-focus-visible/dock:opacity-100 " +
    "group-data-[selected=true]/dock:opacity-100 group-data-[open=true]/dock:opacity-100";

  return (
    <>
      <Icon
        className="size-5 shrink-0 transition-transform duration-300 group-hover/dock:-translate-y-px"
        strokeWidth={selected ? 2 : 1.6}
        aria-hidden="true"
      />
      <span
        className={`grid grid-cols-[0fr] transition-[grid-template-columns] duration-500 ease-out ${open}`}
      >
        <span className="overflow-hidden">
          <span
            className={`flex items-center whitespace-nowrap ps-2.5 opacity-0 transition-opacity duration-300 ${show}`}
          >
            {label}
            {trailing}
          </span>
        </span>
      </span>
    </>
  );
}
