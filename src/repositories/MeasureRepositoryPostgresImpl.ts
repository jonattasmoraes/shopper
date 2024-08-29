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

  async findMeasure(measure: Measure): Promise<Measure> {
    const query = `
      SELECT *
      FROM measures
      WHERE customer_code = $1
      AND TO_CHAR(measure_datetime, 'YYYY-MM') = $2
      AND measure_type = $3
    `

    try {
      const result = await this.db.query(query, [
        measure.customerCode,
        measure.measureDatetime,
        measure.measureType,
      ])
      return result.rows[0]
    } catch (error) {
      console.error(
        'Error finding measure by customer code, date and type:',
        error,
      )
      throw new Error('Failed to find measure by customer code and date')
    }
  }

  async findMeasureByUuid(uuid: string): Promise<Measure> {
    try {
      const result = await this.db.query(
        `SELECT * FROM measures
         WHERE measure_uuid = $1`,
        [uuid],
      )

      return result.rows[0]
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
