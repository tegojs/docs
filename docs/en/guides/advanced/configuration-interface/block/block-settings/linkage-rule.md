# Linkage Rules

## Introduction

Linkage rules allow dynamically adjusting the status of form fields based on user behavior, such as: show/hide, required/not required, assign values, etc. Currently support configuring linkage rules: [Form Block], [Details Block], [Action Buttons], [Sub-form] (requires v1.3.17-beta and above), [Sub-table] (requires v1.3.17-beta and above).

## Usage Instructions

1. Configure form fields: All form fields used in rules need to be configured to ensure the validity and accuracy of rules.

2. Condition trigger: When the conditions in the rule are met (not required), property modification operations below will be automatically executed.

3. Support multiple rules: Multiple linkage rules can be configured for one form. When multiple rule conditions are met simultaneously, the system will execute results in order from front to back according to the rule sequence.

4. Rule management: Supports custom naming, sorting, deletion, enabling, disabling, and copying rules.

5. Support constants/variables: Supports using constants or variables in field assignment and condition configuration. For variable content, refer to [Variables](/handbook/ui/variables).

### Assignment

Example: Automatically evaluate and set customer level (for example: A+ level, A level, A- level) based on expected annual purchase amount.

- Annual purchase amount greater than 20000, customer level is A+.


- Annual purchase amount greater than 10000 and less than or equal to 20000, customer level is A.

- Annual purchase amount less than 10000, customer level is A-.


### Required

Example: Control whether product promotion price is required based on whether it's on promotion.

- If on promotion is true, promotion price is required.

- If on promotion is false, promotion price is not required.

### Show/Hide

Example: Control whether promotion price input box is displayed based on whether it's on promotion.

- If on promotion is true, promotion price is displayed and required.


- If on promotion is false, promotion price is hidden and not required.
