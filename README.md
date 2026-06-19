Accenture Technical Assessment - Automation Framework
This repository contains the automation engineering solution developed for the technical assessment on the DemoQA platform, covering both API contract validations and End-to-End frontend user journeys. The project is structured using Cypress for core automation execution and the Cucumber preprocessor to maintain behavior-driven development (BDD) alignment through Gherkin specifications.

Project Structure
The automation suite isolates the execution scripts within dedicated modules inside the step definitions directory, mapping features and JavaScript implementations as follows:

Plaintext
cypress/
├── e2e/
│   └── step_definitions/
│       ├── desafioApi/
│       │   └── [API automation step scripts]
│       ├── desafioFrontEnd/
│       │   ├── desafioFront_Form.js
│       │   ├── desafioFront_Progress.js
│       │   ├── desafioFront_Tables.js
│       │   └── desafioFront_Windows.js
│       ├── desafioApi_1.feature
│       ├── desafioFront_Form.feature
│       ├── desafioFront_Progress.feature
│       ├── desafioFront_Tables.feature
│       └── desafioFront_Windows.feature
├── fixtures/
├── support/
└── cypress.config.js
Automated Challenges and Execution Scope
API Validation (desafioApi_1.feature): Directly asserts backend contract integrity, processing payload schemas, response structures, and HTTP status codes via native integration using cy.request.

Practice Form (desafioFront_Form.feature): Handles diverse DOM elements including dynamic dropdown selections, OS-level file attachments, radio button states, and date inputs. Data isolation is achieved by integrating @faker-js/faker to generate randomized, localized personas dynamically on each execution loop, eliminating hardcoded state pollution.

Dynamic Web Tables (desafioFront_Tables.feature): Implements a data grid automation scenario where 12 dynamic records are programmatically populated. The script dynamically tracks the trailing index to execute target mutations and utilizes partial string-matching wildcard selectors (span[id^="delete-record-"]) to purge the dynamic rows efficiently during the teardown phase.

Progress Bar Lifecycle (desafioFront_Progress.feature): Handles complex asynchronous animation frames. The script captures state changes to halt execution precisely within a threshold under 25%, resumes execution natively until the 100% threshold is met, and validates the UI state reset sequence back to 0%.

Alerts, Frames, and Windows (desafioFront_Windows.feature): Addresses non-standard window orchestration. Manages multi-tab routing through DOM manipulation by overriding target attributes, controls browser-level alert dialogs, and shifts execution context across sandbox iFrames.

Engineering Decisions and Resilience
The DemoQA target application features heavy third-party tracking scripts that frequently trigger unhandled exceptions unrelated to the core functionalities under test. To prevent these runtime scripts from crashing the execution pipelines, the framework actively suppresses uncaught exceptions globally:

JavaScript
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});
Furthermore, timing constraints and race conditions inherent to UI animations were solved deterministically by leveraging Cypress's built-in retry-ability mechanism through conditional assertions (.should()), completely deprecating the anti-pattern of hardcoded static pauses (cy.wait).

Architectural Limitations and Future Improvements
Due to the limited time available for the execution and delivery of this challenge, the Page Object Model (POM) design pattern was not implemented in this iteration. The step definitions directly manage element interaction layers. For an enterprise-scale architecture or long-term maintenance strategy, refactoring the codebase to abstract selectors and UI behaviors into dedicated Page Objects or adopting App Actions would be the immediate next step to maximize test script reusability and clean separation of concerns.

Environment Setup and Execution
Clone the repository and install the required node dependencies:

Bash
git clone <repository-url>
npm install
To launch the interactive test runner UI:

Bash
npx cypress open
To execute the entire suite in headless mode for pipeline integration:

Bash
npx cypress run --browser chrome
