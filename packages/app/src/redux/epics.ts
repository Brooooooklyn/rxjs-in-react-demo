import { combineEpics } from 'redux-observable'
import { combineModuleEpics } from 'redux-epics-decorator'
import { epic as rawEpic } from '@demo/raw'
import { DecoratorModule } from '@demo/decorator'

export const rootEpic = combineEpics(
  rawEpic,
  combineModuleEpics(DecoratorModule)
)
