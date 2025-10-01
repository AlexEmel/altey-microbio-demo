import { microbioApi } from "@/api/index.api";
import { ESusceptibility } from "@/enums/common.enum";
import { setAntibiogramAbxsForMo, setIsLoading } from "@/features/microbio.slice";
import { ISelectedAntibiotic, IZoneReq } from "@/interfaces/entities.interface";
import { ISelectOptions } from "@/interfaces/utils.interface";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getDummyAbx } from "@/utils/mocks.util";
import { DeleteOutlined, InfoCircleOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Button, Flex, Input, InputNumber, Select, Tooltip } from "antd";
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
  const [filteredOpts, setFilteredOpts] = useState<ISelectOptions[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const options: ISelectOptions[] = antibiotics.map((abx) => {
      return {
        value: abx.code,
        label: abx.name,
      };
    });
    setSelectOptions(options);
    setFilteredOpts(options);
  }, [antibiotics]);

  useEffect(() => {
    if (selectedAbxs.length === 1 && !selectedAbxs[0].code) {
      return;
    } else {
      dispatch(setAntibiogramAbxsForMo({ moId, abxs: selectedAbxs }));
    }
    const updatedFilteredOpts = selectOptions.filter(
      (opt) => !selectedAbxs.find((abx) => abx.code === opt.value)
    );
    setFilteredOpts(updatedFilteredOpts);

    return () => {
      dispatch(setAntibiogramAbxsForMo({ moId, abxs: [] }));
    };
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
        if (abx.code && abx.code !== option.value) {
          return { ...abx, code: option.value, name: option.label, zone: null, SIR: "" };
        } else {
          return { ...abx, code: option.value, name: option.label };
        }
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
      dispatch(setIsLoading(true));
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
              return { ...abx, SIR: res.payload?.SIR ? res.payload?.SIR : ESusceptibility.NA };
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
      dispatch(setAntibiogramAbxsForMo({ moId, abxs: [] }));
    }
  };

  const getSirClasses = (value: ESusceptibility | string): string => {
    const classes = [styles.sir];
    switch (value) {
      case ESusceptibility.S:
        classes.push(styles.green);
        break;
      case ESusceptibility.I:
        classes.push(styles.orange);
        break;
      case ESusceptibility.R:
        classes.push(styles.red);
        break;
      case ESusceptibility.ATU:
        classes.push(styles.purple);
        break;
      default:
        break;
    }
    return classes.join(" ");
  };

  return (
    <Flex className={styles.formbox}>
      <Title level={3}>Шаг 2. Внесите результаты определения чувствительности к антибиотикам</Title>
      <Flex className={styles.abxList}>
        <Flex className={styles.inputBox}>
          <div className={styles.abxHeader}>Антибиотик</div>
          {selectedAbxs[0].code && (
            <>
              <div className={styles.zoneHeader}>Значение</div>
              <div className={styles.sirHeader}>SIR</div>
              <div className={styles.btnHeader}></div>
            </>
          )}
        </Flex>
        {selectedAbxs.map((abx) => (
          <Flex key={abx.id} className={styles.inputBox}>
            <Select
              placeholder="Выберите антибиотик"
              optionFilterProp="label"
              options={filteredOpts}
              showSearch
              value={abx.code || undefined}
              onChange={(_, option) => handleSelectAbxChange(abx.id, option as ISelectOptions | undefined)}
              className={styles.select}
            />
            {abx.code && (
              <>
                <InputNumber
                  readOnly={!abx.code}
                  min={0}
                  value={abx.zone}
                  onChange={(value) => handleZoneChange(abx.id, value)}
                  onBlur={() => handleZoneBlur(abx)}
                  disabled={isLoading}
                  className={styles.zone}
                />
                {abx.SIR === ESusceptibility.NA ? (
                  <Flex className={styles.sir}>
                    <Tooltip title="Для выделенного микроорганизма не установлены пограничные значения в соответствии с 'Определение чувствительности микроорганизмов к антимикробным препаратам (Версия 2025-01)'">
                      <InfoCircleOutlined className={styles.infoIcon} />
                    </Tooltip>
                  </Flex>
                ) : (
                  <Input readOnly value={abx.SIR} className={getSirClasses(abx.SIR)} />
                )}
                <Tooltip title="Удалить антибиотик" mouseEnterDelay={0.4}>
                  <Button icon={<DeleteOutlined />} onClick={() => handleRemoveAbx(abx.id)}></Button>
                </Tooltip>
              </>
            )}
          </Flex>
        ))}
      </Flex>
      <Button type="primary" icon={<PlusSquareOutlined />} onClick={addRow}>
        Добавить антибиотик
      </Button>
    </Flex>
  );
};
