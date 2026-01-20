export default function TopNavBar({ onBack, onForward }) {
  return (
    <div className="flex items-center gap-3 mb-4 select-none">

      {/* 返回按钮 */}
      <button
        onClick={onBack}
        className="w-8 h-8 rounded-full bg-warm-secondary hover:bg-warm-secondary/70 flex items-center justify-center"
      >
        <span className="text-lg">←</span>
      </button>

      {/* 前进按钮（可选） */}
      {onForward && (
        <button
          onClick={onForward}
          className="w-8 h-8 rounded-full bg-warm-secondary hover:bg-warm-secondary/70 flex items-center justify-center"
        >
          <span className="text-lg">→</span>
        </button>
      )}

    </div>
  );
}
