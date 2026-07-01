type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-muted">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-3xl font-semibold text-ink sm:text-4xl">{title}</h1>
      {description ? <p className="mt-4 text-base leading-7 text-muted">{description}</p> : null}
    </div>
  );
}
