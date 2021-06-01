import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  //app.enableCors();
  // if (process.env.NODE_ENV === 'development') {
  //   app.enableCors();
  // }
  app.enableCors({
    allowedHeaders: "*",
    origin: "*"
  });
  const options = new DocumentBuilder()
    .setTitle("Api application web")
    .setDescription("Documentation api")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api", app, document);

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`Application listening on ${port}`);
}
bootstrap();
//65