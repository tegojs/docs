# Application Events

Application type event sources will monitor application-related behavior operations. When the application starts, closes, refreshes, etc., it listens for specified actions and triggers specified workflows, such as before application closure, after application startup, etc.

## Basic Usage


Common application event source events:

beforeStop: Before application closure

afterStart: After application startup


Configuration items:

- Name: Event source name.
- Workflow: Workflow to be triggered for execution.
- Type: Application event.
- Options:
    - Event Name: Fill in the relevant event



You can choose when to listen according to different business needs
