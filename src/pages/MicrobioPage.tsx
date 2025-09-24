import { AddMicroorganismForm } from "@/components/AddMicroorganismForm/AddMicroorganismForm";
import { AppHeader } from "@/components/Header/AppHeader";
import { ReactNode } from "react";
import styles from "./MicrobioPage.module.scss";
import { Flex } from "antd";

export const MicrobioPage = (): ReactNode => {
  return (<>
  
    <AppHeader />
    <Flex className={styles.container}>
      <AddMicroorganismForm />
    </Flex>
  </>
  );
};
