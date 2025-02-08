import fastifyCors from '@fastify/cors'
import fastifyMultipart from '@fastify/multipart'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { exportUploadsRoute } from './routes/export-uploads'
import { getUploadsRoutes } from './routes/get-uploads'
import { uploadImageRoute } from './routes/upload-image'
import { transformSwaggerSchema } from './transform-swagger-schema'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error',
      errors: error.validation,
    })
  }

  // Here we would send the error to an abservability tool (Sentry/Datadog/Grafana ...)

  console.error(error)

  return reply.status(500).send({ message: 'Internal server error' })
})

server.register(fastifyCors, { origin: '*' })

server.register(fastifyMultipart)
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Upload Server',
      version: '1.0.0',
    },
  },
  transform: transformSwaggerSchema,
})
server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

server.register(uploadImageRoute)
server.register(getUploadsRoutes)
server.register(exportUploadsRoute)

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running')
})
