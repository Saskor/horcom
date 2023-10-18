import React, { RefObject, CSSProperties } from "react";
import { StandardOption } from "./types";
import { ControlWithDropDownMenuMethodsType, useControlWithDropDownMenu } from "./useControlWithDropDownMenuService";

type SelectServiceStateType = {
  activeMenuItemIndex: null | number;
  showDropdownMenu: boolean;
  menuStyles: CSSProperties;
  menuItemsHover: boolean;
}

type SelectServiceParamsType<Option> = {
  data: {dropdownMenuItemsData: Array<Option>};
  stateData: {
    initialState: SelectServiceStateType,
    state: SelectServiceStateType
  };
  setComponentState: (newStatePart: Partial<SelectServiceStateType>) => void;
  serviceCallbacks: {
    onChange: (newValue: Option) => void;
    getLabel: (newValue: Option) => string;
  };
  refs: {containerRef: RefObject<HTMLDivElement>};
};

type SelectServiceMethodsType<Option> = {
  onSelectClick: () => void;
  onSelectControlKeyDown: (e: React.KeyboardEvent) => void;
  onMenuItemClick: (menuItem: Option) => void;
  onMenuMouseLeave: () => void;
  controlWithDropDownMenu: ControlWithDropDownMenuMethodsType<Option>;
}

export const useSelectService = <Option extends StandardOption>(
  {
    data,
    stateData: {
      initialState,
      state
    },
    setComponentState,
    serviceCallbacks,
    refs
  }: SelectServiceParamsType<Option>
): SelectServiceMethodsType<Option> => {


  const controlWithDropDownMenu = useControlWithDropDownMenu<Option, SelectServiceStateType>(
    {
      stateData: {
        initialState,
        state
      },
      setComponentState,
      serviceCallbacks,
      refs
    }
  );

  const handleMount = () => {
    controlWithDropDownMenu.setMenuStyles(refs.containerRef);
  };

  React.useEffect(() => {
    handleMount();
  });

  const onSelectClick = () => {
    const { showDropdownMenu: showDropdownMenuPrev } = state;

    if (!showDropdownMenuPrev) {
      setComponentState({
        menuStyles: controlWithDropDownMenu.setMenuStyles(refs.containerRef),
        showDropdownMenu: true
      });
    }

    if (showDropdownMenuPrev) {
      controlWithDropDownMenu.closeMenu();
    }
  };

  const onSelectControlKeyDown = (e: React.KeyboardEvent) => {
    const { activeMenuItemIndex } = state;
    const { dropdownMenuItemsData } = data;

    const { onChange: onChangeCallback } = serviceCallbacks;

    controlWithDropDownMenu.onControlKeyDown({
      eventKey: e.key,
      dropdownMenuItemsData,
      activeMenuItemIndex,
      onChangeCallback
    });
  };

  const onMenuItemClick = (menuItem: Option) => {
    controlWithDropDownMenu.onMenuItemClick(menuItem, serviceCallbacks.onChange);
  };

  const onMenuMouseLeave = () => {
    setComponentState({
      menuItemsHover: false
    });
  };

  return {
    onSelectClick,
    onSelectControlKeyDown,
    onMenuItemClick,
    onMenuMouseLeave,
    controlWithDropDownMenu
  };
};
