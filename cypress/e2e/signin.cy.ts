import { setupClerkTestingToken } from '@clerk/testing/cypress'

describe('/auth/signin', () => {
  it('must validate all fields', () => {
    cy.visit('/auth/signin')
    const inputs = [
      cy.get('input[name="email"]'),
      cy.get('input[name="password"]'),
    ]

    inputs.forEach(input => {input.click().clear().blur()})

    cy.contains('Please provide an email address')
    cy.contains('Please provide a password')

    const [ emailInput ] = inputs
    emailInput.type('invalid_email').click().blur()

    cy.contains('Must be a valid email address')
  })

  it('must successfully signin', () => {
    cy.session('success_signin', () => {
      setupClerkTestingToken()
      cy.visit('/auth/signin')

      cy.get('input[name="email"]').type(Cypress.env('TEST_ACCOUNT_USER'))
      cy.get('input[name="password"]').type(Cypress.env('TEST_ACCOUNT_PASSWORD'))

      cy.get('form > button').click()

      cy.location('pathname').should('eq', '/')
    })
  })

  it('must show invalid password when given', () => {
    cy.session('incorrect_password', () => {
      setupClerkTestingToken()
      cy.visit('/auth/signin')

      cy.get('input[name="email"]').type(Cypress.env('TEST_ACCOUNT_USER'))
      cy.get('input[name="password"]').type('WRONG_PASSWORD')

      cy.get('form > button').click()

      cy.contains('Incorrect password. Please try again.')
    })
  })
})