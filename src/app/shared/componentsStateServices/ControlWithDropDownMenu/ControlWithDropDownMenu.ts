import { CSSProperties, RefObject } from "react";
import { StandardOption, ServiceBase } from "../ServiceBase";

export type ControlWithDropDownMenuType<Option> = {
  handleMount: () => void;
  handleUnmount: () => void;
  onControlBlur: () => void;
  closeMenu: () => void;
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
}

export abstract class ControlWithDropDownMenu<Option extends StandardOption>
  extends ServiceBase
  implements ControlWithDropDownMenuType<Option>{
  protected constructor() {
    super();

    this.handleMount = this.handleMount.bind(this);
    this.handleUnmount = this.handleUnmount.bind(this);
    this.onControlBlur = this.onControlBlur.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.onMenuItemClick = this.onMenuItemClick.bind(this);
    this.onMenuItemMouseMove = this.onMenuItemMouseMove.bind(this);
    this.onMenuItemMouseEnter = this.onMenuItemMouseEnter.bind(this);
    this.setMenuStyles = this.setMenuStyles.bind(this);
  }

  private handleScroll() {
    if (this.state.showDropdownMenu) {
      this.setState({
        showDropdownMenu: false
      });
    }
  }

  public handleMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  public handleUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  public onControlBlur() {
    this.closeMenu();
  }

  public closeMenu() {
    this.setState({
      activeMenuItemIndex: null,
      showDropdownMenu: false,
      menuItemsHover: true,
      ...(
        this.state.filteredSuggestions && this.state.filteredSuggestions.length
          ? { filteredSuggestions: [] }
          : {}
      )
    });
  }

  onMenuItemMouseMove(menuItemIndex: number) {

    const { activeMenuItemIndex } = this.state;
    if (!this.state.menuItemsHover) {
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
    if (!this.state.menuItemsHover) {
      this.setState({
        menuItemsHover: true
      });
    }

    if (menuItemIndex !== this.state.activeMenuItemIndex) {
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

    onChangeCallback(menuItem);
  };

  private getUserInput(dropDownMenuItemData: Option): string {
    const { getLabel } = this.functionsFromParams;

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

      this.closeMenu();
      onChangeCallback(dropdownMenuItemsData[activeMenuItemIndex]);

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
          userInput: this.getUserInput(
            dropdownMenuItemsData[dropdownMenuItemsData.length - 1]
          ),
          menuItemsHover: false
        });

        return;
      }

      this.setState({
        activeMenuItemIndex: activeMenuItemIndex === null
          ? dropdownMenuItemsData.length - 1
          : activeMenuItemIndex - 1,
        userInput: activeMenuItemIndex === null
          ? this.getUserInput(dropdownMenuItemsData[dropdownMenuItemsData.length - 1])
          : this.getUserInput(dropdownMenuItemsData[activeMenuItemIndex - 1]),
        menuItemsHover: false
      });
    }

    // User pressed the down arrow
    if (eventKey === "ArrowDown") {
      if (activeMenuItemIndex === dropdownMenuItemsData.length - 1) {
        this.setState({
          activeMenuItemIndex: 0,
          userInput: this.getUserInput(dropdownMenuItemsData[0]),
          menuItemsHover: false
        });

        return;
      }

      this.setState({
        activeMenuItemIndex: activeMenuItemIndex === null
          ? 0
          : activeMenuItemIndex + 1,
        userInput: activeMenuItemIndex === null
          ? this.getUserInput(dropdownMenuItemsData[0])
          : this.getUserInput(dropdownMenuItemsData[activeMenuItemIndex + 1]),
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
