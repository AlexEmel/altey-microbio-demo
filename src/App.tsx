import { useEffect } from "react"
import { AppRouter } from "./routers/AppRouter"
import { useAppDispatch } from "./store/store"
import { getAntibiotics, getMicroorganisms } from "./features/microbio.slice";

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getMicroorganisms());
    dispatch(getAntibiotics())
  }, [])

  return <AppRouter />
}