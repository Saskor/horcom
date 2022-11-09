import React, { ReactElement } from "react";
import cn from "classnames";
import Select, { ActionMeta, OnChangeValue } from "react-select";

import styles from "./Selector.scss";

type SelectProps <Option> = {
  label: string;
  value: Option;
  options: Array<Option> | undefined;
  disabled?: boolean;
  onChange: <Option>(
    value: OnChangeValue<Option, false>,
    actionMeta: ActionMeta<Option>
  ) => void;
  labelFor: string
}

export const Selector = <Option, >(
  {
    label,
    value,
    options,
    disabled,
    onChange,
    labelFor
  }: SelectProps<Option>
) => (
  <div className={cn(styles.container)}>
    <label htmlFor={labelFor} >{label}</label>
    <Select
      value={value}
      onChange={onChange}
      options={options}
      isDisabled={disabled}
      menuPortalTarget={document.getElementById("portal-root")}
      menuPlacement="bottom"
      menuPosition="fixed"
    />
  </div>
  );
