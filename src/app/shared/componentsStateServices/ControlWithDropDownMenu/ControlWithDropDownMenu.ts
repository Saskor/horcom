import { CSSProperties, RefObject } from "react";
import { StandardOption } from "../types";

type ControlWithDropDownMenuState = {
  activeMenuItemIndex: null | number;
  menuStyles: CSSProperties;
  menuItemsHover: boolean;
  userInput?: string;
  anyControlOptionWasSelected?: boolean;
};


export type ControlWithDropDownMenuType<Option> = {
  handleMount: () => void;
  handleUnmount: () => void;
  onMenuItemClick: (suggestion: Option, onChangeCallback: (value: Option) => void) => void;
  onMenuItemMouseMove: (menuItemIndex: number) => void;
  onMenuItemMouseEnter: (menuItemIndex: number) => void;
  onControlKeyDown: ({
    eventKey,
    dropdownMenuItemsData,
    activeMenuItemIndex,
    onChangeCallback
  }: {
    eventKey: string;
    dropdownMenuItemsData: Array<Option>;
    activeMenuItemIndex: number | null;
    onChangeCallback: (newValue: Option) => void;
  }) => void;
  setMenuStyles: (containerRef: RefObject<HTMLDivElement>) => CSSProperties;
  closeMenu: () => void;
}

export type ControlWithDropDownMenuParamsType<
    Option,
    ComponentState extends ControlWithDropDownMenuState
> = {
  componentStateManageHelpers: {
    getComponentState: () => ControlWithDropDownMenuState,
    setComponentState: (newStatePart: Partial<ControlWithDropDownMenuState>) => void,
  };
  serviceCallbacks: {
    getFilteredSuggestions?: (inputValue: string) => Array<Option>;
    onChange: (newValue: Option) => void;
    getLabel: (newValue: Option) => string;
  };
  refs: {containerRef: RefObject<HTMLDivElement>};
  initialState: ComponentState;
};

export class ControlWithDropDownMenu<
  Option extends StandardOption,
  ComponentState extends ControlWithDropDownMenuState
  >
implements ControlWithDropDownMenuType<Option>{
  private readonly setState;

  private readonly getState;

  private readonly serviceCallbacks;

  private readonly refs;
  
  public readonly closeMenu;

  constructor(
    {
      componentStateManageHelpers,
      serviceCallbacks,
      refs,
      initialState
    }: ControlWithDropDownMenuParamsType<Option, ComponentState>
  ) {
    this.setState = componentStateManageHelpers.setComponentState;
    this.getState = componentStateManageHelpers.getComponentState;
    this.serviceCallbacks = serviceCallbacks;
    this.refs = refs;
    
    this.closeMenu = () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { userInput, anyControlOptionWasSelected, ...rest } = initialState;
      this.setState({ ...rest });
    };

    this.handleMount = this.handleMount.bind(this);
    this.handleUnmount = this.handleUnmount.bind(this);
    this.onMenuItemClick = this.onMenuItemClick.bind(this);
    this.onMenuItemMouseMove = this.onMenuItemMouseMove.bind(this);
    this.onMenuItemMouseEnter = this.onMenuItemMouseEnter.bind(this);
    this.setMenuStyles = this.setMenuStyles.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }


  public handleMount() {
    document.addEventListener("scroll", this.closeMenu);
    window.addEventListener("resize", this.closeMenu);
    document.addEventListener("click", this.handleClickOutside, { capture: true });
  }

  public handleUnmount() {
    document.removeEventListener("scroll", this.closeMenu);
    window.removeEventListener("resize", this.closeMenu);
    document.removeEventListener("click", this.handleClickOutside);
  }

  handleClickOutside(event: Event) {
    const { containerRef } = this.refs || {};
    const clickInsideInput = containerRef.current
      && containerRef.current.contains(event.target as HTMLElement);
    const clickInsidePortal = (event.target as HTMLElement).closest("#portal-root");

    if (!clickInsideInput && !clickInsidePortal) {
      this.closeMenu();
    }
  };

  onMenuItemMouseMove(menuItemIndex: number) {
    const { activeMenuItemIndex, menuItemsHover } = this.getState();


    if (!menuItemsHover) {
      this.setState({
        menuItemsHover: true
      });
    }

    if (menuItemIndex !== activeMenuItemIndex) {
      this.setState({
        activeMenuItemIndex: menuItemIndex
      });
    }
  }

  onMenuItemMouseEnter(menuItemIndex: number) {
    const state = this.getState();
    if (!state.menuItemsHover) {
      this.setState({
        menuItemsHover: true
      });
    }

    if (menuItemIndex !== state.activeMenuItemIndex) {
      this.setState({
        activeMenuItemIndex: menuItemIndex
      });
    }
  }

  public onMenuItemClick(menuItem: Option, onChangeCallback: (value: Option) => void) {
    const { disabled = false } = menuItem;

    if (disabled) {
      return;
    }

    this.closeMenu();
    this.setState({ userInput: this.getUserInput(menuItem), anyControlOptionWasSelected: true });
    onChangeCallback(menuItem);
  };

  private getUserInput(dropDownMenuItemData: Option): string {
    const { getLabel } = this.serviceCallbacks;

    return getLabel(dropDownMenuItemData);
  }

  public onControlKeyDown(
    {
      eventKey,
      dropdownMenuItemsData,
      activeMenuItemIndex,
      onChangeCallback
    }: {
      eventKey: string;
      dropdownMenuItemsData: Array<Option>;
      activeMenuItemIndex: number | null;
      onChangeCallback: (newValue: Option) => void;
    }
  ) {
    // User pressed the enter key
    if (eventKey === "Enter") {
      if (activeMenuItemIndex === null || dropdownMenuItemsData[activeMenuItemIndex].disabled) {
        return;
      }

      onChangeCallback(dropdownMenuItemsData[activeMenuItemIndex]);
      this.setState({ userInput: this.getUserInput(dropdownMenuItemsData[activeMenuItemIndex]) });
      this.closeMenu();
      this.setState({ anyControlOptionWasSelected: true });
    }

    // User pressed the esc key
    if (eventKey === "Escape") {
      this.closeMenu();
    }

    // User pressed the up arrow
    if (eventKey === "ArrowUp") {
      if (activeMenuItemIndex === 0) {
        this.setState({
          activeMenuItemIndex: dropdownMenuItemsData.length - 1,
          menuItemsHover: false
        });

        return;
      }

      this.setState({
        activeMenuItemIndex: activeMenuItemIndex === null
          ? dropdownMenuItemsData.length - 1
          : activeMenuItemIndex - 1,
        menuItemsHover: false
      });
    }

    // User pressed the down arrow
    if (eventKey === "ArrowDown") {
      if (activeMenuItemIndex === dropdownMenuItemsData.length - 1) {
        this.setState({
          activeMenuItemIndex: 0,
          menuItemsHover: false
        });

        return;
      }

      this.setState({
        activeMenuItemIndex: activeMenuItemIndex === null
          ? 0
          : activeMenuItemIndex + 1,
        menuItemsHover: false
      });
    }
  };

  public setMenuStyles(containerRef: RefObject<HTMLDivElement>): CSSProperties {
    if (!containerRef.current) {
      return ({
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "0px"
      });
    }

    const containerElem = containerRef.current as HTMLDivElement;
    const containerCoords = containerElem.getBoundingClientRect();

    return ({
      position: "absolute",
      top: `${containerCoords.bottom}px`,
      left: `${containerCoords.left}px`,
      width: `${containerCoords.right - containerCoords.left}px`
    });
  }
}
