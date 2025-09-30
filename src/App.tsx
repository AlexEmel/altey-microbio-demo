import { useEffect } from "react";
import { loadDictionaries, reset } from "./features/microbio.slice";
import { AppRouter } from "./routers/AppRouter";
import { useAppDispatch, useAppSelector } from "./store/store";

export const App = () => {
  const { microorganisms, antibiotics } = useAppSelector((store) => store.microbio.dictionaries);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(reset());
    if (microorganisms.length === 0 || antibiotics.length === 0) {
      dispatch(loadDictionaries());
    }
  }, [dispatch]);

  return <AppRouter />;
};
