import { AddMicroorganismForm } from "@/components/AddMicroorganismForm/AddMicroorganismForm";
import { AppHeader } from "@/components/Header/AppHeader";
import { ReactNode } from "react";
import styles from "./MicrobioPage.module.scss";
import { Flex, Spin } from "antd";
import { MicroorganismTabs } from "@/components/MicroorganismTabs/MicroorganismTabs";
import { Evaluation } from "@/components/Evaluation/Evaluation";
import { useAppSelector } from "@/store/store";

export const MicrobioPage = (): ReactNode => {
  const { selectedMos, selectedAbxs } = useAppSelector((store) => store.microbio.antibiogram);
  const { isPreLoading } = useAppSelector((store) => store.microbio);

  const isReadyForEvaluation = (): boolean => {
    return selectedAbxs.some((abx) => abx.SIR);
  };

  return (
    <>
      <AppHeader />
      {isPreLoading ? (
        <Spin fullscreen />
      ) : (
        <Flex className={styles.container}>
          <AddMicroorganismForm />
          {selectedMos.length > 0 && <MicroorganismTabs />}
          {isReadyForEvaluation() && <Evaluation />}
        </Flex>
      )}
    </>
  );
};
