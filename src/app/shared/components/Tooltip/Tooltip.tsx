import React, { ReactElement, useState } from "react";
import cn from "classnames";
import { Portal } from "../Portal";
import { useComponentService } from "../../hooks/useComponentService";
import { TooltipService, TooltipServiceParams } from "../../componentsStateServices/TooltipService";
import styles from "./Tooltip.scss";
import { E_TOOLTIP_PLACEMENT } from "app/shared/constants/tooltip";

export const Tooltip = (
  {
    tooltipTargetRef,
    text,
    tooltipPlacement
  }: {
    tooltipTargetRef: React.RefObject<HTMLInputElement>;
    text: string;
    tooltipPlacement: E_TOOLTIP_PLACEMENT;
  }
): ReactElement | null => {
  const [ , setState ] = useState(null);

  const Service = useComponentService<
    TooltipService,
    TooltipServiceParams
    >(
      {
        Service: TooltipService,
        serviceChangeHandler: setState,
        serviceParams: {
          tooltipTargetRef,
          text,
          tooltipPlacement
        }
      }
    );

  return (
    Service.state.showTooltip
      ? (
        <Portal>
          <div className={cn(styles.container)} style={Service.state.tooltipStyles}>{text}</div>
        </Portal>
      )
      : null
  );
};
