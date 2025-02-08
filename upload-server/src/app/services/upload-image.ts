import { Readable } from 'node:stream'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { makeLeft, makeRight } from '@/shared/either'
import type { Either } from '@/shared/either'

import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage'
import { z } from 'zod'
import { InvalidFileFormat } from '../errors/invalid-file-format'

const uploaImageInput = z.object({
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
})

type UploadImageInput = z.input<typeof uploaImageInput>

const allowedMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp']

export async function uploadImage(
  input: UploadImageInput
): Promise<Either<InvalidFileFormat, { url: string }>> {
  const { contentStream, contentType, fileName } = uploaImageInput.parse(input)

  if (!allowedMimeTypes.includes(contentType)) {
    return makeLeft(new InvalidFileFormat())
  }

  const { key, url } = await uploadFileToStorage({
    fileName,
    contentStream,
    contentType,
    folder: 'images',
  })

  await db.insert(schema.uploads).values({
    name: fileName,
    remoteKey: key,
    remoteUrl: url,
  })

  return makeRight({ url })
}
