# Overview

### Date and Time Field Types
Date and time fields can be divided into several types, as follows:

- Date and time with timezone: Uniformly convert date and time to UTC time, and adjust to the corresponding timezone when necessary;
- Date and time without timezone: Store date and time, but do not include timezone;
- Date (without time): Only store the date part, ignoring time;
- Time (without date): Only store time, date part not included;
- Unix timestamp: Represented as a Unix timestamp, typically the number of seconds since January 1, 1970.

Example: Different representations of various date field types:

|Field Type|Example Value|Description|
|-------|-----|---|
|Datetime (with timezone)|2025-02-26T11:30:00.000Z|Converted to UTC time, stored datetime includes timezone information.|
|Datetime (without timezone)|2025-02-26 11:45:14|Without timezone information, only records date and time.|
|Date (without time)|2025-08-24|Stores date, does not include time.|
|Time (without date)|11:45:14|Stores time, but does not record date information.|
|Unix timestamp|1814437800|Records seconds since January 1, 1970 (UTC time).|

### Comparison Across Data Sources
Comparison table for Tachybase, MySQL and PostgreSQL:
|Field Type|Tachybase|MySQL|PostgreSQL|
|-------|-------|------|----------|
|Datetime (with timezone)|Datetime with timezone|TIMESTAMP DATETIME|TIMESTAMP WITH TIME ZONE|
|Datetime (without timezone)|Datetime without timezone|DATETIME|TIMESTAMP WITHOUT TIME ZONE|
|Date (without time)|Date|DATE|DATE|
|Time|Time|TIME|TIME WITHOUT TIME ZONE|
|Unix timestamp|Unix timestamp|INTEGER BIGINT|INTEGER BIGINT|
|Time (with timezone)|-|-|TIME WITH TIME ZONE|

**Note:**
MySQL's **TIMESTAMP** type supports a time range from UTC time *1970-01-01 00:00:01* to *2038-01-19 03:14:07*. If exceeding this time range, it is recommended to use **DATETIME** type or **BIGINT** type to store Unix timestamps.

### Date and Time Storage Processing Flow

##### With Timezone

Includes datetime (without timezone) and Unix timestamp
<!--TODO: Add image-->

**Note:**
- To support a wider data range, **Tachybase** stores datetime (with timezone) fields in MySQL as DATETIME. The stored date value is the value converted based on the server's TZ environment variable. If this environment variable changes, the stored datetime value will change accordingly.
- There is a timezone difference between UTC time and local time. Displaying the original UTC value may cause user misunderstanding.

##### Without Timezone
<!--TODO: Add image-->

#### UTC
**Coordinated Universal Time UTC** is the global time standard, used to unify time around the world. It is based on high-precision timekeeping by atomic clocks and synchronized with the time of Earth's rotation.

Due to timezone differences between UTC time and local time, directly displaying UTC raw time may cause user misunderstanding, for example:
|Timezone|Datetime|
|---|-------|
|UTC|2025-02-26T03:30:00.000Z|
|East Zone 8 (UTC+8)|2025-02-26 11:30:00|
|East Zone 5 (UTC+5)|2025-02-26 08:30:00|
|West Zone 5 (UTC-5)|2025-02-26 01:30:00|
|UK Time (UTC+0)|2025-02-26 03:30:00|
|Central Time (UTC-6)|2025-02-25 21:30:00|

This table shows the same time.
