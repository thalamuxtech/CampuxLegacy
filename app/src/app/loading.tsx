export default function Loading() {
  return (
    <div className="min-h-dvh grid place-items-center">
      <div className="flex flex-col items-center gap-5">
        <div className="relative h-10 w-10">
          <span className="absolute inset-0 rounded-full border-2 border-ink/10" />
          <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin" />
        </div>
        <span className="serif text-lg text-ink-500">Opening the archive…</span>
      </div>
    </div>
  );
}
