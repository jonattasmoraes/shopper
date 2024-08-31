import { Pool } from 'pg'

import moment from 'moment'
import { IMeasureRepository } from '../../repositories/IMeasureRepository'
import { Measure } from '../../entities/Measure'
import { SendError } from '../../common/errors/SendError'

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

    const measureMonth = moment(measure.measureDatetime).format('YYYY-MM')

    try {
      const result = await this.db.query(query, [
        measure.customerCode,
        measureMonth,
        measure.measureType,
      ])

      return result.rows[0]
    } catch (error) {
      console.error('Error finding measure by customer code and date:', error)
      throw error
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
        throw new SendError(
          404,
          'Leitura do mês já realizada',
          'MEASURE_NOT_FOUND',
        )
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
    } catch (error: unknown) {
      console.error('Error finding measure by UUID: ', error)
      throw error
    }
  }

  async confirmMeasure(uuid: string, confirmedValue: number): Promise<void> {
    try {
      await this.db.query(
        `UPDATE measures
         SET has_confirmed = true,
             measure_value = $1
         WHERE measure_uuid = $2`,
        [confirmedValue, uuid],
      )
    } catch (error) {
      console.error('Error confirming measure: ', error)
      throw error
    }
  }

  async listMeasures(code: string, type?: string): Promise<Measure[]> {
    try {
      const query = `
        SELECT * FROM measures
        WHERE customer_code = $1
        ${type ? 'AND measure_type = $2' : ''}
      `

      const params = [code]
      if (type) {
        params.push(type)
      }

      const result = await this.db.query(query, params)

      if (result.rows.length === 0) {
        throw new SendError(
          404,
          'Nenhuma leitura encontrada',
          'MEASURES_NOT_FOUND',
        )
      }

      const measures = result.rows.map(
        (row) =>
          new Measure({
            measureUuid: row.measure_uuid,
            customerCode: row.customer_code,
            measureDatetime: row.measure_datetime,
            measureType: row.measure_type,
            imageUrl: row.image_url,
            measureValue: row.measure_value,
            hasConfirmed: row.has_confirmed,
          }),
      )

      return measures
    } catch (error) {
      console.error('Error retrieving measures:', error)
      throw error
    }
  }
}
