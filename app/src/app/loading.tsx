export default function Loading() {
  return (
    <div className="min-h-dvh grid place-items-center">
      <div className="flex items-center gap-3 text-ink-500">
        <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
        <span className="serif text-lg">Opening the archive…</span>
      </div>
    </div>
  );
}
