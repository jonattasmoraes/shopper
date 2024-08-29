import { Pool } from 'pg'
import { IMeasureRepository } from '../domain/IMeasureRepository'
import { Measure } from '../domain/Measure'

export class MeasureRepositoryPostgresImpl implements IMeasureRepository {
  private db: Pool

  constructor(pool: Pool) {
    this.db = pool
  }

  async save(measure: Measure): Promise<void> {
    try {
      await this.db.query(
        `INSERT INTO measures (measure_uuid, customer_code, measure_datetime, measure_type, has_confirmed, image_url, measure_value)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          measure.measureUuid,
          measure.customerCode,
          measure.measureDatetime,
          measure.measureType,
          measure.hasConfirmed,
          measure.imageUrl,
          measure.measureValue,
        ],
      )
    } catch (error) {
      console.error('Error creating measure:', error)
      throw new Error('Failed to create measure')
    }
  }
}
