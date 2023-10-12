import React, { ReactElement, ReactPortal, useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  children: HTMLElement | ReactElement | undefined;
  portalRootElementId?: string;
}

export const Portal = (
  {
    children,
    portalRootElementId = "portal-root"
  }: Props
): ReactPortal => {
  const el = React.useRef<HTMLElement>();

  if (!el.current) {
    el.current = document.createElement("div");
  }

  useEffect(() => {
    const portalRootElement: HTMLElement | null = document.getElementById(portalRootElementId);
    if (portalRootElement && el.current) {
      portalRootElement.appendChild(el.current);
    }

    return () => {
      if (portalRootElement && el.current) {
        portalRootElement.removeChild(el.current);
      }
    };
  }, [ portalRootElementId ]);

  return createPortal(children, el.current);
};
