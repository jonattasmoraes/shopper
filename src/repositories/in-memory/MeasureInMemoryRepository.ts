import { IMeasureRepository } from '../../repositories/IMeasureRepository'
import { Measure } from '../../entities/Measure'

interface MeasureData {
  id: string
  customerCode: string
  dataTime: Date
  type: string
  imageUrl: string
  value: number
  hasConfirmed: boolean
}

export class InMemoryMeasureRepository implements IMeasureRepository {
  private measures: Map<string, MeasureData> = new Map()

  public static build(): InMemoryMeasureRepository {
    return new InMemoryMeasureRepository()
  }

  async save(measure: Measure): Promise<void> {
    this.measures.set(measure.id, {
      id: measure.id,
      customerCode: measure.customerCode,
      dataTime: measure.dataTime,
      type: measure.type,
      imageUrl: measure.imageUrl,
      value: measure.value,
      hasConfirmed: measure.hasConfirmed,
    })
  }

  async findByData(code: string, type: string, date: Date): Promise<Measure | null> {
    const measureMonth = formatDateToMonthYear(date)
    const measure = Array.from(this.measures.values()).find((m) =>
      isMeasureMatch(m, code, type, measureMonth),
    )

    if (!measure) return null

    return Measure.with(
      measure.id,
      measure.customerCode,
      measure.type,
      measure.dataTime,
      measure.imageUrl,
      measure.value,
      measure.hasConfirmed,
    )
  }

  async findById(id: string): Promise<Measure | null> {
    const measure = this.measures.get(id)
    if (!measure) return null

    return Measure.with(
      measure.id,
      measure.customerCode,
      measure.type,
      measure.dataTime,
      measure.imageUrl,
      measure.value,
      measure.hasConfirmed,
    )
  }

  async confirm(id: string, confirmedValue: number): Promise<void> {
    const measure = this.measures.get(id)
    if (!measure) throw new Error()

    this.measures.set(id, {
      ...measure,
      hasConfirmed: true,
      value: confirmedValue,
    })
  }

  async list(code: string, type?: string): Promise<Measure[]> {
    const measures = Array.from(this.measures.values()).filter(
      (m) => m.customerCode === code && (type ? m.type === type : true),
    )

    return measures.map((measure) =>
      Measure.with(
        measure.id,
        measure.customerCode,
        measure.type,
        measure.dataTime,
        measure.imageUrl,
        measure.value,
        measure.hasConfirmed,
      ),
    )
  }
}

const formatDateToMonthYear = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

const isMeasureMatch = (
  measure: MeasureData,
  code: string,
  type: string,
  measureMonth: string,
): boolean => {
  const measureMonthYear = formatDateToMonthYear(measure.dataTime)
  return measure.customerCode === code && measureMonthYear === measureMonth && measure.type === type
}
