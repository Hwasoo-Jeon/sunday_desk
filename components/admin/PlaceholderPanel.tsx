type PlaceholderPanelProps = {
  title: string;
  children: React.ReactNode;
};

export function PlaceholderPanel({ title, children }: PlaceholderPanelProps) {
  return (
    <section className="rounded-lg border border-line bg-white p-5">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-muted">{children}</div>
    </section>
  );
}
