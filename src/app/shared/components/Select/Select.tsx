import React, { Fragment, useState, useRef, CSSProperties, RefObject } from "react";
import cn from "classnames";
import { FaChevronDown } from "react-icons/fa";
import { Portal } from "../Portal";
import { DropdownMenu } from "../DropdownMenu";
import {
  MenuItemComponentType,
  StandardOption
} from "../../componentsStateServices/types";
import { useComponentService } from "../../hooks/useComponentService";
import {
  SelectService,
  SelectServiceParamsType
} from "../../componentsStateServices/SelectService";
import styles from "./Select.scss";

export type SelectStateType<Option> = {
  activeMenuItemIndex: null | number;
  showDropdownMenu: boolean;
  menuStyles: CSSProperties;
  menuItemsHover: boolean;
  dropdownMenuItemsData: Array<Option>;
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
  const containerRef: RefObject<HTMLDivElement> = useRef(null);

  const initialState: SelectStateType<Option> = {
    activeMenuItemIndex: null,
    showDropdownMenu: false,
    menuStyles: {
      position: undefined,
      top: "0px",
      left: "0px",
      width: "0px"
    },
    menuItemsHover: true,
    dropdownMenuItemsData
  };

  const [ state, setComponentState ] = useState<SelectStateType<Option>>(initialState);

  const setState = (newStatePart: Partial<SelectStateType<Option>>) => {
    setComponentState(currentState => ({
      ...currentState,
      ...newStatePart
    }));
  };

  const getState = () => state;

  const Service = useComponentService<
    SelectService<Option>,
    SelectServiceParamsType<Option>
    >(
      {
        Service: SelectService,
        serviceParams: {
          componentStateManageHelpers: {
            getComponentState: getState,
            setComponentState: setState
          },
          serviceCallbacks: {
            onChange,
            getLabel
          },
          refs: { containerRef },
          initialState
        }
      }
    ) as SelectService<Option>;

  return (
    <Fragment>
      <div
        className={cn(styles.container)}
        ref={containerRef}
      >
        <button
          className={cn(styles.controlButton)}
          type="button"
          onKeyDown={Service.onSelectControlKeyDown}
          onBlur={Service.controlWithDropDownMenu.onControlBlur}
          onClick={Service.onSelectClick}
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
