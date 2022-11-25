import React from "react";
import { Route, Routes, HashRouter } from "react-router-dom";
import { SearchPage } from "./features/searchPage/components/SearchPage";

const App = () => (
  <HashRouter>
    <div className={"123"}>
      <Routes>
        <Route path="/" element={<SearchPage />} />
      </Routes>
    </div>
  </HashRouter>
);

export default App;


