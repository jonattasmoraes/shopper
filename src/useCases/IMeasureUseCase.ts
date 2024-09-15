import { CreateInputDto, CreateOutputDto, ListMeasuresDto } from './MeasureUseCaseDto'

export interface ICreateUseCase {
  execute(data: CreateInputDto): Promise<CreateOutputDto>
}

export interface IConfirmUseCase {
  execute(id: string, value: number): Promise<void>
}

export interface IListUseCase {
  execute(code: string, type?: string): Promise<ListMeasuresDto | null>
}
