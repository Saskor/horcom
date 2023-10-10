import React, { RefObject } from "react";
import { debounce } from "../../helpers/customDebounce";
import { StandardOption } from "../types";
import { ControlWithDropDownMenu } from "../ControlWithDropDownMenu";
import { AutocompleteStateType } from "../../components/Autocomplete/Autocomplete";

export type AutocompleteServiceParamsType<Option> = {
  componentStateManageHelpers: {
    getComponentState: () => AutocompleteStateType<Option>,
    setComponentState: (newStatePart: Partial<AutocompleteStateType<Option>>) => void,
  };
  serviceCallbacks: {
    getFilteredSuggestions: (inputValue: string) => Array<Option>;
    onChange: (newValue: Option) => void;
    getLabel: (newValue: Option) => string;
  };
  refs: {containerRef: RefObject<HTMLDivElement>};
  initialState: AutocompleteStateType<Option>;
};

export type AutocompleteServiceType<Option> = {
  handleMount: () => void;
  handleUnmount: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAutocompleteControlKeyDown: (e: React.KeyboardEvent) => void;
  onMenuItemClick: (menuItem: Option) => void;
  onMenuMouseLeave: () => void;
  controlWithDropDownMenu: any;
}

export class AutocompleteService<Option extends StandardOption>
implements AutocompleteServiceType<Option> {
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
    }: AutocompleteServiceParamsType<Option>
  ) {
    this.setState = componentStateManageHelpers.setComponentState;
    this.getState = componentStateManageHelpers.getComponentState;
    this.serviceCallbacks = serviceCallbacks;
    this.refs = refs;


    this.controlWithDropDownMenu = new ControlWithDropDownMenu<Option, AutocompleteStateType<Option>>(
      {
        componentStateManageHelpers,
        serviceCallbacks,
        refs,
        initialState
      }
    );
  }

  public handleMount = () => {
    this.controlWithDropDownMenu.handleMount();
  }

  public handleUnmount = () => {
    this.controlWithDropDownMenu.handleUnmount();
  }

  private inputChangeCallback = (userInput: string) => {
    const { getFilteredSuggestions } = this.serviceCallbacks;

    const filteredSuggestions = getFilteredSuggestions(userInput);

    this.setState({
      showDropdownMenu: Boolean(userInput),
      filteredSuggestions
    });
  }

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      menuStyles: this.controlWithDropDownMenu.setMenuStyles(this.refs.containerRef),
      showDropdownMenu: false,
      userInput: e.currentTarget.value
    });

    debounce(
      {
        fn: this.inputChangeCallback,
        ms: 1000,
        context: this
      }
    )(e.currentTarget.value);
  };

  onAutocompleteControlKeyDown = (e: React.KeyboardEvent) => {
    const {
      filteredSuggestions,
      activeMenuItemIndex
    } = this.getState();

    const { onChange: onChangeCallback } = this.serviceCallbacks;

    this.controlWithDropDownMenu.onControlKeyDown({
      eventKey: e.key,
      dropdownMenuItemsData: filteredSuggestions,
      activeMenuItemIndex,
      onChangeCallback
    });
  };

  onMenuItemClick = (menuItem: Option) => {
    this.controlWithDropDownMenu.onMenuItemClick(menuItem, this.serviceCallbacks.onChange);
  }

  onMenuMouseLeave = () => {
    if (this.getState().activeMenuItemIndex === null) {
      return;
    }

    this.setState({
      activeMenuItemIndex: null,
      menuItemsHover: false
    });
  }
}
