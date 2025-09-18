import { IMicroorganism } from "@/interfaces/entities.interface";
import { PlusSquareOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";
import Title from "antd/es/typography/Title";
import { ReactNode, useState } from "react";

export const AddMicroorganismForm = (): ReactNode => {
  const [selectedOrganisms, setSelectedOrganisms] = useState<IMicroorganism[]>([]);
  
  return (
    <Flex>
      <Title level={3}>Шаг 1. Выберите микроорганизм</Title>
      <Button icon={<PlusSquareOutlined />}></Button>
    </Flex>
  );
};
