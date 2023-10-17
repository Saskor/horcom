import React, { CSSProperties, RefObject } from "react";
import { StandardOption } from "./types";

type ControlWithDropDownMenuState = {
  activeMenuItemIndex: null | number;
  menuStyles: CSSProperties;
  menuItemsHover: boolean;
  userInput?: string;
};


export type ControlWithDropDownMenuMethodsType<Option> = {
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
  stateData: {
    initialState: ComponentState;
    state: ComponentState;
  },
  setComponentState: (newStatePart: Partial<ControlWithDropDownMenuState>) => void,
  serviceCallbacks: {
    getFilteredSuggestions?: (inputValue: string) => Array<Option>;
    onChange: (newValue: Option) => void;
    getLabel: (newValue: Option) => string;
  };
  refs: {containerRef: RefObject<HTMLDivElement>};
};

export type ControlWithDropDownMenuServiceType<
  Option extends StandardOption,
  ComponentState extends ControlWithDropDownMenuState,
> = (params: ControlWithDropDownMenuParamsType<Option, ComponentState>) => ControlWithDropDownMenuMethodsType<Option>

export const useControlWithDropDownMenu = <
  Option extends StandardOption,
  ComponentState extends ControlWithDropDownMenuState,
>(
    {
      stateData: {
        initialState,
        state
      },
      setComponentState,
      serviceCallbacks,
      refs
    }: ControlWithDropDownMenuParamsType<Option, ComponentState>
  ): ControlWithDropDownMenuMethodsType<Option> => {
  const closeMenu = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userInput, ...rest } = initialState;
    setComponentState({ ...rest });
  };

  const handleClickOutside = (event: Event) => {
    const { containerRef } = refs || {};
    const clickInsideInput = containerRef.current
      && containerRef.current.contains(event.target as HTMLElement);
    const clickInsidePortal = (event.target as HTMLElement).closest("#portal-root");

    if (!clickInsideInput && !clickInsidePortal) {
      closeMenu();
    }
  };

  const handleMount = () => {
    document.addEventListener("scroll", closeMenu);
    window.addEventListener("resize", closeMenu);
    document.addEventListener("click", handleClickOutside, { capture: true });
  };

  const handleUnmount = () => {
    document.removeEventListener("scroll", closeMenu);
    window.removeEventListener("resize", closeMenu);
    document.removeEventListener("click", handleClickOutside);
  };

  React.useEffect(() => {
    handleMount();

    return () => {
      handleUnmount();
    };
  });

  const onMenuItemMouseMove = (menuItemIndex: number) => {
    const { activeMenuItemIndex, menuItemsHover } = state;


    if (!menuItemsHover) {
      setComponentState({
        menuItemsHover: true
      });
    }

    if (menuItemIndex !== activeMenuItemIndex) {
      setComponentState({
        activeMenuItemIndex: menuItemIndex
      });
    }
  };

  const onMenuItemMouseEnter = (menuItemIndex: number) => {
    if (!state.menuItemsHover) {
      setComponentState({
        menuItemsHover: true
      });
    }

    if (menuItemIndex !== state.activeMenuItemIndex) {
      setComponentState({
        activeMenuItemIndex: menuItemIndex
      });
    }
  };

  const getUserInput = (dropDownMenuItemData: Option): string => {
    const { getLabel } = serviceCallbacks;

    return getLabel(dropDownMenuItemData);
  };

  const onMenuItemClick = (menuItem: Option, onChangeCallback: (value: Option) => void) => {
    const { disabled = false } = menuItem;

    if (disabled) {
      return;
    }

    closeMenu();
    setComponentState({ userInput: getUserInput(menuItem) });
    onChangeCallback(menuItem);
  };

  const onControlKeyDown = (
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
  ) => {
    // User pressed the enter key
    if (eventKey === "Enter") {
      if (activeMenuItemIndex === null || dropdownMenuItemsData[activeMenuItemIndex].disabled) {
        return;
      }

      onChangeCallback(dropdownMenuItemsData[activeMenuItemIndex]);
      setComponentState({ userInput: getUserInput(dropdownMenuItemsData[activeMenuItemIndex]) });
      closeMenu();
    }

    // User pressed the esc key
    if (eventKey === "Escape") {
      closeMenu();
    }

    // User pressed the up arrow
    if (eventKey === "ArrowUp") {
      if (activeMenuItemIndex === 0) {
        setComponentState({
          activeMenuItemIndex: dropdownMenuItemsData.length - 1,
          menuItemsHover: false
        });

        return;
      }

      setComponentState({
        activeMenuItemIndex: activeMenuItemIndex === null
          ? dropdownMenuItemsData.length - 1
          : activeMenuItemIndex - 1,
        menuItemsHover: false
      });
    }

    // User pressed the down arrow
    if (eventKey === "ArrowDown") {
      if (activeMenuItemIndex === dropdownMenuItemsData.length - 1) {
        setComponentState({
          activeMenuItemIndex: 0,
          menuItemsHover: false
        });

        return;
      }

      setComponentState({
        activeMenuItemIndex: activeMenuItemIndex === null
          ? 0
          : activeMenuItemIndex + 1,
        menuItemsHover: false
      });
    }
  };

  const setMenuStyles = (containerRef: RefObject<HTMLDivElement>): CSSProperties => {
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
  };

  return {
    onMenuItemClick,
    onMenuItemMouseMove,
    onMenuItemMouseEnter,
    onControlKeyDown,
    setMenuStyles,
    closeMenu
  };
};
