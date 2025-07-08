const SkeletonLoader = () => {
  return (
    <div className="flex items-center gap-3 p-3 animate-pulse">
      <div className="h-12 w-12 rounded-full bg-slate-700"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded bg-slate-700"></div>
        <div className="h-3 w-1/2 rounded bg-slate-700"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
