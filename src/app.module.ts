import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { FeaturesModule } from './features/features.module';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config/config.validation';
import { configuration } from './config/app.config';
import { IsUniqueConstraint } from './core/validators/is-unique-constraint.validator';
import { authConfig } from './config/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
      load: [configuration, authConfig],
      cache: true,
    }),
    CoreModule,
    FeaturesModule,
  ],
  controllers: [],
  providers: [IsUniqueConstraint],
})
export class AppModule {}
