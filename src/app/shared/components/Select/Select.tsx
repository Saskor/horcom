import React, { Fragment, useState, useRef, RefObject, CSSProperties } from "react";
import cn from "classnames";
import { FaChevronDown } from "react-icons/fa";
import { Portal } from "../Portal";
import { DropdownMenu } from "../DropdownMenu";
import {
  MenuItemComponentType,
  StandardOption
} from "../../hooks/types";
import styles from "./Select.scss";
import { useSelectService } from "app/shared/hooks/useSelectService";

export type SelectStateType = {
  activeMenuItemIndex: null | number;
  showDropdownMenu: boolean;
  menuStyles: CSSProperties;
  menuItemsHover: boolean;
}

export const Select = <Option extends StandardOption, >(
  {
    dropdownMenuItemsData,
    MenuItemComponent,
    dropdownMenuPortalTargetId,
    onChange,
    value,
    getLabel = (dataItem: Option) => dataItem.label || ""
  }: {
    dropdownMenuItemsData: Array<Option>;
    MenuItemComponent?: MenuItemComponentType<Option>;
    dropdownMenuPortalTargetId?: string;
    onChange: (newValue: Option) => void;
    value: Option;
    getLabel?: (newValue: Option) => string;
  }
) => {
  const SELECT_INITIAL_STATE: SelectStateType = {
    activeMenuItemIndex: null,
    showDropdownMenu: false,
    menuStyles: {
      position: undefined,
      top: "0px",
      left: "0px",
      width: "0px"
    },
    menuItemsHover: true
  };

  const containerRef: RefObject<HTMLDivElement> = useRef(null);

  const [
    state,
    setState
  ] = useState(SELECT_INITIAL_STATE);

  const setComponentState = (newStatePart: Partial<SelectStateType>) => {
    setState(currentState => ({
      ...currentState,
      ...newStatePart
    }));
  };

  const selectService = useSelectService<Option>(
    {
      data: { dropdownMenuItemsData },
      stateData: {
        initialState: SELECT_INITIAL_STATE,
        state
      },
      setComponentState,
      serviceCallbacks: {
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
        <button
          className={cn(styles.controlButton)}
          type="button"
          onKeyDown={selectService.onSelectControlKeyDown}
          onClick={selectService.onSelectClick}
        >
          {getLabel(value)}
          <FaChevronDown />
        </button>
      </div>
      {state.showDropdownMenu && (
        <Portal
          portalRootElementId={dropdownMenuPortalTargetId}
        >
          <DropdownMenu<Option>
            menuItemsData={dropdownMenuItemsData}
            menuItemsHover={state.menuItemsHover}
            activeSuggestionIndex={state.activeMenuItemIndex}
            onMenuItemClick={selectService.onMenuItemClick}
            onMenuItemMouseEnter={selectService.controlWithDropDownMenu.onMenuItemMouseEnter}
            onMenuItemMouseMove={selectService.controlWithDropDownMenu.onMenuItemMouseMove}
            onMenuMouseLeave={selectService.onMenuMouseLeave}
            menuStyles={state.menuStyles}
            getLabel={getLabel}
            MenuItemComponent={MenuItemComponent}
          />
        </Portal>
      )}
    </Fragment>
  );
};
