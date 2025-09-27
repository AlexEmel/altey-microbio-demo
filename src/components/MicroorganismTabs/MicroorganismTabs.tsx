import { useAppSelector } from "@/store/store";
import { Flex, Tabs, TabsProps } from "antd";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { AddAntibioticForm } from "../AddAntibioticForm/AddAntibioticForm";
import styles from "./MicroorganismTabs.module.scss";
import { ISelectedMicroorganism } from "@/interfaces/entities.interface";

export const MicroorganismTabs = (): ReactNode => {
  const { selectedMos } = useAppSelector((store) => store.microbio.antibiogram);
  const [activeKey, setActiveKey] = useState<string | undefined>(selectedMos[0]?.id);
  const prevMosRef = useRef<ISelectedMicroorganism[]>(selectedMos);

  useEffect(() => {
    const prev = prevMosRef.current;
    const curr = selectedMos;

    if (curr.length === 0) {
      setActiveKey(undefined);
    } else {
      const activeStillExists = curr.some((m) => m.id === activeKey);
      if (!activeStillExists) {
        const deletedIndexInPrev = prev.findIndex((m) => m.id === activeKey);
        const nextIndex = Math.min(Math.max(deletedIndexInPrev, 0), curr.length - 1);
        setActiveKey(curr[nextIndex].id);
      }
    }

    prevMosRef.current = curr;
  }, [selectedMos, activeKey]);

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
      <Tabs items={items} activeKey={activeKey} onChange={handleTabChange} className={styles.tabs} />
    </Flex>
  );
};
