import { SetMetadata } from '@nestjs/common';

export const LocationUrlMetadata = 'locator-url';

export const Location = (...args: string[]) =>
  SetMetadata(LocationUrlMetadata, args);
