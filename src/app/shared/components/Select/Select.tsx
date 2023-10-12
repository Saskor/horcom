import React, { Fragment, useState, useRef, RefObject } from "react";
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
    SelectService<Option>,
    SelectServiceParamsType<Option>
    >(
      {
        Service: SelectService,
        serviceParams: {
          incrementComponentStateChangedCounter,
          serviceCallbacks: {
            onChange,
            getLabel
          },
          refs: { containerRef },
          data: { dropdownMenuItemsData }
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
          onClick={Service.onSelectClick}
        >
          {getLabel(value)}
          <FaChevronDown />
        </button>
      </div>
      {Service.getState().showDropdownMenu && (
        <Portal
          portalRootElementId={dropdownMenuPortalTargetId}
        >
          <DropdownMenu<Option>
            menuItemsData={dropdownMenuItemsData}
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
