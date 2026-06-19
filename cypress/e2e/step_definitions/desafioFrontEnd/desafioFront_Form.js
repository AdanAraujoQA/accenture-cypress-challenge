import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { faker } from '@faker-js/faker';

// Ignora erros não tratados do DemoQA (anúncios quebrados) para o teste não falhar à toa
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

Given('the user navigates to the Student Registration Form page', function () {
  // Configura a resolução para garantir que os elementos fiquem visíveis na tela
  cy.viewport(1280, 720);
  cy.visit('https://demoqa.com/automation-practice-form');
});

When('they submit the form with valid randomized data and an attached text file', function () {
  // Massa de dados dinâmica usando o Faker
  const student = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    mobile: faker.string.numeric(10), 
    address: faker.location.streetAddress()
  };

  // Preenchimento dos campos de texto comuns
  cy.get('#firstName').type(student.firstName);
  cy.get('#lastName').type(student.lastName);
  cy.get('#userEmail').type(student.email);

  // Gênero: No DemoQA o input original tem 'display:none'. Clicamos no Label correspondente.
  cy.get('label[for="gender-radio-1"]').click();

  cy.get('#userNumber').type(student.mobile);

  // Hobbies: Mesma regra do label por conta do CSS do DemoQA
  cy.get('label[for="hobbies-checkbox-1"]').click();

  // UPLOAD DO ARQUIVO VIRTUAL (Evita precisar comitar um arquivo físico de fixture)
  cy.get('#uploadPicture').selectFile({
    contents: Cypress.Buffer.from('Conteúdo do desafio técnico de automação.'),
    fileName: 'documento_desafio.txt',
    mimeType: 'text/plain'
  });

  cy.get('#currentAddress').type(student.address);
  cy.get('input.subjects-auto-complete__input')
  .type('Maths{enter}') 
  cy.get('#state').click().find('input').type('NCR{enter}', { force: true });
  cy.get('#city').click().find('input').type('Delhi{enter}', { force: true });
  // Submete o formulário. O {force: true} previne que anúncios fiquem na frente do botão
  cy.get('#submit').click({ force: true });
});

Then('a confirmation modal should be displayed and successfully closed', function () {
  // 1. Valida se a modal de sucesso apareceu na tela
  cy.get('.modal-footer').should('be.visible');
  cy.get('#example-modal-sizes-title-lg').should('have.text', 'Thanks for submitting the form');

  cy.log('--- FORM SUBMITTED SUCCESSFULLY ---');

  // 2. Fecha a modal clicando no botão Close
  cy.get('#closeLargeModal').type('{esc}');

  // 3. Garante que a modal sumiu por completo da interface
  cy.pause()
});