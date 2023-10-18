import React, { CSSProperties, Fragment, RefObject, useRef, useState } from "react";
import cn from "classnames";
import { Portal } from "../Portal";
import { DropdownMenu } from "../DropdownMenu";
import {
  MenuItemComponentType,
  StandardOption
} from "../../hooks/types";
import styles from "./Autocomplete.module.scss";
import { useAutocompleteService } from "app/shared/hooks/useAutocompleteService";

export type AutocompleteStateType<Option> = {
  activeMenuItemIndex: null | number;
  showDropdownMenu: boolean;
  menuStyles: CSSProperties;
  menuItemsHover: boolean;
  filteredSuggestions: Array<Option>;
  userInput: string;
}

export const Autocomplete = <Option extends StandardOption, >(
  {
    getFilteredSuggestions,
    MenuItemComponent,
    dropdownMenuPortalTargetId,
    onChange,
    getLabel = (dataItem: Option) => dataItem.label || "",
    placeholder = "",
    initialValue
  }: {
    getFilteredSuggestions: (inputValue: string) => Array<Option>;
    MenuItemComponent?: MenuItemComponentType<Option>;
    dropdownMenuPortalTargetId?: string;
    onChange: (newValue: Option) => void;
    getLabel?: (newValue: Option) => string;
    placeholder?: string,
    initialValue: Option
  }
) => {
  const AUTOCOMPLETE_INITIAL_STATE: AutocompleteStateType<Option> = {
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
    userInput: getLabel(initialValue)
  };

  const containerRef: RefObject<HTMLDivElement> = useRef(null);

  const [
    state,
    setState
  ] = useState(AUTOCOMPLETE_INITIAL_STATE);

  const setComponentState = (newStatePart: Partial<AutocompleteStateType<Option>>) => {
    setState(currentState => ({
      ...currentState,
      ...newStatePart
    }));
  };

  const autocompleteService = useAutocompleteService<Option>(
    {
      stateData: {
        initialState: AUTOCOMPLETE_INITIAL_STATE,
        state
      },
      setComponentState,
      serviceCallbacks: {
        getFilteredSuggestions,
        onChange,
        getLabel
      },
      refs: { containerRef }
    }
  );

  return (
    <Fragment>
      <div
        className={cn(styles.container)}
        ref={containerRef}
      >
        <input
          className={cn(styles.input)}
          type="text"
          onChange={autocompleteService.onInputChange}
          onKeyDown={autocompleteService.onAutocompleteControlKeyDown}
          value={state.userInput}
          placeholder={placeholder}
        />
      </div>
      {state.showDropdownMenu && (
        <Portal
          portalRootElementId={dropdownMenuPortalTargetId}
        >
          <DropdownMenu
            menuItemsData={state.filteredSuggestions}
            menuItemsHover={state.menuItemsHover}
            activeSuggestionIndex={state.activeMenuItemIndex}
            onMenuItemClick={autocompleteService.onMenuItemClick}
            onMenuItemMouseEnter={autocompleteService.controlWithDropDownMenu.onMenuItemMouseEnter}
            onMenuItemMouseMove={autocompleteService.controlWithDropDownMenu.onMenuItemMouseMove}
            onMenuMouseLeave={autocompleteService.onMenuMouseLeave}
            menuStyles={state.menuStyles}
            getLabel={getLabel}
            MenuItemComponent={MenuItemComponent}
          />
        </Portal>
      )}
    </Fragment>
  );
};
