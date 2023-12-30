import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { FeaturesModule } from './features/features.module';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config/config.validation';
import { configuration } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
      load: [configuration],
    }),
    CoreModule,
    FeaturesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
