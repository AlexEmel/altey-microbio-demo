import { Flex } from "antd";
import Title from "antd/es/typography/Title";
import { ReactNode } from "react";
import styles from "./AppHeader.module.scss";
import logoSvg from "/logo-white.svg";
import { Link } from "react-router-dom";

export const AppHeader = (): ReactNode => {
  return (
    <Flex className={styles.appheader}>
      <Flex className={styles.titleBox}>
        <Link to={"https://altey.ru"}>
          <img src={logoSvg} className={styles.logo} />
        </Link>
        <Title className={styles.title} level={2}>
          Веб-антибиотикограмма
        </Title>
      </Flex>
      <Flex>
        <a href="https://www.altey.ru/" className={styles.link}>
          На основной сайт
        </a>
      </Flex>
    </Flex>
  );
};
