import { setAntibiogramMos } from "@/features/microbio.slice";
import { IMicroorganism } from "@/interfaces/entities.interface";
import { ISelectOptions } from "@/interfaces/utils.interface";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { DeleteOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Button, Flex, Select } from "antd";
import Title from "antd/es/typography/Title";
import { ReactNode, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from './AddMicroorganismForm.module.scss';

export const AddMicroorganismForm = (): ReactNode => {
  const [selectedMos, setSelectedMos] = useState<IMicroorganism[]>([{ _id: uuidv4(), code: "", name: "" }]);
  const { microorganisms } = useAppSelector((store) => store.microbio.dictionaries);
  const [selectOptions, setSelectOptions] = useState<ISelectOptions[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const options: ISelectOptions[] = microorganisms.map((mo) => {
      return {
        value: mo.code,
        label: mo.name,
      };
    });
    setSelectOptions(options);
  }, [microorganisms]);

  useEffect(() => {
    if (selectedMos.length === 1 && !selectedMos[0].code) {
      return;
    } else {
      dispatch(setAntibiogramMos(selectedMos));
    }
  }, [selectedMos, dispatch]);

  const addRow = (): void => {
    if (!selectedMos[selectedMos.length - 1].code) {
      return;
    }
    const newRow: IMicroorganism = {
      _id: uuidv4(),
      code: "",
      name: "",
    };
    setSelectedMos([...selectedMos, newRow]);
  };

  const handleSelectChange = (id: string, option: ISelectOptions): void => {
    const updatedMos = selectedMos.map((mo) => {
      if (mo._id === id) {
        return { ...mo, code: option.value, name: option.label };
      } else return mo;
    });
    setSelectedMos(updatedMos);
  };

  const handleRemoveMo = (id: string): void => {
    const updatedMos = selectedMos.filter((mo) => mo._id !== id);
    if (updatedMos.length > 0) {
      setSelectedMos(updatedMos);
    } else {
      setSelectedMos([{ _id: uuidv4(), code: "", name: "" }]);
    }
  };

  return (
    <Flex className={styles.formbox}>
      <Title level={3}>Шаг 1. Выберите микроорганизм</Title>
      {selectedMos.map((mo) => (
        <Flex>
          <Select
            placeholder="Выберите микроорганизм"
            optionFilterProp="label"
            options={selectOptions}
            showSearch
            allowClear
            value={mo.code}
            onChange={(_, option) => handleSelectChange(mo._id!, option as ISelectOptions)}
            className={styles.select}
          />
          <Button icon={<DeleteOutlined />} onClick={() => handleRemoveMo(mo._id!)}></Button>
        </Flex>
      ))}
      <Button icon={<PlusSquareOutlined />} onClick={addRow}>Добавить микроорганизм</Button>
    </Flex>
  );
};
