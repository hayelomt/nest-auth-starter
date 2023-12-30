import { SetMetadata } from '@nestjs/common';
import { AppConstants } from 'src/core';

export const Public = () => SetMetadata(AppConstants.auth.isPublic, true);
