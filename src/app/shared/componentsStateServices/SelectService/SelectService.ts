import React, { CSSProperties, RefObject } from "react";
import { MenuItemComponentType, StandardOption } from "../ServiceBase";
import { ControlWithDropDownMenu } from "../ControlWithDropDownMenu";

export type SelectServiceParams<Option> = {
  dropdownMenuItemsData: Array<Option>;
  MenuItemComponent?: MenuItemComponentType;
  onChange: (newValue: Option) => void;
  containerRef: RefObject<HTMLDivElement>;
  value: Option;
}

export type SelectServiceType<Option> = {
  handleMount: () => void;
  handleUpdate: (params: { [param: string]: any }) => void;
  handleUnmount: () => void;
  onSelectClick: () => void;
  onSelectControlKeyDown: (e: React.KeyboardEvent) => void;
  onMenuItemClick: (menuItem: Option) => void;
  onMenuMouseLeave: () => void;
}

export class SelectService<Option extends StandardOption>
  extends ControlWithDropDownMenu<Option>
  implements SelectServiceType<Option> {
  constructor(private readonly params : SelectServiceParams<Option>) {
    super();

    this.initState(this.getInitialState(this.params));
    this.setFunctionsFromParams(this.getFunctionsFromParams(this.params));
  }

  private getFunctionsFromParams = ({
    MenuItemComponent,
    onChange
  }: SelectServiceParams<Option>) => ({
    MenuItemComponent,
    onChange
  })

  private getInitialState = (params: SelectServiceParams<Option>): {
    activeMenuItemIndex: number | null;
    showDropdownMenu: boolean;
    menuStyles: CSSProperties;
    menuItemsHover: boolean;
    dropdownMenuItemsData: Array<Option>,
    containerRef: RefObject<HTMLDivElement>,
    value: Option;
  } => ({
    activeMenuItemIndex: null,
    showDropdownMenu: false,
    menuStyles: this.setMenuStyles(params.containerRef),
    menuItemsHover: true,
    dropdownMenuItemsData: params.dropdownMenuItemsData = [],
    containerRef: params.containerRef,
    value: params.value
  })

  handleMount = () => {
    super.handleMount();

    this.setMenuStyles(this.params.containerRef);
  }

  handleUpdate(params: { [p: string]: any }) {
    super.handleUpdate(params);
  }

  handleUnmount = () => {
    super.handleUnmount();
    this.clearService();
  }

  onSelectClick = () => {
    const { showDropdownMenu: showDropdownMenuPrev } = this.state;

    if (!showDropdownMenuPrev) {
      this.setState({
        menuStyles: this.setMenuStyles(this.state.containerRef),
        showDropdownMenu: true
      });
    }

    if (showDropdownMenuPrev) {
      this.closeMenu();
    }
  };

  onSelectControlKeyDown = (e: React.KeyboardEvent) => {
    const {
      userInput,
      activeMenuItemIndex,
      dropdownMenuItemsData = [],
      value
    } = this.state;

    const { onChange: onChangeCallback } = this.functionsFromParams;

    this.onControlKeyDown({
      eventKey: e.key,
      dropdownMenuItemsData,
      activeMenuItemIndex,
      onChangeCallback
    });
  };

  onMenuItemClick = (menuItem: Option) => {
    super.onMenuItemClick(menuItem, this.functionsFromParams.onChange);
  }

  onMenuMouseLeave = () => {
    this.setState({
      menuItemsHover: false
    });
  }
}
