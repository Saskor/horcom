import React from "react";
import { Route, Routes, HashRouter } from "react-router-dom";
import cn from "classnames";
import { SearchPage } from "./features/searchPage/components/SearchPage";
import styles from "./App.scss";

const App = () => (
  <HashRouter>
    <div className={cn(styles.container)}>
      <Routes>
        <Route path="/" element={<SearchPage />} />
      </Routes>
    </div>
  </HashRouter>
);

export default App;


