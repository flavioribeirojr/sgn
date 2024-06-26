import { EventBus } from '../bus'
import { EmailVerificationCreatedListener } from './users/email-verification-created.listener'

function register() {
  EventBus.addListener('users.emailVerificationCreated', EmailVerificationCreatedListener.handle)
}

export const EventListeners = {
  register,
}