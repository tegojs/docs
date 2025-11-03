# File Manager

## Introduction

The File Manager plugin provides file collections, attachment fields, and file storage engines for effective file management. Files are data table records with a specific structure. This specific structured data table is called a file collection, used to store file metadata and can be managed through the file manager. Attachment fields are specific relationship fields associated with file collections. Files support multiple storage methods. Currently supported file storage engines include local storage, Aliyun OSS, Amazon S3, and Tencent Cloud COS.

## User Manual

### File Collection

The built-in attachments collection is used to store files associated with all attachment fields. In addition, new file collections can be created to store specific files.

[For more usage, see the file collection documentation](./file-collection.md)


### Attachment Field

Attachment fields are specific relationship fields associated with file collections. They can be created through "Attachment Type Field" or configured through "Relationship Field".

[For more usage, see the attachment field documentation](./field-attachment.md)

### File Storage Engine

File storage engines are used to save files to specific services, including local storage (saved to server hard disk), cloud storage, etc.

[For more information, see the file storage engine documentation](./storage/index.md)


## Extension Development
* [Extend frontend file types](./development.md)
