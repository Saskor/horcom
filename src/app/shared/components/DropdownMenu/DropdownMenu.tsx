import cn from "classnames";
import React, { CSSProperties } from "react";
import { StandardOption, MenuItemComponentType } from "../../componentsStateServices/ServiceBase";
import styles from "./DropdownMenu.scss";
import { DropdownMenuItem } from "./DropdownMenuItem";

type Props<Option extends StandardOption> = {
  menuItemsData: Array<Option>,
  menuItemsHover: boolean;
  activeSuggestionIndex: number | null,
  menuStyles: CSSProperties;
  MenuItemComponent?: MenuItemComponentType;
  onMenuMouseLeave?: () => void;
  onMenuItemClick: (menuItem: Option) => void;
  onMenuItemMouseEnter: (menuItemIndex: number) => void;
  onMenuItemMouseMove: (menuItemIndex: number) => void;
  getLabel: (newValue: Option) => string;
};

export const DropdownMenu = <Option extends StandardOption, >(
  {
    menuItemsData,
    menuItemsHover,
    onMenuMouseLeave,
    activeSuggestionIndex,
    onMenuItemClick,
    onMenuItemMouseEnter,
    onMenuItemMouseMove,
    menuStyles,
    MenuItemComponent,
    getLabel
  }: Props<Option>
) => (
    menuItemsData && Boolean(menuItemsData.length)
      ? (
        <ul
          style={menuStyles}
          className={cn(styles.suggestions)}
          onMouseLeave={onMenuMouseLeave}
        >
          {menuItemsData.map((menuItemData, index) => (
            <DropdownMenuItem<Option>
                key={getLabel(menuItemData)}
                {...{
                  menuItemData,
                  index,
                  activeSuggestionIndex,
                  onMenuItemClick,
                  onMenuItemMouseEnter,
                  onMenuItemMouseMove,
                  itemClassName: (cn({
                    [styles.suggestionActive]: index === activeSuggestionIndex,
                    [styles.suggestionNoHover]: !menuItemsHover,
                    [styles.suggestion]: menuItemsHover
                  })),
                  MenuItemComponent,
                  getLabel
                }}
              />
            ))}
        </ul>
      )
      : (
        <div
          style={menuStyles}
          className={cn(styles["no-suggestions"])}
        >
          <em>No suggestions, you&apos;re on your own!</em>
        </div>
      )
  );
