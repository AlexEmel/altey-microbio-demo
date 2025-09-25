import { evaluate } from "@/features/microbio.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Button } from "antd";
import { ReactNode } from "react";

export const Evaluation = (): ReactNode => {
  const { isLoading } = useAppSelector((store) => store.microbio);
  const dispatch = useAppDispatch();

  const handleEvaluate = (): void => {
    dispatch(evaluate());
  }

  return (
    <>
    <Button type="primary" disabled={isLoading}>Интерпретировать результаты</Button>
    </>
  );
};
