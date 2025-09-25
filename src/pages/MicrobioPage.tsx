import { AddMicroorganismForm } from "@/components/AddMicroorganismForm/AddMicroorganismForm";
import { AppHeader } from "@/components/Header/AppHeader";
import { ReactNode } from "react";
import styles from "./MicrobioPage.module.scss";
import { Flex } from "antd";
import { MicroorganismTabs } from "@/components/MicroorganismTabs/MicroorganismTabs";
import { Evaluation } from "@/components/Evaluation/Evaluation";

export const MicrobioPage = (): ReactNode => {
  return (<>
  
    <AppHeader />
    <Flex className={styles.container}>
      <AddMicroorganismForm />
      <MicroorganismTabs />
      <Evaluation />
    </Flex>
  </>
  );
};
