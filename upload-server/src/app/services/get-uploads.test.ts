import { randomUUID } from 'node:crypto'
import { isRight, unwrapEither } from '@/shared/either'
import { makeUpload } from '@/test/factories/make-upload'
import { describe, expect, it } from 'vitest'
import { getUploads } from './get-uploads'

describe('Get uploads', () => {
  it('should be able to get uploads', async () => {
    const namePattern = randomUUID()
    const createdUploads = []

    // Creates 5 uploads
    for (const i of Array(5)) {
      const result = await makeUpload({ name: `${namePattern}.webp` })
      createdUploads.push(result)
    }

    const result = await getUploads({
      searchQuery: namePattern,
    })

    const { total, uploads } = unwrapEither(result)

    expect(isRight(result)).toBeTruthy()
    expect(total).toBe(5)

    for (let i = 0; i < 5; i++) {
      expect(createdUploads[i]).toStrictEqual(uploads[i])
    }
  })
})
