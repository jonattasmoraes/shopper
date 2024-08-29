import { Measure } from './measure'

export interface IMeasureRepository {
  save(measure: Measure): Promise<void>
}
