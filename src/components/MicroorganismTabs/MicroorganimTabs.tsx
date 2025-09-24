import { useAppSelector } from "@/store/store";
import { Tabs, TabsProps } from "antd";
import { ReactNode, useMemo, useState } from "react";

export const MicroorganismTabs = (): ReactNode => {
  const { selectedMos } = useAppSelector((store) => store.microbio.antibiogram);
  const [activeKey, setActiveKey] = useState<string | undefined>(selectedMos[0]?.id);

  const items = useMemo<TabsProps["items"]>(() => {
      return selectedMos.map((mo) => ({
        key: mo.id,
        label: mo.name,
        children: <h1>{mo.name}</h1>,
      }));
  }, [selectedMos]);

  const handleTabChange = (key: string) => setActiveKey(key);

  return <Tabs
      items={items}
      activeKey={activeKey}
      onChange={handleTabChange}
    />;
};
