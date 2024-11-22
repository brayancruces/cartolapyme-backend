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

    // Habilitar CORS para todos los orígenes
    app.enableCors({
      origin: '*', // Permite todos los orígenes
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'], // Ajusta los encabezados permitidos
      credentials: true, // Si necesitas compartir cookies o credenciales
    });
  

  
  await app.listen(process.env.PORT ?? 3000);

  
}
bootstrap();
