import { evaluateResults } from "@/features/microbio.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Button, Flex } from "antd";
import { ReactNode } from "react";
import styles from "./Evaluation.module.scss";
import Title from "antd/es/typography/Title";
import { MapEvaluationReqDto } from "@/utils/mappers.util";
import { EvaluationResultTabs } from "../EvaluationResultTabs/EvaluationResultTabs";

export const Evaluation = (): ReactNode => {
  const { isLoading } = useAppSelector((store) => store.microbio);
  const { selectedMos, selectedAbxs } = useAppSelector((store) => store.microbio.antibiogram);
  const { evaluation } = useAppSelector((store) => store.microbio);
  const dispatch = useAppDispatch();

  const handleEvaluate = (): void => {
    const req = MapEvaluationReqDto(selectedMos, selectedAbxs);
    dispatch(evaluateResults(req));
  };

  return (
    <Flex className={styles.formbox}>
      <Flex className={styles.info}>
        <Title level={3}>Шаг 3. Интерпретация результатов по EUCAST2025</Title>
        <p>Определение чувствительности микроорганизмов к антимикробным препаратам КМАХ Версия 2025-01</p>
      </Flex>
      <Button type="primary" disabled={isLoading} onClick={handleEvaluate}>
        Интерпретировать результаты
      </Button>
      {evaluation && <EvaluationResultTabs evaluation={evaluation} />}
    </Flex>
  );
};
