import React, { Fragment, useState, useRef, useEffect } from "react";
import cn from "classnames";
import { FaChevronDown } from "react-icons/fa";
import { Portal } from "../Portal";
import { DropdownMenu } from "../DropdownMenu";
import {
  MenuItemComponentType,
  StandardOption
} from "../../componentsStateServices/ServiceBase";
import { useComponentService } from "../../hooks/useComponentService";
import {
  SelectService,
  SelectServiceParams
} from "../../componentsStateServices/SelectService";
import styles from "./Select.scss";

export const Select = <Option extends StandardOption, >(
  {
    dropdownMenuItemsData,
    MenuItemComponent,
    dropdownMenuPortalTargetId,
    onChange,
    value
  }: {
    dropdownMenuItemsData: Array<Option>;
    MenuItemComponent?: MenuItemComponentType;
    dropdownMenuPortalTargetId: string;
    onChange: (newValue: Option) => void;
    value: Option;
  }
) => {
  const containerRef = useRef(null);
  const [ , setState ] = useState(null);

  const Service = useComponentService<
    SelectService<Option>,
    SelectServiceParams<Option>
    >(
      {
        Service: SelectService,
        serviceChangeHandler: setState,
        serviceParams: {
          dropdownMenuItemsData,
          MenuItemComponent,
          onChange,
          containerRef,
          value
        }
      }
    ) as SelectService<Option>;

  useEffect(() => {
    Service.handleUpdate({
      dropdownMenuItemsData
    });
  }, [ dropdownMenuItemsData ]);

  useEffect(() => {
    Service.handleUpdate({
      value
    });
  }, [ value ]);

  return (
    <Fragment>
      {/* console.log(state, Service.state)*/}
      <div
        className={cn(styles.container)}
        ref={containerRef}
      >
        <button
          className={cn(styles.controlButton)}
          type="button"
          onKeyDown={Service.onSelectControlKeyDown}
          // onBlur={onControlBlur}
          onClick={Service.onSelectClick}
        >
          {Service.state.value.label}
          <FaChevronDown />
        </button>
      </div>
      {Service.state.showDropdownMenu && (
        <Portal
          portalRootElementId={dropdownMenuPortalTargetId}
        >
          <DropdownMenu<Option>
            menuItemsData={Service.state.dropdownMenuItemsData}
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
