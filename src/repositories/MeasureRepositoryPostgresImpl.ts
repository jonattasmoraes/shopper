import { Pool } from 'pg'
import { IMeasureRepository } from '../domain/IMeasureRepository'
import { Measure } from '../domain/Measure'
import { SendError } from '../common/errors/SendError'

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

      if (result.rows.length === 0) {
        throw new SendError(404, 'Leitura do mês já realizada', 'NOT_FOUND')
      }

      const {
        measure_uuid,
        customer_code,
        measure_datetime,
        measure_type,
        image_url,
        measure_value,
        has_confirmed,
      } = result.rows[0]

      const measure = new Measure({
        measureUuid: measure_uuid,
        customerCode: customer_code,
        measureDatetime: measure_datetime,
        measureType: measure_type,
        imageUrl: image_url,
        measureValue: measure_value,
        hasConfirmed: has_confirmed,
      })

      return measure
    } catch (error) {
      console.error('Error finding measure by UUID: ', error)
      throw new SendError(500, 'Internal Server Error', 'INTERNAL_SERVER_ERROR')
    }
  }
}
