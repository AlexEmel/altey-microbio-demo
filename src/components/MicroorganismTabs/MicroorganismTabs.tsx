import { useAppSelector } from "@/store/store";
import { Flex, Tabs, TabsProps } from "antd";
import { ReactNode, useMemo, useState } from "react";
import { AddAntibioticForm } from "../AddAntibioticForm/AddAntibioticForm";
import styles from './MicroorganismTabs.module.scss';

export const MicroorganismTabs = (): ReactNode => {
  const { selectedMos } = useAppSelector((store) => store.microbio.antibiogram);
  const [activeKey, setActiveKey] = useState<string | undefined>(selectedMos[0]?.id);

  const items = useMemo<TabsProps["items"]>(() => {
    return selectedMos.map((mo) => ({
      key: mo.id,
      label: mo.name,
      children: <AddAntibioticForm moId={mo.id} />,
    }));
  }, [selectedMos]);

  const handleTabChange = (key: string) => setActiveKey(key);

  return (
    <Flex className={styles.tabContainer}>
      <Tabs items={items} activeKey={activeKey} onChange={handleTabChange} className={styles.tabs}/>
    </Flex>
  );
};
