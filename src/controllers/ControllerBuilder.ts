import { db } from '../config/Postgres'
import { MeasureRepositoryPostgresImpl } from '../repositories/postgres/MeasureRepositoryPostgresImpl'
import { CreateMeasureUseCase } from '../useCases/implementation/CreateMeasureUseCase'
import { ListMeasuresUseCase } from '../useCases/implementation/ListMeasuresUseCase'
import { PatchMeasureUseCase } from '../useCases/implementation/PatchMeasureUseCase'
import { CreateMeasureController } from './CreateMeasureController'
import { ListMeasuresController } from './ListMeasuresController'
import { ConfirmMeasureController } from './PatchMeasureController'

export const createMeasureBuilder = () => {
  const repository = MeasureRepositoryPostgresImpl.build(db)
  const useCase = CreateMeasureUseCase.build(repository)
  const controller = CreateMeasureController.build(useCase)
  return controller
}

export const confirmMeasureBuilder = () => {
  const repository = MeasureRepositoryPostgresImpl.build(db)
  const useCase = PatchMeasureUseCase.build(repository)
  const controller = ConfirmMeasureController.build(useCase)
  return controller
}

export const listMeasureBuilder = () => {
  const repository = MeasureRepositoryPostgresImpl.build(db)
  const useCase = ListMeasuresUseCase.build(repository)
  const controller = ListMeasuresController.build(useCase)
  return controller
}
