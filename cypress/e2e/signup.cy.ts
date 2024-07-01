import { faker } from '@faker-js/faker'

describe('UserSignup', () => {
  afterEach(() => {
    cy.task('clean_db_and_redis')
  })

  it('must work lol', () => {
    cy.visit('/auth/signup')
    cy.get('h2').contains('create your profile')
  })

  it('must correctly validate all fields', () => {
    cy.visit('/auth/signup')
    const inputs = [
      cy.get('input[name="name"]'),
      cy.get('input[name="dateOfBirth"]'),
      cy.get('input[name="email"]'),
      cy.get('input[name="password"]'),
    ]

    inputs.forEach(input => {input.click().clear().blur()})

    cy.contains('Please tell us your name')
    cy.contains('Please inform your date of birth')
    cy.contains('Please provide an email address')
    cy.contains('Please provide a password')

    const emailInput = inputs[2]
    emailInput.type('invalid_email').click().blur()

    cy.contains('Please provide a valid email')
  })

  it('must sucessfully create an email verification when submiting a valid form', () => {
    cy.visit('/auth/signup')

    cy.get('input[name="name"]').type(faker.person.fullName())
    cy.get('input[name="dateOfBirth"]').type('1990-01-01')
    cy.get('input[name="email"]').type(faker.internet.email({ provider: 'tekoa.tech' }))
    cy.get('input[name="password"]').type(faker.internet.password())

    cy.get('form > button').click()

    cy.location('pathname').should('eq', '/auth/email-verification')
  })

  it('must show validation error when email is already being used', () => {
    const email = faker.internet.email({ provider: 'tekoa.tech' })

    cy.visit('/auth/signup')

    cy.get('input[name="name"]').type(faker.person.fullName())
    cy.get('input[name="dateOfBirth"]').type('1990-01-01')
    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type(faker.internet.password())

    cy.get('form > button').click()
    cy.location('pathname').should('eq', '/auth/email-verification')

    cy.visit('/auth/signup')

    cy.get('input[name="name"]').type(faker.person.fullName())
    cy.get('input[name="dateOfBirth"]').type('1990-01-01')
    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type(faker.internet.password())

    cy.get('form > button').click()
    cy.contains('Email is already being used')
  })
})