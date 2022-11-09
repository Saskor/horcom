import React, { Fragment, useEffect, useRef, useState } from "react";
import cn from "classnames";
import { Portal } from "../Portal";
import { DropdownMenu } from "../DropdownMenu";
import { useComponentService } from "../../hooks/useComponentService";
import {
  AutocompleteService,
  AutocompleteServiceParams
} from "../../componentsStateServices/AutocompleteService";
import {
  MenuItemComponentType,
  StandardOption
} from "../../componentsStateServices/ServiceBase";
import styles from "./Autocomplete.scss";

export const Autocomplete = <Option extends StandardOption, >(
  {
    getFilteredSuggestions,
    suggestions,
    MenuItemComponent,
    dropdownMenuPortalTargetId,
    onChange,
    value
  }: {
    getFilteredSuggestions?: (inputValue: string) => Array<Option>;
    suggestions?: Array<Option>;
    MenuItemComponent?: MenuItemComponentType;
    dropdownMenuPortalTargetId: string;
    onChange: (newValue: Option) => void;
    value: Option;
  }
) => {
  const containerRef = useRef(null);
  const [ , setState ] = useState(null);

  const Service = useComponentService<
    AutocompleteService<Option>,
    AutocompleteServiceParams<Option>
    >(
      {
        Service: AutocompleteService,
        serviceChangeHandler: setState,
        serviceParams: {
          getFilteredSuggestions,
          suggestions,
          onChange,
          containerRef,
          MenuItemComponent,
          value
        }
      }
    ) as AutocompleteService<Option>;

  useEffect(() => {
    Service.handleUpdate({
      value,
      userInput: value.label
    });
  }, [ value ]);

  useEffect(() => {
    Service.handleUpdate({
      suggestions
    });
  }, [ suggestions ]);

  return (
    <Fragment>
      {/* console.log(state, Service.state)*/}
      <div
        className={cn(styles.container)}
        ref={containerRef}
      >
        <input
          type="text"
          onChange={Service.onInputChange}
          onKeyDown={Service.onAutocompleteControlKeyDown}
          // onBlur={onControlBlur}
          value={Service.state.userInput}
        />
      </div>
      {Service.state.showDropdownMenu && (
        <Portal
          portalRootElementId={dropdownMenuPortalTargetId}
        >
          <DropdownMenu<Option>
            menuItemsData={Service.state.filteredSuggestions}
            menuItemsHover={Service.state.menuItemsHover}
            activeSuggestionIndex={Service.state.activeMenuItemIndex}
            onMenuItemClick={Service.onMenuItemClick}
            onMenuItemMouseEnter={Service.onMenuItemMouseEnter}
            onMenuItemMouseMove={Service.onMenuItemMouseMove}
            onMenuMouseLeave={Service.onMenuMouseLeave}
            menuStyles={Service.state.menuStyles}
          />
        </Portal>
      )}
    </Fragment>
  );
};
