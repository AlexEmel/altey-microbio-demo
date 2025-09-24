import { Flex } from "antd";
import { ReactNode } from "react";
import styles from "./AppHeader.module.scss";
import logoSvg from "/logo.svg";

export const AppHeader = (): ReactNode => {
  return (
    <Flex className={styles.appheader}>
      <img src={logoSvg}></img>
    </Flex>
  );
};
