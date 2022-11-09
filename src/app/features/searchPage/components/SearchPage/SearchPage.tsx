import React from "react";
import { SearchPageStore } from "../../stores/searchPageStore";
import { SearchPageFilters } from "../SearchPageFilters";
import { SearchPageList } from "../SearchPageList";

export const SearchPage = () => (
  <React.Fragment>
    <SearchPageFilters searchPageStore={SearchPageStore} />
    <SearchPageList searchPageStore={SearchPageStore} />
  </React.Fragment>
);
