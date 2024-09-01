import { Measure } from '../entities/Measure'

export interface IMeasureRepository {
  save(measure: Measure): Promise<void>
  findByData(code: string, type: string, date: Date): Promise<Measure | null>
  findById(id: string): Promise<Measure | null>
  confirm(id: string, confirmedValue: number): Promise<void>
  list(code: string, type?: string): Promise<Measure[] | null>
}
