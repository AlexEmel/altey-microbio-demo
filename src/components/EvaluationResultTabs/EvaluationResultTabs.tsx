import { IEvaluation } from "@/interfaces/entities.interface";
import { Flex, Tabs, TabsProps } from "antd";
import { FC, ReactNode, useMemo, useState } from "react";
import { EvaluationResult } from "../EvaluationResult/EvaluationResult";

interface IEvaluationTabProps {
  evaluation: IEvaluation;
}

export const EvaluationResultTabs: FC<IEvaluationTabProps> = ({ evaluation }): ReactNode => {
  const [activeKey, setActiveKey] = useState<string | undefined>(
    evaluation.microorganisms[0]?.microorganismCode
  );

  const items = useMemo<TabsProps["items"]>(() => {
    return evaluation.microorganisms.map((mo) => ({
      key: mo.microorganismCode,
      label: mo.microorganismName,
      children: <EvaluationResult result={mo} />,
    }));
  }, [evaluation]);

  const handleTabChange = (key: string) => setActiveKey(key);

  return (
    <Flex>
      <Tabs items={items} activeKey={activeKey} onChange={handleTabChange} />
    </Flex>
  );
};
