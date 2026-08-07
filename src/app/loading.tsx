/** Route-level skeleton — mirrors the hero's two-column shape to avoid a jolt. */
export default function Loading() {
  return (
    <div className="container-page grid min-h-[100svh] animate-pulse items-center gap-14 pt-32 lg:grid-cols-[1.35fr_1fr]">
      <div className="flex flex-col gap-5">
        <div className="bg-surface-2 h-7 w-56 rounded-full" />
        <div className="bg-surface-2 h-16 w-full max-w-lg rounded-2xl" />
        <div className="bg-surface-2 h-16 w-3/4 rounded-2xl" />
        <div className="bg-surface-2 mt-4 h-20 w-full max-w-xl rounded-2xl" />
        <div className="mt-4 flex gap-3">
          <div className="bg-surface-2 h-13 w-48 rounded-full" />
          <div className="bg-surface-2 h-13 w-32 rounded-full" />
        </div>
      </div>
      <div className="bg-surface-2 mx-auto aspect-square w-full max-w-sm rounded-full" />
    </div>
  );
}
