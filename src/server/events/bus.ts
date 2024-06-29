import EventEmitter from 'events'
import * as schema from './schema'
import { logger } from 'logger/logger'

const emitter = new EventEmitter({
  captureRejections: true,
})

type SchemaKeys = keyof typeof schema
type Event = ReturnType<typeof schema[SchemaKeys]>

export const EventBus = {
  fire: (event: Event) =>
    emitter.emit(event.eventName, event.payload),

  addListener: (eventName: Event['eventName'], listener: (payload: Event['payload']) => Promise<void>) => {
    emitter.on(eventName, async function (payload: Event['payload']) {
      try {
        logger.info(`Runing event :: ${eventName}`)
        await listener(payload)
      } catch (err) {
        logger.error(err, `Event error(${ eventName })`)
      }
    })
  }
}