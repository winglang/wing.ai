import { configureStore } from "@reduxjs/toolkit";
import root from "./root";

export const store = configureStore({
  reducer: root,
});
