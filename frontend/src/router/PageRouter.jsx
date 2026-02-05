import SlidePage from "../components/SlidePage";
import { PageRegistry } from "./PageRegistry.jsx";

export function PageRouter({ stack, current, push, pop }) {
  return (
    <div className="w-full h-full relative overflow-hidden">
      {stack.map((page, index) => {
        const PageComponent = PageRegistry[page.type];
        return (
          <SlidePage key={index} show={index === stack.length - 1}>
            <PageComponent
              {...page}
              onBack={pop}
              pushPage={push}
            />
          </SlidePage>
        );
      })}
    </div>
  );
}
