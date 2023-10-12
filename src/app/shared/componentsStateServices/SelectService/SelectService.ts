import React, { CSSProperties, RefObject } from "react";
import { StandardOption } from "../types";
import { ControlWithDropDownMenu } from "../ControlWithDropDownMenu";

export type SelectServiceStateType = {
  activeMenuItemIndex: null | number;
  showDropdownMenu: boolean;
  menuStyles: CSSProperties;
  menuItemsHover: boolean;
}

export type SelectServiceParamsType<Option> = {
  incrementComponentStateChangedCounter: () => void;
  serviceCallbacks: {
    onChange: (newValue: Option) => void;
    getLabel: (newValue: Option) => string;
  };
  refs: {containerRef: RefObject<HTMLDivElement>};
  data: {dropdownMenuItemsData: Array<Option>}
};

export type SelectServiceType<Option> = {
  handleMount: () => void;
  handleUnmount: () => void;
  setState: (newStatePart: Partial<SelectServiceStateType>) => void;
  getState: () => SelectServiceStateType;
  onSelectClick: () => void;
  onSelectControlKeyDown: (e: React.KeyboardEvent) => void;
  onMenuItemClick: (menuItem: Option) => void;
  onMenuMouseLeave: () => void;
  controlWithDropDownMenu: ControlWithDropDownMenu<Option, SelectServiceStateType>;
}

export class SelectService<Option extends StandardOption>
implements SelectServiceType<Option> {
  private state: SelectServiceStateType = {
    activeMenuItemIndex: null,
    showDropdownMenu: false,
    menuStyles: {
      position: undefined,
      top: "0px",
      left: "0px",
      width: "0px"
    },
    menuItemsHover: true
  }

  public readonly setState;

  public readonly getState;

  private readonly serviceCallbacks;

  private readonly refs;

  public controlWithDropDownMenu;

  private readonly data;

  constructor(
    {
      incrementComponentStateChangedCounter,
      serviceCallbacks,
      refs,
      data
    }: SelectServiceParamsType<Option>
  ) {
    this.setState = (newStatePart: Partial<SelectServiceStateType>) => {
      this.state = { ...this.state, ...newStatePart };
      incrementComponentStateChangedCounter();
    };
    this.getState = () => this.state;

    this.serviceCallbacks = serviceCallbacks;
    this.refs = refs;
    this.data = data;


    this.controlWithDropDownMenu = new ControlWithDropDownMenu<Option, SelectServiceStateType>(
      {
        componentStateManageHelpers: {
          getComponentState: this.getState,
          setComponentState: this.setState
        },
        serviceCallbacks,
        refs,
        initialState: {
          activeMenuItemIndex: null,
          showDropdownMenu: false,
          menuStyles: {
            position: undefined,
            top: "0px",
            left: "0px",
            width: "0px"
          },
          menuItemsHover: true
        }
      }
    );
  }

  handleMount = () => {
    this.controlWithDropDownMenu.handleMount();

    this.controlWithDropDownMenu.setMenuStyles(this.refs.containerRef);
  }

  handleUnmount = () => {
    this.controlWithDropDownMenu.handleUnmount();
  }

  onSelectClick = () => {
    const { showDropdownMenu: showDropdownMenuPrev } = this.state;

    if (!showDropdownMenuPrev) {
      this.setState({
        menuStyles: this.controlWithDropDownMenu.setMenuStyles(this.refs.containerRef),
        showDropdownMenu: true
      });
    }

    if (showDropdownMenuPrev) {
      this.controlWithDropDownMenu.closeMenu();
    }
  };

  onSelectControlKeyDown = (e: React.KeyboardEvent) => {
    const { activeMenuItemIndex } = this.state;
    const { dropdownMenuItemsData } = this.data;

    const { onChange: onChangeCallback } = this.serviceCallbacks;

    this.controlWithDropDownMenu.onControlKeyDown({
      eventKey: e.key,
      dropdownMenuItemsData,
      activeMenuItemIndex,
      onChangeCallback
    });
  };

  onMenuItemClick = (menuItem: Option) => {
    this.controlWithDropDownMenu.onMenuItemClick(menuItem, this.serviceCallbacks.onChange);
  }

  onMenuMouseLeave = () => {
    this.setState({
      menuItemsHover: false
    });
  }
}
