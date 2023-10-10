import React, { useMemo } from "react";
import cn from "classnames";
import { MenuItemComponentType, StandardOption } from "../../componentsStateServices/types";

type MenuItemProps<Option extends StandardOption> = {
  menuItemData: Option;
  index: number;
  itemClassName: string;
  MenuItemComponent?: MenuItemComponentType<Option>;
  onMenuItemClick: (menuItemData: Option) => void;
  onMenuItemMouseEnter: (menuItemIndex: number) => void;
  onMenuItemMouseMove: (menuItemIndex: number) => void;
  getLabel?: (newValue: Option) => string;
}

export const DropdownMenuItem = <Option extends StandardOption, >(
  {
    menuItemData,
    index,
    onMenuItemClick,
    onMenuItemMouseEnter,
    onMenuItemMouseMove,
    itemClassName,
    MenuItemComponent,
    getLabel
  }: MenuItemProps<Option>
) => {
  const onItemMouseMove = useMemo(
    () => () => onMenuItemMouseMove(index),
    [ index, onMenuItemMouseMove ]
  );
  const onItemMouseEnter = useMemo(
    () => () => onMenuItemMouseEnter(index),
    [ index, onMenuItemMouseEnter ]
  );
  const onItemClick = useMemo(
    () => () => onMenuItemClick(menuItemData),
    [ onMenuItemClick, menuItemData ]
  );

  const getMenuItemChildren = () => {
    if (MenuItemComponent) {
      return <MenuItemComponent menuItemData={menuItemData} />;
    }

    return typeof getLabel === "function" ? getLabel(menuItemData) : menuItemData.label;
  };

  return (
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
    <li
      className={cn(itemClassName)}
      onClick={onItemClick}
      data-index={index}
      onMouseEnter={onItemMouseEnter}
      onMouseMove={onItemMouseMove}
    >
      {getMenuItemChildren()}
    </li>
  );
};
