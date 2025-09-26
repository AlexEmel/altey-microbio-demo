import { IEvaluationResult } from "@/interfaces/entities.interface";
import { Table } from "antd";
import Column from "antd/es/table/Column";
import Title from "antd/es/typography/Title";
import { FC, ReactNode } from "react";

interface IEvaluationResultProps {
  result: IEvaluationResult;
}

export const EvaluationResult: FC<IEvaluationResultProps> = ({ result }): ReactNode => {
  return (
    <>
      <Title level={4}>Расширенная антибиотикограмма</Title>
      <Table dataSource={result.antibiotics} rowKey={"antibioticCode"} size="small" pagination={false}>
        <Column title="Антибиотик" key="antibioticName" dataIndex="antibioticName" />
        <Column title="SIR" key="SIR" dataIndex="SIR" />
      </Table>
      {result.markers.length > 0 ? (
        <>
          <Title level={4}>Маркеры резистентности</Title>
          {result.markers.map((mrk) => (
            <span>{mrk.markerName}</span>
          ))}
        </>
      ) : null}
      {result.interpretation.length > 0 ? (
        <>
          <p>
            Сообщения экспертной системы в соответствии с таблицами Определение чувствительности
            микроорганизмов к антимикробным препаратам (Версия 2025-01):
          </p>
          { result.interpretation.map(intpr => <p>{intpr}</p>) }
        </>
      ) : null}
      <></>
    </>
  );
};
