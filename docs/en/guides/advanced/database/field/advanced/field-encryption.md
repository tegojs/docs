# Encryption

::: info &#9432; Note
This feature is provided by the module-field-encryption plugin.
:::

### Introduction

Some sensitive business data, such as customer phone numbers, email addresses, card numbers, etc., can be protected through encryption, ensuring encrypted data is stored in ciphertext form in the database.

### Environment Variables

::: warning &#9888; WARNING
If `ENCRYPTION_FIELD_KEY` is lost, data will not be decryptable
:::

If you need to enable encryption, you need to configure the ENCRYPTION_FIELD_KEY environment variable, which should be 32 characters long, for example:
`ENCRYPTION_FIELD_KEY='aZ7$wLq+28VnPb&1tXkYh3m9zJ0uQwE#'`

### Field Configuration

![](../../../../../../public/field_encryption1.png)

### Filtering After Encryption

Encrypted fields can only use equals, not equals, exists, and does not exist operators.
<!-- TODO: Insert image -->

### Interface Configuration

To be added
