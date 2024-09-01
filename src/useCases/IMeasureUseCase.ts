import { CreateInputDto, CreateOutputDto, ListMeasuresDto } from './MeasureUseCaseDto'

export interface IMeasureUseCase {
  create(data: CreateInputDto): Promise<CreateOutputDto>
  confirm(id: string, value: number): Promise<void>
  list(code: string, type?: string): Promise<ListMeasuresDto[] | null>
}
