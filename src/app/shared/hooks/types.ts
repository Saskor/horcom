import { FC } from "react";

export type StandardOption = {
    label?: string;
    value?: string | number | null;
    disabled?: boolean;
};

export type MenuItemComponentType<Option> = FC<{menuItemData: Option}>
