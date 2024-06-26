export const UserEmailVerificationCreated = ({ email, code, }: { email: string; code: number; }) => Object.freeze({
  eventName: 'users.emailVerificationCreated',
  payload: {
    email,
    code,
  }
})