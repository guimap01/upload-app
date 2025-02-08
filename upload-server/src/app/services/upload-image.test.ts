import { randomUUID } from 'node:crypto'
import { Readable } from 'node:stream'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { eq } from 'drizzle-orm'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { InvalidFileFormat } from '../errors/invalid-file-format'
import { uploadImage } from './upload-image'

describe('Upload image', () => {
  beforeAll(() => {
    vi.mock('@/infra/storage/upload-file-to-storage', () => ({
      uploadFileToStorage: vi.fn().mockReturnValue({
        key: `${randomUUID()}.jpg`,
        url: 'https://storage.com/image.jpg',
      }),
    }))
  })
  it('should be able to upload an image', async () => {
    const fileName = `${randomUUID()}.jpg`
    const result = await uploadImage({
      fileName,
      contentType: 'image/jpg',
      contentStream: Readable.from([]),
    })

    expect(isRight(result)).toBeTruthy()

    const dbResult = await db
      .select()
      .from(schema.uploads)
      .where(eq(schema.uploads.name, fileName))

    expect(dbResult).toHaveLength(1)
  })
  it('should not be able to upload an invalid file', async () => {
    const fileName = `${randomUUID()}.pdf`
    const result = await uploadImage({
      fileName,
      contentType: 'document/pdf',
      contentStream: Readable.from([]),
    })

    expect(isLeft(result)).toBeTruthy()
    expect(unwrapEither(result)).toBeInstanceOf(InvalidFileFormat)
  })
})
