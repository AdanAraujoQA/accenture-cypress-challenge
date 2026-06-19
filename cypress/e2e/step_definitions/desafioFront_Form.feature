Feature: Student Registration Form Submission

  Scenario: Successful student registration with randomized data and file attachment
    Given the user navigates to the Student Registration Form page
    When they submit the form with valid randomized data and an attached text file
    Then a confirmation modal should be displayed and successfully closed