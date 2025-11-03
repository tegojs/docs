# Relationship Fields

### Introduction


In **Tachybase**, relationship fields do not directly store data, but are used to establish connections between different tables. It is similar to relationships between tables in relational databases. Common relationship types include:

[One-to-one](./o2o.md):
In this relationship, each record in one table can only be associated with one record in another table. Typically, this relationship is used to separate different parts of an entity for storage to reduce redundancy and ensure data consistency. For example, each user can only have one unique ID number.

[One-to-many](./o2m.md):
In this relationship, one record in one table can be associated with multiple records in another table. For instance, a company can have multiple departments, while each department has only one company as its superior. In this case, a one-to-many relationship is established between a company and multiple departments.

[Many-to-one](./m2o.md):
In this relationship, multiple records in one table can be associated with a single record in another table. For example, multiple students can belong to the same class. In this case, there is a many-to-one relationship between multiple students and one class.

[Many-to-many](./m2m.md):
In this relationship, multiple records in two tables can be mutually associated. To implement a many-to-many relationship, an intermediate table is typically needed to store the associations between the two tables. For example, the relationship between movies and actors - multiple actors can star in multiple movies, and each movie can have multiple actors. In this example, there is a many-to-many relationship between the movie table and the actor table. To manage this relationship, we can create an intermediate table for actors starring in movies, recording the corresponding relationship between each actor and movie.

These relationship types are very important in database modeling and design. They help establish and organize complex connections between tables, accurately reflecting various entity relationships in the real world.
