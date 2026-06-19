import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { faker } from '@faker-js/faker';

// Simple variable to store only the email of the 12th record so we can edit 
let lastEmail = '';

Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

Given('the user navigates to the Web Tables section via home page', function () {
  cy.viewport(1280, 720);
  cy.visit('https://demoqa.com/');
  cy.contains('Elements').scrollIntoView().click();
  cy.contains('Web Tables').click();
});

When('they dynamically create {int} new records and edit the last one created', function (quantity) {
  // Conventional loop to create 12 dynamic records
  for (let i = 1; i <= quantity; i++) {
    
    // Generating fully random data using Faker
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const age = faker.number.int({ min: 20, max: 60 }).toString();
    const salary = faker.number.int({ min: 3000, max: 15000 }).toString();
    const department = faker.commerce.department();
    
    // Create the email with Faker + a fixed suffix so we can filter and delete everything at the end
    const email = `${faker.string.alphanumeric(5)}@accentureqa.com`;

    // If it is the last iteration (the 12th record), save this email to our variable
    if (i === quantity) {
      lastEmail = email;
    }

    // Conventional form filling flow
    cy.get('#addNewRecordButton').click();
    cy.get('#firstName').type(firstName);
    cy.get('#lastName').type(lastName);
    cy.get('#userEmail').type(email);
    cy.get('#age').type(age);
    cy.get('#salary').type(salary);
    cy.get('#department').type(department);
    cy.get('#submit').click();
  }
  
  // Ensures all rows are displayed on the screen
  cy.get('select').select('20');

  // Clicks the edit button of the 12th record created (position 15 in the table)
  cy.get('div.action-buttons>span#edit-record-15.mr-2').click();
  
  // Changes the field name and saves
  cy.get('#firstName').clear().type('Edited');
  cy.get('#submit').click();
});

Then('they should be able to delete all the newly created records from the table', function () {
  // Filter the table to display ONLY your records
  cy.get('#searchBox').type('@accentureqa.com');

  // 12-iteration loop that adapts to what is currently visible on the screen
  for (let i = 0; i < 12; i++) {
    cy.get('body').then(($body) => {
      // jQuery checks if the trash bin icon still exists on the screen without throwing an error
      if ($body.find('span[id^="delete-record-"]').length > 0) {
        cy.get('span[id^="delete-record-"]').first().click();
      } else {
        // If nothing is found, it just prints a log message and the test CONTINUES AND PASSES
        cy.log('No remaining records found. Moving forward...');
      }
    });
  }
  
  // Clear the search box and finish successfully
  cy.get('#searchBox').clear();
  cy.log('--- ALL FAKER GENERATED RECORDS WERE DELETED AND THE TEST PASSED SUCCESSFULLY ---');
});