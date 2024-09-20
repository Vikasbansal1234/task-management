import { join } from "path";
export default () => ({
    kafka: {
      brokerUrl: process.env.KAFKA_BROKER_URL || 'your-default-broker-url',
      clientId: process.env.KAFKA_CLIENT_ID || 'nestjs-client',
      consumerGroupId: process.env.KAFKA_CONSUMER_GROUP_ID || 'nestjs-consumer-group',
      username: process.env.KAFKA_SASL_USERNAME || 'your-api-key',
      password: process.env.KAFKA_SASL_PASSWORD || 'your-api-secret',
    },
    database: {
      url: process.env.MONGODB_URI,
      type: 'mongodb',
      synchronize: true,
      entities: [join(__dirname, './domains/**/entities/*.entity{.ts,.js}')],
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        password: process.env.REDIS_PASSWORD || '',
        username: process.env.REDIS_USERNAME || '',
        tls: process.env.REDIS_TLS_ENABLED === 'true',
      },
    host:{
      port: parseInt(process.env.HOST_PORT, 10) || 4000,
    },
    appconfig: {
      batch:parseInt(process.env.BATCH_SIZE, 10) || 100
    }
  });
  