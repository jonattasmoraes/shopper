import { Pool } from 'pg'
import moment from 'moment'
import { IMeasureRepository } from '../../repositories/IMeasureRepository'
import { Measure } from '../../entities/Measure'

export class MeasureRepositoryPostgresImpl implements IMeasureRepository {
  public constructor(readonly db: Pool) {}

  public static build(db: Pool): MeasureRepositoryPostgresImpl {
    return new MeasureRepositoryPostgresImpl(db)
  }

  async save(measure: Measure): Promise<void> {
    try {
      await this.db.query(
        `INSERT INTO measures (
             measure_uuid,
             customer_code,
             measure_datetime,
             measure_type,
             has_confirmed,
             image_url,
             measure_value
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          measure.id,
          measure.customerCode,
          measure.dataTime,
          measure.type,
          measure.hasConfirmed,
          measure.imageUrl,
          measure.value,
        ],
      )
    } catch (error) {
      console.error('Error creating measure: ', error)
      throw Error
    }
  }

  async findByData(
    code: string,
    type: string,
    date: Date,
  ): Promise<Measure | null> {
    const measureMonth = moment(date).format('YYYY-MM')
    const query = `
      SELECT *
      FROM measures
      WHERE customer_code = $1
      AND TO_CHAR(measure_datetime, 'YYYY-MM') = $2
      AND measure_type = $3
    `

    try {
      const { rows } = await this.db.query(query, [code, measureMonth, type])

      if (rows.length === 0) {
        return null
      }

      return rows[0]
    } catch (error) {
      console.error('Error finding measure by customer code and date: ', error)
      throw error
    }
  }

  async findById(id: string): Promise<Measure | null> {
    try {
      const query = `
      SELECT * FROM measures
      WHERE measure_uuid = $1`

      const { rows } = await this.db.query(query, [id])

      if (rows.length === 0) {
        return null
      }

      return rows[0]
    } catch (error: unknown) {
      console.error('Error finding measure by ID: ', error)
      throw error
    }
  }

  async confirm(id: string, confirmedValue: number): Promise<void> {
    try {
      await this.db.query(
        `UPDATE measures
         SET has_confirmed = true,
             measure_value = $1
         WHERE measure_uuid = $2`,
        [confirmedValue, id],
      )
    } catch (error) {
      console.error('Error confirming measure: ', error)
      throw error
    }
  }

  async list(code: string, type?: string): Promise<Measure[]> {
    try {
      const query = `
        SELECT *
        FROM measures
        WHERE customer_code = $1
        ${type ? 'AND measure_type = $2' : ''}
      `

      const params = [code]
      if (type) params.push(type)

      const { rows } = await this.db.query(query, params)

      return rows.map((measure) =>
        Measure.with(
          measure.measure_uuid,
          measure.customer_code,
          measure.measure_datetime,
          measure.measure_type,
          measure.has_confirmed,
          measure.image_url,
          measure.measure_value,
        ),
      )
    } catch (error) {
      console.error('Error retrieving measures:', error)
      throw error
    }
  }
}
