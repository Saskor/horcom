import { CSSProperties, RefObject } from "react";
import { ServiceBase } from "../ServiceBase";
import {
  E_TOOLTIP_PLACEMENT,
  TOOLTIP_HORIZONTAL_PADDING,
  TOOLTIP_INDENT,
  TOOLTIP_VERTICAL_PADDING
} from "../../constants/tooltip";


export type TooltipServiceParams = {
  tooltipTargetRef: RefObject<HTMLElement>;
  text: string;
  tooltipPlacement: E_TOOLTIP_PLACEMENT;
};

export type TooltipServiceType = {
  handleMount: () => void;
  handleUpdate: (params: { [param: string]: any }) => void;
  handleUnmount: () => void;
}

type TooltipServiceState = TooltipServiceParams & {
  tooltipStyles: CSSProperties,
  showTooltip: boolean
}

export class TooltipService extends ServiceBase<TooltipServiceState>
  implements TooltipServiceType {
  constructor(private readonly params: TooltipServiceParams) {
    super();

    this.initState(this.getInitialState(this.params));
    // this.setFunctionsFromParams(this.getFunctionsFromParams(this.params));
    this.canvas = document.createElement("canvas");
  }

  // private getFunctionsFromParams = ({}: TooltipServiceParams) => ({})

  canvas: HTMLCanvasElement

  private getInitialState = ({
    tooltipTargetRef,
    text,
    tooltipPlacement
  }: TooltipServiceParams): TooltipServiceState => ({
    tooltipTargetRef,
    text,
    tooltipPlacement,
    showTooltip: false,
    tooltipStyles: {
      position: "absolute",
      top: "0px",
      left: "0px",
      width: "0px"
    }
  })

  handleMount = () => {
    window.addEventListener("scroll", this.handleScroll);
    this.state.tooltipTargetRef.current.addEventListener("mouseenter", this.onTooltipTargetMouseEnter);
    this.state.tooltipTargetRef.current.addEventListener("mouseleave", this.onTooltipTargetMouseLeave);
  }

  handleUpdate(params: { [p: string]: any }) {
    super.handleUpdate(params);
  }

  handleUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
    this.state.tooltipTargetRef.current.removeEventListener("mouseenter", this.onTooltipTargetMouseEnter);
    this.state.tooltipTargetRef.current.removeEventListener("mouseleave", this.onTooltipTargetMouseLeave);
    this.clearService();
  }

  private handleScroll = () => {
    this.closeTooltip();
  }

  private closeTooltip = () => {
    this.setState({ showTooltip: false });
  }

  private onTooltipTargetMouseEnter = () => {
    this.setState(
      {
        tooltipStyles: this.setTooltipStyles(),
        showTooltip: true
      }
    );
  }

  private onTooltipTargetMouseLeave = () => {
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
    const { tooltipTargetRef } = this.state;
    const tooltipTextWidth = this.getTextWidth(
      text,
      this.getCanvasFont(tooltipTargetRef.current as HTMLElement)
    );
    const tooltipWidth: number = tooltipTextWidth + (TOOLTIP_HORIZONTAL_PADDING * 2);
    const tooltipFontSize = Number.parseInt(
      this.getCssStyle(tooltipTargetRef.current as HTMLElement, "font-size")
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
    const {
      top: targetTop,
      bottom: targetBottom,
      left: targetLeft,
      right: targetRight,
      width: targetWidth,
      height: targetHeight
    } = this.state.tooltipTargetRef.current.getBoundingClientRect();

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

    const horizontalPlacementTypeTooltipTop
      = targetTop + (targetHeight / 2) - (tooltipHeight / 2);
    const horizontalPlacementTypeTooltipBottom
      = horizontalPlacementTypeTooltipTop + tooltipHeight;
    const verticalPlacementTypeTooltipLeft
      = targetLeft + (targetWidth / 2) - (tooltipWidth / 2);
    const verticalPlacementTypeTooltipRight
      = verticalPlacementTypeTooltipLeft + tooltipWidth;

    switch (this.state.tooltipPlacement) {
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
    const tooltipBoundariesPosition = this.getTooltipBoundariesPosition(this.state.text);

    return ({
      position: "absolute",
      top: `${tooltipBoundariesPosition.top}px`,
      left: `${tooltipBoundariesPosition.left}px`,
      width: `${tooltipBoundariesPosition.right - tooltipBoundariesPosition.left}px`,
      fontSize: this.getCanvasFontSize(this.state.tooltipTargetRef.current as HTMLElement)
    });
  }
}
