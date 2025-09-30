import { resetEvaluation, setAntibiogramMos } from "@/features/microbio.slice";
import { IMicroorganism, ISelectedMicroorganism } from "@/interfaces/entities.interface";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { DeleteOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Button, Flex, Select, Tooltip } from "antd";
import Title from "antd/es/typography/Title";
import { ReactNode, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./AddMicroorganismForm.module.scss";

export const AddMicroorganismForm = (): ReactNode => {
  const [selectedMos, setSelectedMos] = useState<ISelectedMicroorganism[]>([{ id: uuidv4(), code: "", name: "" }]);
  const { microorganisms } = useAppSelector((store) => store.microbio.dictionaries);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selectedMos.length === 1 && !selectedMos[0].code) {
      dispatch(resetEvaluation());
      return;
    } else {
      dispatch(setAntibiogramMos(selectedMos));
    }
  }, [selectedMos, dispatch]);

  const addRow = (): void => {
    if (!selectedMos[selectedMos.length - 1].code) {
      return;
    }
    const newRow: ISelectedMicroorganism = {
      id: uuidv4(),
      code: "",
      name: "",
    };
    setSelectedMos([...selectedMos, newRow]);
  };

  const handleSelectChange = (id: string, option: IMicroorganism | undefined): void => {
    if (!option) {
      return;
    }
    const updatedMos = selectedMos.map((mo) => {
      if (mo.id === id) {
        return { ...mo, code: option.code, name: option.name };
      } else return mo;
    });
    setSelectedMos(updatedMos);
  };

  const handleRemoveMo = (id: string): void => {
    const updatedMos = selectedMos.filter((mo) => mo.id !== id);
    if (updatedMos.length > 0) {
      setSelectedMos(updatedMos);
    } else {
      setSelectedMos([{ id: uuidv4(), code: "", name: "" }]);
      dispatch(setAntibiogramMos([]));
    }
  };

  const handleClearSelect = (id: string): void => {
    const updatedMos = selectedMos.map((mo) => {
      if (mo.id === id) {
        return { ...mo, code: "", name: "" };
      } else return mo;
    });
    setSelectedMos(updatedMos);
  };

  return (
    <Flex className={styles.formbox}>
      <Title level={3}>Шаг 1. Выберите микроорганизмы</Title>
      <Flex className={styles.moList}>
        {selectedMos.map((mo) => (
          <Flex key={mo.id} className={styles.inputBox}>
            <Select
              placeholder="Выберите микроорганизм"
              optionFilterProp="name"
              fieldNames={{ value: 'code', label: 'name' }}
              options={microorganisms}
              showSearch
              allowClear
              value={mo.code || undefined}
              onChange={(_, option) => handleSelectChange(mo.id, option as IMicroorganism | undefined)}
              onClear={() => handleClearSelect(mo.id)}
              className={styles.select}
            />
            <Tooltip title='Удалить микроорганизм' mouseEnterDelay={0.4}>
              <Button icon={<DeleteOutlined />} onClick={() => handleRemoveMo(mo.id)}></Button>
            </Tooltip>
          </Flex>
        ))}
      </Flex>
      <Button type="primary" icon={<PlusSquareOutlined />} onClick={addRow}>
        Добавить микроорганизм
      </Button>
    </Flex>
  );
};
