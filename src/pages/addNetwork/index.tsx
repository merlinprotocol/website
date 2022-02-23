import { Typography, Space } from 'antd';

const { Text, Link, Title } = Typography;

export default () => {
  return (
    <Space direction="vertical">
      <Title level={2}>
        Network name: <Text copyable>Test Network</Text>
      </Title>

      <Title level={2}>
        RPC URL: <Text copyable>http://8.210.141.80/rpc</Text>
      </Title>

      <Title level={2}>
        Chain ID: <Text copyable>31337</Text>
      </Title>

      <Title level={2}>
        Currency Symbol: <Text copyable>ETH</Text>
      </Title>
    </Space>
  );
};
