import { setAntibiogramAbx } from "@/features/microbio.slice";
import { ISelectedAntibiotic } from "@/interfaces/entities.interface";
import { ISelectOptions } from "@/interfaces/utils.interface";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Button, Flex, Select } from "antd";
import { FC, ReactNode, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./AddAntibioticForm.module.scss";
import Title from "antd/es/typography/Title";
import { DeleteOutlined, PlusSquareOutlined } from "@ant-design/icons";

interface IAddAntibioticProps {
  moId: string;
}

export const AddAntibioticForm: FC<IAddAntibioticProps> = ({ moId }): ReactNode => {
  const [selectedAbxs, setSelectedAbxs] = useState<ISelectedAntibiotic[]>([
    { id: uuidv4(), moId, code: "", name: "" },
  ]);
  const { antibiotics } = useAppSelector((store) => store.microbio.dictionaries);
  const [selectOptions, setSelectOptions] = useState<ISelectOptions[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const options: ISelectOptions[] = antibiotics.map((abx) => {
      return {
        value: abx.code,
        label: abx.name,
      };
    });
    setSelectOptions(options);
  }, [antibiotics]);

  useEffect(() => {
    if (selectedAbxs.length === 1 && !selectedAbxs[0].code) {
      return;
    } else {
      dispatch(setAntibiogramAbx(selectedAbxs));
    }
  }, [selectedAbxs, dispatch]);

  const addRow = (): void => {
    if (!selectedAbxs[selectedAbxs.length - 1].code) {
      return;
    }
    const newRow: ISelectedAntibiotic = {
      id: uuidv4(),
      moId,
      code: "",
      name: "",
    };
    setSelectedAbxs([...selectedAbxs, newRow]);
  };

  const handleSelectChange = (id: string, option: ISelectOptions | undefined): void => {
    if (!option) {
      return;
    }
    const updatedAbxs = selectedAbxs.map((abx) => {
      if (abx.id === id) {
        return { ...abx, code: option.value, name: option.label };
      } else return abx;
    });
    setSelectedAbxs(updatedAbxs);
  };

  const handleRemoveAbx = (id: string): void => {
    const updatedAbxs = selectedAbxs.filter((abx) => abx.id !== id);
    if (updatedAbxs.length > 0) {
      setSelectedAbxs(updatedAbxs);
    } else {
      setSelectedAbxs([{ id: uuidv4(), moId, code: "", name: "" }]);
      dispatch(setAntibiogramAbx([]));
    }
  };

  return (
    <Flex className={styles.formbox}>
      <Title level={3}>Шаг 2. Выберите антибиотики и введите значения для рассчета чувствительности</Title>
      {selectedAbxs.map((abx) => (
        <Flex key={abx.id}>
          <Select
            placeholder="Выберите антибиотик"
            optionFilterProp="label"
            options={selectOptions}
            showSearch
            value={abx.code}
            onChange={(_, option) => handleSelectChange(abx.id, option as ISelectOptions | undefined)}
            className={styles.select}
          />
          <Button icon={<DeleteOutlined />} onClick={() => handleRemoveAbx(abx.id)}></Button>
        </Flex>
      ))}
      <Button icon={<PlusSquareOutlined />} onClick={addRow}>
        Добавить антибиотик
      </Button>
    </Flex>
  );
};
