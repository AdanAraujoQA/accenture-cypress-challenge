Feature: Web Tables Dynamic Management

  Scenario: Perform CRUD operations and handle bulk record management
    Given the user navigates to the Web Tables section via home page
    When they dynamically create 12 new records and edit the last one created
    Then they should be able to delete all the newly created records from the table