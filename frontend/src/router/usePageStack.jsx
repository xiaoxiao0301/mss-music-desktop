import { useState } from "react";

export function usePageStack() {
  const [stack, setStack] = useState([{ type: "home" }]);

  const push = (page) => setStack((prev) => [...prev, page]);
  const pop = () => setStack((prev) => prev.slice(0, -1));

  const current = stack[stack.length - 1];

  return { stack, current, push, pop };
}
