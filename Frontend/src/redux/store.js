import { configureStore, combineReducers } from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import productReducer from"./productSlice"
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"

import createWebStorage from "redux-persist/es/storage/createWebStorage"

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null)
    },
    setItem(_key, value) {
      return Promise.resolve(value)
    },
    removeItem() {
      return Promise.resolve()
    },
  }
}

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage()

const rootReducer = combineReducers({
  user: userReducer,
  product:productReducer
  
})

const persistConfig = {
  key: "root",
  version: 1,
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
})

export const persistor = persistStore(store)
export default store