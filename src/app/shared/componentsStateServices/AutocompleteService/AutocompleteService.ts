import React, { CSSProperties, RefObject } from "react";
import { debounce } from "../../helpers/customDebounce";
import { StandardOption } from "../types";
import { ControlWithDropDownMenu } from "../ControlWithDropDownMenu";

export type AutocompleteServiceStateType<Option> = {
  activeMenuItemIndex: null | number;
  showDropdownMenu: boolean;
  menuStyles: CSSProperties;
  menuItemsHover: boolean;
  filteredSuggestions: Array<Option>;
  userInput: string;
}

export type AutocompleteServiceParamsType<Option> = {
  incrementComponentStateChangedCounter: () => void;
  serviceCallbacks: {
    getFilteredSuggestions: (inputValue: string) => Array<Option>;
    onChange: (newValue: Option) => void;
    getLabel: (newValue: Option) => string;
  };
  refs: {containerRef: RefObject<HTMLDivElement>};
};

export type AutocompleteServiceType<Option> = {
  handleMount: () => void;
  handleUnmount: () => void;
  setState: (newStatePart: Partial<AutocompleteServiceStateType<Option>>) => void;
  getState: () => AutocompleteServiceStateType<Option>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAutocompleteControlKeyDown: (e: React.KeyboardEvent) => void;
  onMenuItemClick: (menuItem: Option) => void;
  onMenuMouseLeave: () => void;
  controlWithDropDownMenu: ControlWithDropDownMenu<Option, AutocompleteServiceStateType<Option>>;
}

export class AutocompleteService<Option extends StandardOption>
implements AutocompleteServiceType<Option> {
  private state: AutocompleteServiceStateType<Option> = {
    activeMenuItemIndex: null,
    showDropdownMenu: false,
    menuStyles: {
      position: undefined,
      top: "0px",
      left: "0px",
      width: "0px"
    },
    menuItemsHover: true,
    filteredSuggestions: [],
    userInput: ""
  };

  public readonly setState;

  public readonly getState;

  private readonly serviceCallbacks;

  private readonly refs;

  public controlWithDropDownMenu;

  constructor(
    {
      incrementComponentStateChangedCounter,
      serviceCallbacks,
      refs
    }: AutocompleteServiceParamsType<Option>
  ) {
    this.setState = (newStatePart: Partial<AutocompleteServiceStateType<Option>>) => {
      this.state = { ...this.state, ...newStatePart };
      incrementComponentStateChangedCounter();
    };

    this.getState = () => this.state;
    this.serviceCallbacks = serviceCallbacks;
    this.refs = refs;


    this.controlWithDropDownMenu = new ControlWithDropDownMenu<Option, AutocompleteServiceStateType<Option>>(
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
          menuItemsHover: true,
          filteredSuggestions: [],
          userInput: ""
        }
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

    const debouncedWrapper = debounce(
      {
        fn: this.inputChangeCallback,
        ms: 1000,
        context: this
      }
    );

    debouncedWrapper(e.currentTarget.value);
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
