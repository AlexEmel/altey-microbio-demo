import { microbioApi } from "@/api/index.api";
import { setAntibiogramAbxs, setIsLoading } from "@/features/microbio.slice";
import { ISelectedAntibiotic, IZoneReq } from "@/interfaces/entities.interface";
import { ISelectOptions } from "@/interfaces/utils.interface";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getDummyAbx } from "@/utils/mocks.util";
import { DeleteOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Button, Flex, Input, InputNumber, Select } from "antd";
import Title from "antd/es/typography/Title";
import { FC, ReactNode, useEffect, useState } from "react";
import styles from "./AddAntibioticForm.module.scss";

interface IAddAntibioticProps {
  moId: string;
}

export const AddAntibioticForm: FC<IAddAntibioticProps> = ({ moId }): ReactNode => {
  const [selectedAbxs, setSelectedAbxs] = useState<ISelectedAntibiotic[]>([getDummyAbx(moId)]);
  const { antibiotics } = useAppSelector((store) => store.microbio.dictionaries);
  const { selectedMos } = useAppSelector((store) => store.microbio.antibiogram);
  const { isLoading } = useAppSelector((store) => store.microbio);
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
      dispatch(setAntibiogramAbxs(selectedAbxs));
    }
  }, [selectedAbxs, dispatch]);

  const addRow = (): void => {
    if (!selectedAbxs[selectedAbxs.length - 1].code) {
      return;
    }
    const newRow = getDummyAbx(moId);
    setSelectedAbxs([...selectedAbxs, newRow]);
  };

  const handleSelectAbxChange = (id: string, option: ISelectOptions | undefined): void => {
    if (!option) {
      return;
    }
    const updatedAbxs = selectedAbxs.map((abx) => {
      if (abx.id === id) {
        return { ...abx, code: option.value, name: option.label };
      } else {
        return abx;
      }
    });
    setSelectedAbxs(updatedAbxs);
  };

  const handleZoneChange = (abxId: string, zone: number | null): void => {
    if (!zone) {
      return;
    }
    const updatedAbxs = selectedAbxs.map((abx) => {
      if (abx.id === abxId) {
        return { ...abx, zone };
      } else {
        return abx;
      }
    });
    setSelectedAbxs(updatedAbxs);
  };

  const handleZoneBlur = async (antibiotic: ISelectedAntibiotic): Promise<void> => {
    try {
      dispatch(setIsLoading(true))
      const targetMo = selectedMos.find((mo) => mo.id === moId);
      if (targetMo && antibiotic.zone) {
        const payload: IZoneReq = {
          microorganismCode: targetMo.code,
          antibioticCode: antibiotic.code,
          zone: antibiotic.zone.toString(),
        };
        const res = await microbioApi.getZone(payload);
        if (res.success && res.payload) {
          const updatedAbxs = selectedAbxs.map((abx) => {
            if (abx.id === antibiotic.id) {
              return { ...abx, SIR: res.payload!.SIR };
            } else {
              return abx;
            }
          });
          setSelectedAbxs(updatedAbxs);
        }
      }
    } catch (error) {
      console.log("Error getting SIR from server");
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleRemoveAbx = (id: string): void => {
    const updatedAbxs = selectedAbxs.filter((abx) => abx.id !== id);
    if (updatedAbxs.length > 0) {
      setSelectedAbxs(updatedAbxs);
    } else {
      setSelectedAbxs([getDummyAbx(moId)]);
      dispatch(setAntibiogramAbxs([]));
    }
  };

  return (
    <Flex className={styles.formbox}>
      <Title level={3}>Шаг 2. Выберите антибиотики и введите значения для расчета чувствительности</Title>
      {selectedAbxs.map((abx) => (
        <Flex key={abx.id} className={styles.inputBox}>
          <Select
            placeholder="Выберите антибиотик"
            optionFilterProp="label"
            options={selectOptions}
            showSearch
            value={abx.code}
            onChange={(_, option) => handleSelectAbxChange(abx.id, option as ISelectOptions | undefined)}
            className={styles.select}
          />
          <InputNumber
            value={abx.zone}
            onChange={(value) => handleZoneChange(abx.id, value)}
            onBlur={() => handleZoneBlur(abx)}
            disabled={isLoading}
          />
          <Input readOnly value={abx.SIR} className={styles.sir} />
          <Button icon={<DeleteOutlined />} onClick={() => handleRemoveAbx(abx.id)}></Button>
        </Flex>
      ))}
      <Button type="primary" icon={<PlusSquareOutlined />} onClick={addRow}>
        Добавить антибиотик
      </Button>
    </Flex>
  );
};
