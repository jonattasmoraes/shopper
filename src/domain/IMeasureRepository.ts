import { Measure } from './Measure'

export interface IMeasureRepository {
  save(measure: Measure): Promise<void>
  findMeasure(measure: Measure): Promise<Measure>
}
