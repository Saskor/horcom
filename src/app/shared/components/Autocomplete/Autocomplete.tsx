import React, { Fragment, RefObject, useRef, useState } from "react";
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

export const Autocomplete = <Option extends StandardOption, >(
  {
    getFilteredSuggestions,
    MenuItemComponent,
    dropdownMenuPortalTargetId,
    onChange,
    getLabel = (dataItem: Option) => dataItem.label || "",
    placeholder = ""
  }: {
    getFilteredSuggestions: (inputValue: string) => Array<Option>;
    MenuItemComponent?: MenuItemComponentType<Option>;
    dropdownMenuPortalTargetId?: string;
    onChange: (newValue: Option) => void;
    getLabel?: (newValue: Option) => string;
    placeholder?: string,
  }
) => {
  const containerRef: RefObject<HTMLDivElement> = useRef(null);

  const [
    ,
    setComponentState
  ] = useState<{ stateChangedCounter: number }>({ stateChangedCounter: 0 });

  const incrementComponentStateChangedCounter = () => {
    setComponentState(currentState => ({
      stateChangedCounter: currentState.stateChangedCounter + 1
    }));
  };

  const Service = useComponentService<
    AutocompleteService<Option>,
    AutocompleteServiceParamsType<Option>
    >(
      {
        Service: AutocompleteService,
        serviceParams: {
          incrementComponentStateChangedCounter,
          serviceCallbacks: {
            getFilteredSuggestions,
            onChange,
            getLabel
          },
          refs: { containerRef }
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
          value={Service.getState().userInput}
          placeholder={placeholder}
        />
      </div>
      {Service.getState().showDropdownMenu && (
        <Portal
          portalRootElementId={dropdownMenuPortalTargetId}
        >
          <DropdownMenu
            menuItemsData={Service.getState().filteredSuggestions}
            menuItemsHover={Service.getState().menuItemsHover}
            activeSuggestionIndex={Service.getState().activeMenuItemIndex}
            onMenuItemClick={Service.onMenuItemClick}
            onMenuItemMouseEnter={Service.controlWithDropDownMenu.onMenuItemMouseEnter}
            onMenuItemMouseMove={Service.controlWithDropDownMenu.onMenuItemMouseMove}
            onMenuMouseLeave={Service.onMenuMouseLeave}
            menuStyles={Service.getState().menuStyles}
            getLabel={getLabel}
            MenuItemComponent={MenuItemComponent}
          />
        </Portal>
      )}
    </Fragment>
  );
};
