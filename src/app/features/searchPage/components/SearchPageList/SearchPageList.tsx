import React from "react";
import { observer } from "mobx-react";
import cn from "classnames";
import { SearchPageStoreType } from "../../stores/searchPageStore";
import { SearchPageListItem } from "../SearchPageListItem";
import styles from "./SearchPageList.module.scss";

export const SearchPageList = observer(
  (
    {
      searchPageStore
    }: {
      searchPageStore: SearchPageStoreType
    }
  ) => {
    const {
      data
    } = searchPageStore;

    return (
      <div className={cn(styles.container)}>
        {data.map(dataItem => (
          <SearchPageListItem key={dataItem.id} dataItem={dataItem} />
        ))}
      </div>
    );
  }
);
