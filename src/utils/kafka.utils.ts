import { ConfigService } from '@nestjs/config';
import { Kafka, logLevel } from 'kafkajs';
import * as fs from 'fs';

export class KafkaUtil {
  static loadClient(configService: ConfigService) {
    const { KAFKA_USERNAME: username, KAFKA_PASSWORD: password } = process.env;
    const sasl =
      username && password ? { mechanism: 'plain', username, password } : null;
    const ssl = sasl
      ? {
          rejectUnauthorized: false,
          ca: [fs.readFileSync('./ca-certificate.cer', 'utf-8')],
          key: fs.readFileSync('./user-access-key.key', 'utf-8'),
          cert: fs.readFileSync('./user-access-certificate.cer', 'utf-8'),
        }
      : null;
    const options: any = { sasl, ssl };

    console.log({
      logLevel: logLevel.INFO,
      brokers: configService
        .get<string>('app.kafka.brokers', 'localhost:29092', {
          infer: true,
        })
        .split(','),
      clientId: configService.get<string>(
        'app.kafka.client',
        'musinsa-client',
        {
          infer: true,
        },
      ),
      ...options,
      connectionTimeout: 10000,
    });

    return new Kafka({
      logLevel: logLevel.INFO,
      brokers: configService
        .get<string>('app.kafka.brokers', 'localhost:29092', {
          infer: true,
        })
        .split(','),
      clientId: configService.get<string>(
        'app.kafka.client',
        'musinsa-client',
        {
          infer: true,
        },
      ),
      ...options,
      connectionTimeout: 10000,
    });
  }
}
