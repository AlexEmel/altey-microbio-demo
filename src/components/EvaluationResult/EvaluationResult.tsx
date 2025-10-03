import { IEvaluationResult } from "@/interfaces/entities.interface";
import { Flex, Table } from "antd";
import Column from "antd/es/table/Column";
import Title from "antd/es/typography/Title";
import { FC, ReactNode } from "react";
import styles from './EvaluationResult.module.scss'

interface IEvaluationResultProps {
  result: IEvaluationResult;
}

export const EvaluationResult: FC<IEvaluationResultProps> = ({ result }): ReactNode => {
  return (
    <Flex className={styles.evaluation}>
      <Title level={4}>Расширенная антибиотикограмма</Title>
      <Table dataSource={result.antibiotics} rowKey={"antibioticCode"} size="small" pagination={false}>
        <Column title="Антибиотик" key="antibioticName" dataIndex="antibioticName" />
        <Column title="SIR" key="sir" dataIndex="sir" />
      </Table>
      {result.markers && result.markers.length > 0 ? (
        <>
          <Title level={4}>Маркеры резистентности</Title>
          {result.markers.map((mrk) => (
            <span>{mrk.markerName}</span>
          ))}
        </>
      ) : null}
      {result.interpretation.length > 0 ? (
        <>
          <Title level={5}>
            Сообщения экспертной системы в соответствии с таблицами Определение чувствительности
            микроорганизмов к антимикробным препаратам (Версия 2025-01):
          </Title>
          { result.interpretation.map(intpr => <p>{intpr}</p>) }
        </>
      ) : null}
    </Flex>
  );
};
