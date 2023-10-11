import { CSSProperties, MutableRefObject, ReactElement } from "react";
import {
  E_TOOLTIP_PLACEMENT,
  TOOLTIP_HORIZONTAL_PADDING,
  TOOLTIP_INDENT,
  TOOLTIP_VERTICAL_PADDING
} from "../../constants/tooltip";
import { TooltipStateType } from "../../components/Tooltip/Tooltip";


export type TooltipServiceParamsType = {
  componentStateManageHelpers: {
    getComponentState: () => TooltipStateType;
    setComponentState: (newStatePart: Partial<TooltipStateType>) => void;
  };
  refs: { tooltipTargetRef: MutableRefObject<null | ReactElement> };
};

export type TooltipServiceType = {
  handleMount: () => void;
  handleUnmount: () => void;
  onTooltipTargetMouseEnter: () => void;
  onTooltipTargetMouseLeave: () => void;
}

export class TooltipService implements TooltipServiceType {

  private canvas: HTMLCanvasElement;

  private readonly setState;

  private readonly getState;

  private readonly refs;

  constructor(
    {
      componentStateManageHelpers,
      refs
    }: TooltipServiceParamsType
  ) {
    this.setState = componentStateManageHelpers.setComponentState;
    this.getState = componentStateManageHelpers.getComponentState;
    this.refs = refs;
    this.canvas = document.createElement("canvas");
  }

  private handleScroll = () => {
    this.closeTooltip();
  }

  private closeTooltip = () => {
    this.setState({ showTooltip: false });
  }

  handleMount = () => {
    document.addEventListener("scroll", this.handleScroll);
  }

  handleUnmount = () => {
    document.removeEventListener("scroll", this.handleScroll);
  }

  public onTooltipTargetMouseEnter = () => {
    this.setState(
      {
        tooltipStyles: this.setTooltipStyles(),
        showTooltip: true
      }
    );
  }

  public onTooltipTargetMouseLeave = () => {
    this.setState({ showTooltip: false });
  }

  private getTextWidth = (text: string, font: string): number => {
    // re-use canvas object for better performance
    const { canvas } = this;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    context.font = font;
    const metrics = context.measureText(text);

    return metrics.width;
  }

  private getCssStyle = (element: HTMLElement, prop: string) => window.
    getComputedStyle(element, null).
    getPropertyValue(prop)

  private getCanvasFont = (el: HTMLElement) => {
    const fontWeight = this.getCssStyle(el, "font-weight") || "normal";
    const fontSize = this.getCssStyle(el, "font-size") || "14px";
    const fontFamily = this.getCssStyle(el, "font-family") || "Times New Roman";

    return `${fontWeight} ${fontSize} ${fontFamily}`;
  }

  private getCanvasFontSize = (el: HTMLElement) => (
    this.getCssStyle(el, "font-size") || "14px"
  )

  private getTooltipSize = (text: string): {
    width: number;
    height: number;
  } => {
    const { tooltipTargetRef } = this.refs;
    const tooltipTextWidth = this.getTextWidth(
      text,
      this.getCanvasFont(tooltipTargetRef.current)
    );
    const tooltipWidth: number = tooltipTextWidth + (TOOLTIP_HORIZONTAL_PADDING * 2);
    const tooltipFontSize = Number.parseInt(
      this.getCssStyle(tooltipTargetRef.current, "font-size")
    );
    const tooltipHeight: number = tooltipFontSize + (TOOLTIP_VERTICAL_PADDING * 2);

    return {
      width: tooltipWidth,
      height: tooltipHeight
    };
  }

  private getTooltipBoundariesPosition = (text: string): {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } => {
    const {
      width: tooltipWidth,
      height: tooltipHeight
    } = this.getTooltipSize(text);
    const tooltipBoundariesPosition: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    } = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    };

    const {
      top: targetTop,
      bottom: targetBottom,
      left: targetLeft,
      right: targetRight,
      width: targetWidth,
      height: targetHeight
    } = this.refs.tooltipTargetRef.current?.getBoundingClientRect();

    const horizontalPlacementTypeTooltipTop
      = targetTop + (targetHeight / 2) - (tooltipHeight / 2);
    const horizontalPlacementTypeTooltipBottom
      = horizontalPlacementTypeTooltipTop + tooltipHeight;
    const verticalPlacementTypeTooltipLeft
      = targetLeft + (targetWidth / 2) - (tooltipWidth / 2);
    const verticalPlacementTypeTooltipRight
      = verticalPlacementTypeTooltipLeft + tooltipWidth;

    switch (this.getState().tooltipPlacement) {
      case E_TOOLTIP_PLACEMENT.TOP: {
        const tooltipTop = targetTop - TOOLTIP_INDENT - tooltipHeight + document.documentElement.scrollTop;
        const tooltipTopOutOfTheScreenTop = tooltipTop < document.documentElement.scrollTop;
        tooltipBoundariesPosition.top = tooltipTopOutOfTheScreenTop
          ? targetBottom + TOOLTIP_INDENT + document.documentElement.scrollTop
          : tooltipTop;
        tooltipBoundariesPosition.bottom = tooltipBoundariesPosition.top + tooltipHeight;
        tooltipBoundariesPosition.left = verticalPlacementTypeTooltipLeft;
        tooltipBoundariesPosition.right = verticalPlacementTypeTooltipRight;

        break;
      }

      case E_TOOLTIP_PLACEMENT.BOTTOM: {
        const tooltipBottom = targetBottom + TOOLTIP_INDENT + tooltipHeight + document.documentElement.scrollTop;
        const tooltipBottomOutOfTheScreenBottom = (tooltipBottom - document.documentElement.scrollTop)
          > document.documentElement.clientHeight;
        tooltipBoundariesPosition.bottom = tooltipBottomOutOfTheScreenBottom
          ? targetTop - TOOLTIP_INDENT + document.documentElement.scrollTop
          : tooltipBottom;
        tooltipBoundariesPosition.top = tooltipBoundariesPosition.bottom - tooltipHeight;
        tooltipBoundariesPosition.left = verticalPlacementTypeTooltipLeft;
        tooltipBoundariesPosition.right = verticalPlacementTypeTooltipRight;

        break;
      }

      case E_TOOLTIP_PLACEMENT.LEFT: {
        tooltipBoundariesPosition.top = horizontalPlacementTypeTooltipTop;
        tooltipBoundariesPosition.bottom = horizontalPlacementTypeTooltipBottom;
        const tooltipLeft = targetLeft - TOOLTIP_INDENT - tooltipWidth;
        const tooltipLeftOutOfTheScreenLeft = tooltipLeft < 0;
        tooltipBoundariesPosition.left = tooltipLeftOutOfTheScreenLeft
          ? targetRight + TOOLTIP_INDENT
          : tooltipLeft;
        tooltipBoundariesPosition.right = tooltipBoundariesPosition.left + tooltipWidth;

        break;
      }

      case E_TOOLTIP_PLACEMENT.RIGHT: {
        tooltipBoundariesPosition.top = horizontalPlacementTypeTooltipTop;
        tooltipBoundariesPosition.bottom = horizontalPlacementTypeTooltipBottom;
        const tooltipRight = targetRight + TOOLTIP_INDENT + tooltipWidth;
        tooltipBoundariesPosition.right = tooltipRight > document.documentElement.clientWidth
          ? targetLeft - TOOLTIP_INDENT
          : tooltipRight;
        tooltipBoundariesPosition.left = tooltipBoundariesPosition.right - tooltipWidth;

        break;
      }
    }

    return tooltipBoundariesPosition;
  }

  private setTooltipStyles(): CSSProperties {
    const tooltipBoundariesPosition = this.getTooltipBoundariesPosition(this.getState().text);

    return ({
      position: "absolute",
      top: `${tooltipBoundariesPosition.top}px`,
      left: `${tooltipBoundariesPosition.left}px`,
      width: `${tooltipBoundariesPosition.right - tooltipBoundariesPosition.left}px`,
      fontSize: this.getCanvasFontSize(this.refs.tooltipTargetRef.current)
    });
  }
}
