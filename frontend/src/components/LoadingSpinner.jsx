// 全局 Loading Spinner 组件
export default function LoadingSpinner({ message = "加载中..." }) {
  return (
    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-[999] flex flex-col items-center justify-center pointer-events-none">
      <div className="animate-spin w-8 h-8 border-4 border-warm-primary border-t-transparent rounded-full"></div>
      <p className="text-sm text-warm-subtext mt-2">{message}</p>
    </div>
  );
}
