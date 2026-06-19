Feature: Browser Windows Interaction

  Scenario: Verify message inside a newly opened browser window
    Given the user navigates to the Browser Windows section via home page
    When they trigger the action to open a new window
    Then the new window should display the sample message and be closed successfully