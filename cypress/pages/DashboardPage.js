class DashboardPage {
  get title()      { return cy.get('[data-cy=dashboard-title]') }
  get navMenu()    { return cy.get('[data-cy=nav-menu]') }
  get logoutBtn()  { return cy.get('[data-cy=logout]') }
  get userAvatar() { return cy.get('[data-cy=user-avatar]') }

  visit() {
    cy.visit('/dashboard')
  }

  shouldBeVisible() {
    this.title.should('be.visible')
  }

  logout() {
    this.logoutBtn.click()
  }

  navigateTo(section) {
    this.navMenu.contains(section).click()
  }
}

module.exports = new DashboardPage()
