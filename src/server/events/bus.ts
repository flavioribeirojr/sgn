import EventEmitter from 'events'
import * as schema from './schema'

const emitter = new EventEmitter({
  captureRejections: true,
})

type SchemaKeys = keyof typeof schema
type Event = ReturnType<typeof schema[SchemaKeys]>

export const EventBus = {
  fire: (event: Event) =>
    emitter.emit(event.eventName, event.payload),

  addListener: (eventName: Event['eventName'], listener: (payload: Event['payload']) => Promise<void>) => {
    emitter.on(eventName, listener)
  }
}