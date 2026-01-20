export default function SlidePage({ show, children }) {
  return (
    <div
      className={`
        absolute top-0 left-0 w-full h-full
        transition-all duration-300 ease-out
        ${show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
    >
      {children}
    </div>
  );
}
