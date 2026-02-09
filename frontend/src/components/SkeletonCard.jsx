// 骨架屏卡片组件
export function SkeletonCard() {
  return (
    <div className="card p-3 rounded-xl animate-pulse">
      <div className="w-full h-40 bg-gray-200 rounded-lg mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}

// 骨架屏网格
export function SkeletonGrid({ columns = 5, count = 10 }) {
  return (
    <div className={`grid grid-cols-${columns} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// 列表骨架屏
export function SkeletonList({ count = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-3 flex items-center gap-4 animate-pulse rounded-xl">
          <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
