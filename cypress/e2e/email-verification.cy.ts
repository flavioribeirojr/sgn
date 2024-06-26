import { faker } from '@faker-js/faker'

describe('Email Verification', () => {
  afterEach(() => {
    cy.task('clean_db_and_redis')
  })

  it('must validate code field', () => {
    cy.visit('/auth/email-verification')
    cy.get('input[name="verificationCode"]').click().clear().blur()

    cy.contains('Please provide the verification code')
  })

  it('must show a invalid code message when verification code does not exist', () => {
    cy.visit('/auth/signup')

    cy.get('input[name="name"]').type(faker.person.fullName())
    cy.get('input[name="dateOfBirth"]').type('1990-01-01')
    cy.get('input[name="email"]').type(faker.internet.email())
    cy.get('input[name="password"]').type(faker.internet.password())

    cy.get('form > button').click()

    cy.location('pathname').should('eq', '/auth/email-verification')

    cy.get('input[name="verificationCode"]').type('000')

    cy.get('form > button').click()
    cy.contains('Invalid verification code. Please try again')
  })

  it('must successfully signup with the given code', () => {
    const stub = cy.stub()
    cy.on('window:alert', stub)

    cy.visit('/auth/signup')
    const email = faker.internet.email()

    cy.get('input[name="name"]').type(faker.person.fullName())
    cy.get('input[name="dateOfBirth"]').type('1990-01-01')
    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type(faker.internet.password())

    cy.get('form > button').click()

    cy.location('pathname').should('eq', '/auth/email-verification')

    cy.task<string>('get_email_verification_code', email).then(code => {
      cy.get('input[name="verificationCode"]').type(code)
      cy.get('form > button').click()

      cy.location('pathname').should('eq', '/')
    })
  })
})