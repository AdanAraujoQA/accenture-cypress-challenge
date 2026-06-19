# Accenture Technical Assessment - Automation Challenge

This repository contains the complete automation solution for both API and Frontend technical challenges on the DemoQA platform, built using **Cypress** and **Cucumber (BDD)**.

## Tech Stack & Core Libraries

* **Cypress (v12+)** - Main framework for End-to-End (E2E) and API testing.
* **@badeball/cypress-cucumber-preprocessor** - Integration for Gherkin syntax and Behavioral Driven Development (BDD).
* **@faker-js/faker** - Dynamic and randomized data generation to avoid state-pollution and hardcoded dependencies.


## Automated Challenges & Scenarios

### 1. API Testing
* **Feature File:** `desafioApi_1.feature`
* **Objective:** Validate backend contract integrity, payload responses, status codes, and schema compliance using Cypress native `cy.request()` structure.

### 2. Practice Form Component
* **Feature File:** `desafioFront_Form.feature`
* **Objective:** Automate a complex registration form handling diverse UI interactions (radio buttons, checkboxes, custom state dropdowns, date pickers, and media uploads). 
* **Data Strategy:** Leveraging `@faker-js/faker` to dynamically generate random profiles (names, emails, addresses) per execution.

### 3. Web Tables Component
* **Feature File:** `desafioFront_Tables.feature`
* **Objective:** Manipulate data grids dynamically. The test creates 12 random records using structural loops, isolates and alters the exact last item created, and implements a conditional wildcard deletion loop to leave the grid clean.

### 4. Progress Bar Component
* **Feature File:** `desafioFront_Progress.feature`
* **Objective:** Handle complex asynchronous animation rendering. Intercepts real-time progression natively to stop the component precisely before 25%, resumes processing to 100%, and validates state transition upon reset back to 0%.

### 5. Alerts, Frame & Windows Component
* **Feature File:** `desafioFront_Windows.feature`
* **Objective:** Address non-standard browser interactions. Manages multi-tab switching via attribute manipulation (`target="_blank"` removal), handles native browser dialog handlers (Alerts, Confirms, Prompts), and traverses nested iFrame contexts.

##  Architecture & Best Practices Applied

* **Asynchronous Resiliency:** Zero reliance on anti-patterns like hardcoded explicit waits (`cy.wait(ms)`). All timing assertions use Cypress's deterministic retry-ability engine via `.should()` hooks.
* **Wildcard Selectors:** Solved dynamic UI identification issues by utilizing partial string matching selectors (e.g., `span[id^="delete-record-"]`) to bypass dynamic database row IDs.
* **Strict BDD Execution:** Features and step definitions strictly isolated, abstracting execution layers and guaranteeing step reusability.

---

## 🛠️ How to Setup and Run

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd <project-folder>
