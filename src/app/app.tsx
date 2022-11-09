import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { SearchPage } from "./features/searchPage/components/SearchPage";

const App = () => (
  <BrowserRouter>
    <div className={"123"}>
      <Routes>
        <Route path="/" element={<SearchPage />} />
      </Routes>
    </div>
  </BrowserRouter>
);

export default App;


