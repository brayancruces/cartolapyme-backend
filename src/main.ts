import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuramos el ValidationPipe para usar las traducciones y mostrar un solo error
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const firstError = errors[0];
        return new BadRequestException(firstError.constraints[Object.keys(firstError.constraints)[0]]);
      },
    }),
  );

  
  await app.listen(process.env.PORT ?? 3000);

  
}
bootstrap();
