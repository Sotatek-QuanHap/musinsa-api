import { Module } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from './sql.config';

@Module({
  imports: [],
  providers: [
    {
      provide: DataSource,
      useFactory: async () => {
        try {
          const dataSource = new DataSource(config as DataSourceOptions);
          await dataSource.initialize();
          console.log('SQL database connected successfully.');
          return dataSource;
        } catch (error) {
          console.log('Error connecting to sql database.');
          throw error;
        }
      },
    },
  ],
  exports: [DataSource],
})
export class SqlModule {}
