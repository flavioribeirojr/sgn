import { faker } from '@faker-js/faker'
import { setupClerkTestingToken } from '@clerk/testing/cypress'

describe('UserSignup', () => {
  afterEach(() => {
    cy.task('clean_db')
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
    setupClerkTestingToken()

    const email = `${faker.string.uuid()}+clerk_test@example.com`
    cy.visit('/auth/signup')

    cy.get('input[name="name"]').type(faker.person.fullName())
    cy.get('input[name="dateOfBirth"]').type('1990-01-01')
    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type(faker.internet.password())

    cy.get('form > button').click()

    cy.get('h2').should('contain', 'verify your email')
  })

  it('must validate code field', () => {
    cy.session('invalid_code_field', () => {
      setupClerkTestingToken()

      cy.visit('/auth/signup')
      const email = `${faker.string.uuid()}+clerk_test@example.com`

      cy.get('input[name="name"]').type(faker.person.fullName())
      cy.get('input[name="dateOfBirth"]').type('1990-01-01')
      cy.get('input[name="email"]').type(email)
      cy.get('input[name="password"]').type(faker.internet.password())

      cy.get('form > button').click()

      cy.get('h2').should('contain', 'verify your email')

      cy.get('input[name="verificationCode"]').click().clear().blur()

      cy.contains('Please provide the verification code')
    })
  })

  it('must show a invalid code message when verification code does not exist', () => {
    cy.session('invalid_code', () => {
      setupClerkTestingToken()
      cy.visit('/auth/signup')
      const email = `${faker.string.uuid()}+clerk_test@example.com`

      cy.get('input[name="name"]').type(faker.person.fullName())
      cy.get('input[name="dateOfBirth"]').type('1990-01-01')
      cy.get('input[name="email"]').type(email)
      cy.get('input[name="password"]').type(faker.internet.password())

      cy.get('form > button').click()

      cy.get('h2').should('contain', 'verify your email')

      cy.get('input[name="verificationCode"]').click().clear().blur()

      cy.contains('Please provide the verification code')

      cy.get('input[name="verificationCode"]').type('0000')

      cy.get('form > button').click()
      cy.contains('Incorrect code provided')
    })
  })

  it('must successfully signup with the given code', () => {
    cy.session('success_signup', () => {
      setupClerkTestingToken()
      const stub = cy.stub()
      cy.on('window:alert', stub)

      cy.visit('/auth/signup')
      const email = `${faker.string.uuid()}+clerk_test@example.com`

      cy.get('input[name="name"]').type(faker.person.fullName())
      cy.get('input[name="dateOfBirth"]').type('1990-01-01')
      cy.get('input[name="email"]').type(email)
      cy.get('input[name="password"]').type(faker.internet.password())

      cy.get('form > button').click()

      cy.get('h2').should('contain', 'verify your email')
      cy.get('input[name="verificationCode"]').type('424242')
      cy.get('form > button').click()

      cy.location('pathname').should('eq', '/')

      cy.task('delete_clerk_user_by_email', email)
    })
  })
})