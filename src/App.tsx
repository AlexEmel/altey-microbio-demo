import { useEffect } from "react";
import { loadDictionaries } from "./features/microbio.slice";
import { AppRouter } from "./routers/AppRouter";
import { useAppDispatch } from "./store/store";

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadDictionaries());
  }, [])

  return <AppRouter />
}