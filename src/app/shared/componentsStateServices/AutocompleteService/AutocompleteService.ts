import React, { CSSProperties, RefObject } from "react";
import { debounce } from "../../helpers/customDebounce";
import { MenuItemComponentType, StandardOption } from "../ServiceBase";
import { ControlWithDropDownMenu } from "../ControlWithDropDownMenu";

export type AutocompleteServiceParams<Option> = {
  getFilteredSuggestions?: (inputValue: string) => Array<Option>;
  suggestions?: Array<Option>;
  MenuItemComponent?: MenuItemComponentType;
  onChange: (newValue: Option) => void;
  containerRef: RefObject<HTMLDivElement>;
  value: Option;
};

export type AutocompleteServiceType<Option> = {
  handleMount: () => void;
  handleUpdate: (params: { [param: string]: any }) => void;
  handleUnmount: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAutocompleteControlKeyDown: (e: React.KeyboardEvent) => void;
  onMenuItemClick: (menuItem: Option) => void;
  onMenuMouseLeave: () => void;
}

export class AutocompleteService<Option extends StandardOption>
  extends ControlWithDropDownMenu<Option>
  implements AutocompleteServiceType<Option> {
  constructor(private readonly params: AutocompleteServiceParams<Option>) {
    super();

    this.initState(this.getInitialState(this.params));
    this.setFunctionsFromParams(this.getFunctionsFromParams(this.params));
  }

  private getFunctionsFromParams = ({
    getFilteredSuggestions,
    MenuItemComponent,
    onChange
  }: AutocompleteServiceParams<Option>) => ({
    getFilteredSuggestions,
    MenuItemComponent,
    onChange
  })

  private getInitialState = (params: AutocompleteServiceParams<Option>): {
    activeMenuItemIndex: number | null;
    showDropdownMenu: boolean;
    menuStyles: CSSProperties;
    menuItemsHover: boolean;
    filteredSuggestions: Array<Option>,
    containerRef: RefObject<HTMLDivElement>,
    userInput: string;
    value: Option;
    suggestions?: Array<Option>;
  } => ({
    activeMenuItemIndex: null,
    showDropdownMenu: false,
    menuStyles: this.setMenuStyles(params.containerRef),
    menuItemsHover: true,
    filteredSuggestions: [],
    containerRef: params.containerRef,
    userInput: params.value.label || "",
    value: params.value,
    suggestions: params.suggestions
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

  private inputChangeCallback = (userInput: string) => {
    const { getFilteredSuggestions } = this.functionsFromParams;
    const { suggestions = [] } = this.state;

    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = typeof getFilteredSuggestions === "function" && !suggestions.length
      ? getFilteredSuggestions(userInput)
      : suggestions.filter(
        ({ label }: Option) => (
          label.toLowerCase().includes(userInput.toLowerCase())
        )
      );

    this.setState({
      showDropdownMenu: Boolean(userInput),
      filteredSuggestions
    });
  }

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      menuStyles: this.setMenuStyles(this.state.containerRef),
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
    } = this.state;

    const { onChange: onChangeCallback } = this.functionsFromParams;

    this.onControlKeyDown({
      eventKey: e.key,
      dropdownMenuItemsData: filteredSuggestions,
      activeMenuItemIndex,
      onChangeCallback
    });
  };

  onMenuItemClick = (menuItem: Option) => {
    super.onMenuItemClick(menuItem, this.functionsFromParams.onChange);
  }

  onMenuMouseLeave = () => {
    if (this.state.activeMenuItemIndex === null) {
      return;
    }

    this.setState({
      activeMenuItemIndex: null,
      menuItemsHover: false
    });
  }
}
