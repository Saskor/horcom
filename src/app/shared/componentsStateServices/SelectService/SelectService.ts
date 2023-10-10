import React, { RefObject } from "react";
import { StandardOption } from "../types";
import { ControlWithDropDownMenu } from "../ControlWithDropDownMenu";
import { SelectStateType } from "../../components/Select/Select";

export type SelectServiceParamsType<Option> = {
  componentStateManageHelpers: {
    getComponentState: () => SelectStateType<Option>;
    setComponentState: (newStatePart: Partial<SelectStateType<Option>>) => void;
  };
  serviceCallbacks: {
    onChange: (newValue: Option) => void;
    getLabel: (newValue: Option) => string;
  };
  refs: {containerRef: RefObject<HTMLDivElement>};
  initialState: SelectStateType<Option>;
};

export type SelectServiceType<Option> = {
  handleMount: () => void;
  handleUnmount: () => void;
  onSelectClick: () => void;
  onSelectControlKeyDown: (e: React.KeyboardEvent) => void;
  onMenuItemClick: (menuItem: Option) => void;
  onMenuMouseLeave: () => void;
}

export class SelectService<Option extends StandardOption>
implements SelectServiceType<Option> {

  private readonly setState;

  private readonly getState;

  private readonly serviceCallbacks;

  private readonly refs;

  public controlWithDropDownMenu;

  constructor(
    {
      componentStateManageHelpers,
      serviceCallbacks,
      refs,
      initialState
    }: SelectServiceParamsType<Option>
  ) {
    this.setState = componentStateManageHelpers.setComponentState;
    this.getState = componentStateManageHelpers.getComponentState;
    this.serviceCallbacks = serviceCallbacks;
    this.refs = refs;


    this.controlWithDropDownMenu = new ControlWithDropDownMenu<Option, SelectStateType<Option>>(
      {
        componentStateManageHelpers,
        serviceCallbacks,
        refs,
        initialState
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
    const { showDropdownMenu: showDropdownMenuPrev } = this.getState();

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
    const {
      activeMenuItemIndex,
      dropdownMenuItemsData = []
    } = this.getState();

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
