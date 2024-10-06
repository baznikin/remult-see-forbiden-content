import { Identification } from './Identification'
import { Specimen } from './Specimen'
import { Task, TasksController } from './Task'
import { Taxa } from './Taxa'

export { Identification, Specimen, Taxa, Task, TasksController }

export const entities = [Identification, Task, Taxa, Specimen]
export const controllers = [TasksController]
