# Submit

## Introduction

The submit operation is used to save form data (specific to form blocks) and can also be combined with workflows to implement automated data processes.

![20240413093210](/actions/submit-1.png)

## Operation Configuration Items

![20240413095124](/actions/submit-2.png)

### Save Mode

Only the submit operation of form blocks for adding data supports configuring save mode.

![20240413101209](/actions/submit-3.png)

![20240413100531](/actions/submit-4.png)

1. Direct insert and create;
2. Insert if not exists (need to configure fields used to determine if record exists);
3. Insert if not exists, otherwise update (need to configure fields used to determine if record exists);

### Bind Workflow

Bound workflows will only be triggered after data is successfully submitted.

![20240417120149](/actions/submit-5.png)

For more content, refer to [Bind Workflow](/guides/advanced/configuration-interface/actions/action-settings/bind-workflow)


- [Edit Button](/guides/advanced/configuration-interface/actions/action-settings/edit-button)
- [Double Check](/guides/advanced/configuration-interface/actions/action-settings/double-check)
