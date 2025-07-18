describe('Authentication Flow', () => {
  beforeEach(() => {
    // Visit the home page
    cy.visit('/')
  })

  it('should display the home page', () => {
    cy.contains('Welcome to YPO SF Gold Community Platform')
    cy.contains('A centralized hub for YPO SF Gold Chapter members')
  })

  it('should navigate to sign in page', () => {
    cy.contains('Sign In').click()
    cy.url().should('include', '/sign-in')
  })

  it('should display sign in form', () => {
    cy.visit('/sign-in')
    cy.get('[data-testid="sign-in-form"]').should('be.visible')
  })

  it('should navigate to sign up page', () => {
    cy.visit('/sign-up')
    cy.get('[data-testid="sign-up-form"]').should('be.visible')
  })

  it('should redirect to directory after sign in', () => {
    // Mock successful authentication
    cy.window().then((win) => {
      // This would normally be handled by Clerk in a real scenario
      win.localStorage.setItem('clerk-session', 'mock-session-token')
    })
    
    cy.visit('/directory')
    cy.contains('Member Directory')
  })

  it('should protect admin routes', () => {
    // Try to access admin without authentication
    cy.visit('/admin', { failOnStatusCode: false })
    // Should redirect to sign in or show unauthorized message
    cy.url().should('not.include', '/admin')
  })
})

describe('Navigation', () => {
  beforeEach(() => {
    // Mock authentication for protected routes
    cy.window().then((win) => {
      win.localStorage.setItem('clerk-session', 'mock-session-token')
    })
  })

  it('should navigate between main pages', () => {
    // Test navigation to different pages
    const pages = [
      { path: '/', title: 'Welcome to YPO SF Gold Community Platform' },
      { path: '/directory', title: 'Member Directory' },
      { path: '/events', title: 'Events' },
      { path: '/photos', title: 'Photos' },
      { path: '/announcements', title: 'Announcements' },
      { path: '/profile', title: 'Profile' },
    ]

    pages.forEach(({ path, title }) => {
      cy.visit(path)
      cy.contains(title)
    })
  })
}) 