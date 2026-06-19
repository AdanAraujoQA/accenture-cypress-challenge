Feature: Book Reservation Management

  Background: 
    The book management system is online

  Scenario: 1 - Successful end-to-end book rental journey
    Given a new user account is created and authorized
    When the user requests the available books and rents two of them
    Then the user profile should correctly display both rented books
