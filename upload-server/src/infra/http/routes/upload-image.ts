import { InvalidFileFormat } from '@/app/errors/invalid-file-format'
import { uploadImage } from '@/app/services/upload-image'
import { isRight, unwrapEither } from '@/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const uploadImageRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/uploads',
    {
      schema: {
        summary: 'Upload an image',
        consumes: ['multipart/form-data'],
        response: {
          201: z.null().describe('Image uploaded'),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const uploadedFile = await request.file({
        limits: {
          fileSize: 1024 * 1024 * 2, //2mb
        },
      })
      if (!uploadedFile) {
        return reply.status(400).send({
          message: 'File is required',
        })
      }

      const result = await uploadImage({
        fileName: uploadedFile.fieldname,
        contentStream: uploadedFile.file,
        contentType: uploadedFile.mimetype,
      })

      if (uploadedFile.file.truncated) {
        return reply.status(400).send({
          message: 'File size limit reached',
        })
      }

      if (isRight(result)) {
        return reply.status(201).send()
      }

      const error = unwrapEither(result)

      if (error instanceof InvalidFileFormat) {
        return reply.status(400).send({ message: error.message })
      }
    }
  )
}
