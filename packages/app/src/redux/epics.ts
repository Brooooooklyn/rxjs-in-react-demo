import { combineEpics } from 'redux-observable'
import { epic as rawEpic } from '@demo/raw'

export const rootEpic = combineEpics(rawEpic)
