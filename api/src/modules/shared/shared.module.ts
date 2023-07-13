import { storageConfig } from '@config/storage';
import { Module } from '@nestjs/common';
import { DayjsDateProvider } from './providers/DateProvider/implementations/dayjs-date.provider';
import DiskStorageProvider from './providers/StorageProvider/implementations/disk-storage.provider';

const providers = {
  disk: DiskStorageProvider,
};

@Module({
  providers: [
    {
      provide: 'StorageProvider',
      useClass: providers[storageConfig.provider],
    },
    {
      provide: 'DateProvider',
      useClass: DayjsDateProvider,
    },
  ],

  exports: ['StorageProvider', 'DateProvider'],
})
export class SharedModule {}
