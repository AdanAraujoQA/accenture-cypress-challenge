import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// Ignora exceções não tratadas oriundas dos scripts de anúncios do DemoQA
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

Given('the user navigates to the Browser Windows section via home page', function () {
  cy.viewport(1280, 720);
  
  // 1. Acessa o site principal
  cy.visit('https://demoqa.com/');
  
  // 2. Escolhe a opção Alerts, Frame & Windows na página inicial (com scroll se necessário)
  cy.contains('.card', 'Alerts, Frame & Windows').scrollIntoView().click();
  
  // 3. Clica no submenu Browser Windows no menu lateral
  cy.get('.menu-list').contains('Browser Windows').click();
});

When('they trigger the action to open a new window', function () {
  // TRUQUE DE MESTRE: Intercepta o comando window.open e redireciona para a aba atual
  cy.window().then((win) => {
    cy.stub(win, 'open').callsFake((url) => {
      return win.location.assign(url); 
    }).as('windowOpen');
  });

  // Clica no botão "New Window" do desafio
  cy.get('#windowButton').click();
});

Then('the new window should display the sample message and be closed successfully', function () {
  // 1. Valida se o stub de abertura de janela foi acionado
  cy.get('@windowOpen').should('be.called');

  // 2. Valida a mensagem exata exigida pelo desafio ("This is a sample page")
  cy.get('#sampleHeading')
    .should('be.visible')
    .and('have.text', 'This is a sample page');

  cy.log('--- MESSAGE VERIFIED INSIDE THE WINDOW ---');

  // 3. Simula o ato de "Fechar a nova janela aberta", voltando à página anterior do histórico
  cy.go('back');

  // Garante que voltou para a tela de controle inicial
  cy.get('#windowButton').should('be.visible');
});