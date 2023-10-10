import React, {
  CSSProperties,
  JSXElementConstructor,
  MutableRefObject,
  ReactElement,
  RefObject,
  useRef,
  useState
} from "react";
import cn from "classnames";
import { Portal } from "../Portal";
import { useComponentService } from "../../hooks/useComponentService";
import { TooltipService, TooltipServiceParamsType } from "../../componentsStateServices/TooltipService";
import tooltipStyles from "./Tooltip.scss";
import { E_TOOLTIP_PLACEMENT } from "app/shared/constants/tooltip";

export type TooltipStateType = {
  text: string;
  tooltipPlacement: E_TOOLTIP_PLACEMENT;
  showTooltip: boolean;
  tooltipStyles: CSSProperties;
}

export const Tooltip = (
  {
    children,
    text,
    tooltipPlacement,
    styles
  }: {
    children: ReactElement;
    text: string;
    tooltipPlacement: E_TOOLTIP_PLACEMENT;
    styles?: CSSProperties
  }
): ReactElement | null => {
  const tooltipTargetRef: MutableRefObject<null | ReactElement> = useRef(null);

  const initialState: TooltipStateType = {
    text,
    tooltipPlacement,
    showTooltip: false,
    tooltipStyles: {
      position: "absolute",
      top: "0px",
      left: "0px",
      width: "0px"
    }
  };

  const [ state, setComponentState ] = useState<TooltipStateType>(initialState);

  const setState = (newStatePart: Partial<TooltipStateType>) => {
    setComponentState(currentState => ({
      ...currentState,
      ...newStatePart
    }));
  };

  const getState = () => state;

  const Service = useComponentService<
    TooltipService,
    TooltipServiceParamsType
    >(
      {
        Service: TooltipService,
        serviceParams: {
          componentStateManageHelpers: {
            getComponentState: getState,
            setComponentState: setState
          },
          refs: { tooltipTargetRef }
        }
      }
    );

  return (
    <React.Fragment>
      {
        React.cloneElement(
          children,
          {
            onMouseEnter: Service.onTooltipTargetMouseEnter,
            onMouseOut: Service.onTooltipTargetMouseLeave,
            ref: tooltipTargetRef
          }
        )
      }
      {
        state.showTooltip
          && (
            <Portal>
              <div
                className={cn(tooltipStyles.container)}
                style={{
                  ...styles
                }}
              >
                {text}
              </div>
            </Portal>
        )
      }
    </React.Fragment>
  );
};
