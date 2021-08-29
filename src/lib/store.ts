import {
  configureStore,
  ThunkAction,
  Action,
  Middleware,
} from "@reduxjs/toolkit";
import reducers from "./reducers/reducers";

const middlewares: Middleware<{}, any>[] = [];
if (process.env.NODE_ENV === `development`) {
  const { createLogger } = require("redux-logger");
  const logger = createLogger({
    collapsed: true,
    //duration: true,
    //diff: true,
  });
  middlewares.push(logger);
}

export const store = configureStore({
  reducer: reducers,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true,
      immutableCheck: true,
    }).concat(middlewares),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
