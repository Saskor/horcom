import React, { CSSProperties, Fragment, RefObject, useRef, useState } from "react";
import cn from "classnames";
import { Portal } from "../Portal";
import { DropdownMenu } from "../DropdownMenu";
import { useComponentService } from "../../hooks/useComponentService";
import {
  AutocompleteService,
  AutocompleteServiceParamsType,
  AutocompleteServiceType
} from "../../componentsStateServices/AutocompleteService";
import {
  MenuItemComponentType,
  StandardOption
} from "../../componentsStateServices/types";
import styles from "./Autocomplete.scss";

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
    value,
    getLabel = (dataItem: Option) => dataItem.label || "",
    placeholder = ""
  }: {
    getFilteredSuggestions: (inputValue: string) => Array<Option>;
    MenuItemComponent?: MenuItemComponentType<Option>;
    dropdownMenuPortalTargetId?: string;
    onChange: (newValue: Option) => void;
    value: Option;
    getLabel?: (newValue: Option) => string;
    placeholder?: string,
  }
) => {
  const containerRef: RefObject<HTMLDivElement> = useRef(null);

  const initialState: AutocompleteStateType<Option> = {
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

  const [ state, setComponentState ] = useState<AutocompleteStateType<Option>>(initialState);

  const setState = (newStatePart: Partial<AutocompleteStateType<Option>>) => {
    setComponentState(currentState => ({
      ...currentState,
      ...newStatePart
    }));
  };

  const getState = () => state;

  const Service = useComponentService<
    AutocompleteService<Option>,
    AutocompleteServiceParamsType<Option>
    >(
      {
        Service: AutocompleteService,
        serviceParams: {
          componentStateManageHelpers: {
            getComponentState: getState,
            setComponentState: setState
          },
          serviceCallbacks: {
            getFilteredSuggestions,
            onChange,
            getLabel
          },
          refs: { containerRef },
          initialState
        }
      }
    ) as AutocompleteServiceType<Option>;

  const displayedValue = getLabel(value);

  return (
    <Fragment>
      <div
        className={cn(styles.container)}
        ref={containerRef}
      >
        <input
          type="text"
          onChange={Service.onInputChange}
          onKeyDown={Service.onAutocompleteControlKeyDown}
          // onBlur={onControlBlur}
          value={displayedValue && !state.userInput ? displayedValue : state.userInput}
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
            onMenuItemClick={Service.onMenuItemClick}
            onMenuItemMouseEnter={Service.controlWithDropDownMenu.onMenuItemMouseEnter}
            onMenuItemMouseMove={Service.controlWithDropDownMenu.onMenuItemMouseMove}
            onMenuMouseLeave={Service.onMenuMouseLeave}
            menuStyles={state.menuStyles}
            getLabel={getLabel}
            MenuItemComponent={MenuItemComponent}
          />
        </Portal>
      )}
    </Fragment>
  );
};
