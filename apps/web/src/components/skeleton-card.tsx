export default function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="skel w-full" style={{ paddingBottom: "130%" }} />
      <div className="p-3 pb-3.5 space-y-2">
        <div className="skel h-3 w-3/4" />
        <div className="skel h-2.5 w-1/2" />
        <div className="flex gap-2 mt-1.5">
          <div className="skel h-2.5 w-12" />
          <div className="skel h-2.5 w-12" />
        </div>
      </div>
    </div>
  );
}
