import React, { CSSProperties, RefObject } from "react";
import { debounce } from "../helpers/customDebounce";
import { StandardOption } from "./types";
import { ControlWithDropDownMenuMethodsType, useControlWithDropDownMenu } from "./useControlWithDropDownMenuService";

type AutocompleteServiceStateType<Option> = {
  activeMenuItemIndex: null | number;
  showDropdownMenu: boolean;
  menuStyles: CSSProperties;
  menuItemsHover: boolean;
  filteredSuggestions: Array<Option>;
  userInput: string;
}

type AutocompleteServiceParamsType<Option> = {
  stateData: {
    initialState: AutocompleteServiceStateType<Option>;
    state: AutocompleteServiceStateType<Option>;
  }
  setComponentState: (newStatePart: Partial<AutocompleteServiceStateType<Option>>) => void;
  serviceCallbacks: {
    getFilteredSuggestions: (inputValue: string) => Array<Option>;
    onChange: (newValue: Option) => void;
    getLabel: (newValue: Option) => string;
  };
  refs: {containerRef: RefObject<HTMLDivElement>};
};

type AutocompleteServiceMethodsType<Option> = {
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAutocompleteControlKeyDown: (e: React.KeyboardEvent) => void;
  onMenuItemClick: (menuItem: Option) => void;
  onMenuMouseLeave: () => void;
  controlWithDropDownMenu: ControlWithDropDownMenuMethodsType<Option>;
}

export const useAutocompleteService = <Option extends StandardOption, >(
  {
    stateData: {
      initialState,
      state
    },
    setComponentState,
    serviceCallbacks,
    refs
  }: AutocompleteServiceParamsType<Option>
): AutocompleteServiceMethodsType<Option> => {

  const controlWithDropDownMenu = useControlWithDropDownMenu<Option, AutocompleteServiceStateType<Option>>(
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

  // private
  const inputChangeCallback = (userInput: string) => {
    const { getFilteredSuggestions } = serviceCallbacks;

    const filteredSuggestions = getFilteredSuggestions(userInput);

    setComponentState({
      showDropdownMenu: Boolean(userInput),
      filteredSuggestions
    });
  };
  // public
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComponentState({
      menuStyles: controlWithDropDownMenu.setMenuStyles(refs.containerRef),
      showDropdownMenu: false,
      userInput: e.currentTarget.value
    });

    const debouncedWrapper = debounce(
      {
        fn: inputChangeCallback,
        ms: 1000,
        context: this
      }
    );

    debouncedWrapper(e.currentTarget.value);
  };
  // public
  const onAutocompleteControlKeyDown = (e: React.KeyboardEvent) => {
    const {
      filteredSuggestions,
      activeMenuItemIndex
    } = state;

    const { onChange: onChangeCallback } = serviceCallbacks;

    controlWithDropDownMenu.onControlKeyDown({
      eventKey: e.key,
      dropdownMenuItemsData: filteredSuggestions,
      activeMenuItemIndex,
      onChangeCallback
    });
  };

  // public
  const onMenuItemClick = (menuItem: Option) => {
    controlWithDropDownMenu.onMenuItemClick(menuItem, serviceCallbacks.onChange);
  };

  // public
  const onMenuMouseLeave = () => {
    if (state.activeMenuItemIndex === null) {
      return;
    }

    setComponentState({
      activeMenuItemIndex: null,
      menuItemsHover: false
    });
  };

  return {
    onInputChange,
    onAutocompleteControlKeyDown,
    onMenuItemClick,
    onMenuMouseLeave,
    controlWithDropDownMenu
  };

};
