import { Before, Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { faker } from '@faker-js/faker';

const fakeUser = faker.person.firstName();
const fakepassword = (faker.string.alphanumeric({length:9}) + "@");

let userToken;
let userId;
let Listbook;

Before((scenario) => {
  // Extrai o nome do cenário atual
  const scenarioName = scenario.pickle.name;
  cy.log(`**INICIATING SCENARIO:** ${scenarioName}`);
});

Given('a new user account is created and authorized', function () {
  cy.request('POST', 'https://demoqa.com/Account/v1/User', {
    userName: fakeUser,
    password: fakepassword
  }).then((response) => {
    const responseReq = response;
    // Garante o sucesso e salva o ID para os próximos passos
    cy.log('---  USER DATA CREATED ---');
    cy.log(` **User:** ${fakeUser}`);
    cy.log(` **Password:** ${fakepassword}`);
    cy.log('---------------------------------');
    cy.log('---  VALIDATION ---');
    expect(responseReq.status).to.eq(201);
    cy.log(` **STATUS:** ${responseReq.status}`);
    cy.log('--------------------');
    
    // CORREÇÃO AQUI: Mudado de .userId para .userID
    userId = response.body.userID; 
  });

  cy.pause();

  cy.request('GET', 'https://demoqa.com/Account/v1/User', {
    headers:{
      Username: fakeUser
    }
  });

  cy.log("----------------------------------------");  
  cy.log("GENERATING NEW USER AUTHORIZATION TOKEN");  
  cy.log("----------------------------------------");  

  cy.request('POST', 'https://demoqa.com/Account/v1/GenerateToken', {
    userName: fakeUser,
    password: fakepassword
  }).then((response) => {
    expect(response.body.token).to.not.be.null;
    expect(response.body.result).to.eq("User authorized successfully.");
    expect(response.body.status).to.eq("Success");          

    userToken = response.body.token;
    cy.log(`Token sucessfully generated: ${userToken}`);    
    cy.log("------------------------------------------");    
    cy.log("NEW USER AUTHORIZATION VALIDATION");    

    cy.request({
      method: 'POST',
      url: 'https://demoqa.com/Account/v1/Authorized',
      failOnStatusCode: false, 
      body: {
        userName: fakeUser,
        password: fakepassword
      }
    }).then((authResponse) => {
      console.log(authResponse.headers);
      expect(authResponse.status).to.eq(200);
      expect(authResponse.body).to.be.true; 
    });

    cy.pause();
  });
});

When('the user requests the available books and rents two of them', function () {
  cy.log("LIST AVAIABLE BOOKS");
  cy.request({
    method: 'GET',
    url: 'https://demoqa.com/BookStore/v1/Books',
    failOnStatusCode: false, 
    body: {
      userName: fakeUser,
      password: fakepassword
    }
  }).then((responseBook) => {
    const bookList = responseBook.body.books;
    Listbook = responseBook.body.books; 
    
    bookList.forEach((book, index) => {
        cy.log(`Book [${index + 1}]: ${book.title}`);
        console.log(`Book [${index + 1}]:`, book.title);
    });

    cy.request({
      method: 'POST',
      url: 'https://demoqa.com/BookStore/v1/Books',
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${userToken}` 
      },
      body: {
        userId: userId,
        collectionOfIsbns: [
          { isbn: Listbook[0].isbn },
          { isbn: Listbook[1].isbn }
        ]
      }
    }).then((rentResponse) => {
      expect(rentResponse.status).to.eq(201);
      cy.log("BOOKS RENTED");
    });
  });
});
Then('the user profile should correctly display both rented books', function () {
  cy.log("CHECK USER PROFILE FOR RENTED BOOKS");

  cy.request({
    method: 'GET',
    // Passa o userId dinamicamente na URL usando Template Literals (crases)
    url: `https://demoqa.com/Account/v1/User/${userId}`,
    failOnStatusCode: false,
    headers: {
      Authorization: `Bearer ${userToken}` // Autorização obrigatória
    }
  }).then((responseProfile) => {
    // 1. Valida se a requisição respondeu com sucesso (200 OK)
    expect(responseProfile.status).to.eq(200);

    // 2. Valida se o perfil tem exatamente 2 livros alugados
    expect(responseProfile.body.books).to.have.lengthOf(2);

    // 3. Valida se os ISBNs do perfil são os mesmos que escolhemos alugar
    expect(responseProfile.body.books[0].isbn).to.eq(Listbook[0].isbn);
    expect(responseProfile.body.books[1].isbn).to.eq(Listbook[1].isbn);

    // 4. Printa os detalhes no painel do Cypress para conferência visual
    cy.log('--- PROFILE VERIFIED ---');
    cy.log(`User Profile: ${responseProfile.body.username}`);
    cy.log(`Rented Book 1: ${responseProfile.body.books[0].title}`);
    cy.log(`Rented Book 2: ${responseProfile.body.books[1].title}`);
    cy.log('---------------------------------');
  });
});