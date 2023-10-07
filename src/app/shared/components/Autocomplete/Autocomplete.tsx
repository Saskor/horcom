import React, { CSSProperties, Fragment, RefObject, useRef, useState } from "react";
import cn from "classnames";
import { Portal } from "../Portal";
import { DropdownMenu } from "../DropdownMenu";
import { useComponentService } from "../../hooks/useComponentService";
import {
  AutocompleteService,
  AutocompleteServiceParams, AutocompleteServiceType
} from "../../componentsStateServices/AutocompleteService";
import {
  MenuItemComponentType,
  StandardOption
} from "../../componentsStateServices/types";
import styles from "./Autocomplete.scss";

export type AutocompleteState<Option> = {
    activeMenuItemIndex: null | number;
    showDropdownMenu: boolean;
    menuStyles: CSSProperties;
    menuItemsHover: boolean;
    filteredSuggestions: Array<Option>;
    userInput: string;
}

/*
 *activeMenuItemIndex: null,
 *  +showDropdownMenu: false,
 *  +menuStyles: this.setMenuStyles(params.containerRef),
 *  +menuItemsHover: true,
 *  dropdownMenuItemsData: params.dropdownMenuItemsData = [],
 *  +containerRef: params.containerRef,
 *  +value: params.value
 */

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

  const initialState = {
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

  const [ state, setComponentState ] = useState<AutocompleteState<Option>>(initialState);

  const setState = (newStatePart: Partial<AutocompleteState<Option>>) => {
    setComponentState({
      ...state,
      ...newStatePart
    });
  };

  const getState = () => state;

  const Service = useComponentService<
    AutocompleteService<Option>,
    AutocompleteServiceParams<Option>
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
