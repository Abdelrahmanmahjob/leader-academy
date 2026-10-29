import type { ReactNode } from "react";

export const inputClass =
  "min-h-12 w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 text-base text-foreground " +
  "placeholder:text-foreground/40 outline-none transition-[border-color,background-color,box-shadow] duration-200 " +
  "hover:border-foreground/25 focus:border-accent focus:bg-foreground/[.07] focus:ring-4 focus:ring-accent/20 " +
  "aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-4 aria-[invalid=true]:ring-destructive/20";

type ControlProps = {
  id: string;
  name: string;
  required: true;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
};

type FormFieldProps = {
  name: string;
  label: string;
  error?: string;
  className?: string;
  /** Render the control with the accessibility props already wired up. */
  children: (props: ControlProps) => ReactNode;
};

/** Label + control + inline error, wired together for screen readers. */
export function FormField({
  name,
  label,
  error,
  className = "",
  children,
}: FormFieldProps) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;

  return (
    <div className={`contact-field grid gap-2 ${className}`}>
      <label htmlFor={id} className="text-sm font-bold text-foreground">
        {label}
        <span aria-hidden="true" className="ms-1 text-accent">
          *
        </span>
      </label>
      {children({
        id,
        name,
        required: true,
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? errorId : undefined,
      })}
      {error ? (
        <p
          id={errorId}
          className="text-sm text-[color-mix(in_oklch,var(--destructive),var(--la-foreground)_35%)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
