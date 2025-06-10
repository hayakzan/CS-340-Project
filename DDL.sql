/*
    Project Step 6
    Group 27: Hunter Havice and Yigit Kolat
    Last Updated: 06/09/2025
*/

DELIMITER //

-- Resets schema and sample data
DROP PROCEDURE IF EXISTS ResetRelationshipTracker;
CREATE PROCEDURE ResetRelationshipTracker()
BEGIN
    SET FOREIGN_KEY_CHECKS = 0;

    DROP TABLE IF EXISTS relationship_tags;
    DROP TABLE IF EXISTS tags;
    DROP TABLE IF EXISTS relationship_events;
    DROP TABLE IF EXISTS relationships;
    DROP TABLE IF EXISTS people;
    DROP TABLE IF EXISTS users;

    CREATE TABLE users (
      user_id   INT(11)      NOT NULL AUTO_INCREMENT,
      name      VARCHAR(255) NOT NULL,
      username  VARCHAR(255) NOT NULL UNIQUE,
      dob       DATE,
      gender    VARCHAR(50),
      created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id)
    );

    CREATE TABLE people (
      people_id  INT(11)      NOT NULL AUTO_INCREMENT,
      user_id    INT(11)      NOT NULL,
      name       VARCHAR(255) NOT NULL,
      phone      VARCHAR(15),
      email      VARCHAR(255),
      dob        DATE,
      gender     VARCHAR(50),
      created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (people_id),
      FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    );

    CREATE TABLE relationships (
      relationship_id INT(11)    NOT NULL AUTO_INCREMENT,
      person_id       INT(11)    NOT NULL,
      rel_type        VARCHAR(50),
      status          VARCHAR(50),
      started_at      DATE,
      ended_at        DATE,
      notes           TEXT,
      PRIMARY KEY (relationship_id),
      FOREIGN KEY (person_id)
        REFERENCES people(people_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    );

    CREATE TABLE relationship_events (
      rel_event_id    INT(11)      NOT NULL AUTO_INCREMENT,
      relationship_id INT(11)      NOT NULL,
      event_type      VARCHAR(100),
      event_desc      TEXT,
      event_date      DATE         NOT NULL,
      created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (rel_event_id),
      FOREIGN KEY (relationship_id)
        REFERENCES relationships(relationship_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    );

    CREATE TABLE tags (
      tag_id   INT(11)      NOT NULL AUTO_INCREMENT,
      label    VARCHAR(100) NOT NULL UNIQUE,
      PRIMARY KEY (tag_id)
    );

    CREATE TABLE relationship_tags (
      relationship_id INT(11) NOT NULL,
      tag_id          INT(11) NOT NULL,
      PRIMARY KEY (relationship_id, tag_id),
      FOREIGN KEY (relationship_id)
        REFERENCES relationships(relationship_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
      FOREIGN KEY (tag_id)
        REFERENCES tags(tag_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    );

    SET FOREIGN_KEY_CHECKS = 1;

    INSERT INTO users (name, username, dob, gender, created_at)
    VALUES
      ('John Doe',   'jdoe',    '1985-07-12', 'Male', '2025-04-30 08:00:00'),
      ('Jane Smith', 'jsmith',  '1990-11-03', 'Female', '2025-04-30 08:05:00'),
      ('Alex Ode',   'aode',    NULL,         'Other', '2025-04-30 08:10:00');

    INSERT INTO people (user_id, name, phone, email, dob, gender, created_at)
    VALUES
      (1, 'David Lee',    '2065550001', 'dlee@sample.com',   '1990-03-01', 'Male', '2025-05-01 08:00:00'),
      (1, 'Ricardo Havi', '2065550002', 'rhavi@sample.com',  '1985-03-22', 'Male', '2025-05-01 08:05:00'),
      (1, 'Priya Polat',  NULL,         'ppolat@sample.com', NULL,         'Other', '2025-05-01 08:10:00');

    INSERT INTO relationships (person_id, rel_type, status, started_at, ended_at, notes)
    VALUES
      (1, 'Friend', 'Active', '2019-06-01', NULL, 'Met at UW'),
      (2, 'Friend', 'Active', '1988-01-01', NULL, 'Childhood friend'),
      (3, 'Colleague', 'Active', '2018-09-15', NULL, 'Worked on AI music');

    INSERT INTO relationship_events (relationship_id, event_type, event_desc, event_date, created_at)
    VALUES
      (1, 'Phone Call',  'Discussed project',     '2024-04-01', '2024-04-01 20:00:00'),
      (1, 'Coffee',      'Catch-up',              '2025-02-20', '2025-02-20 20:05:00'),
      (2, 'Birthday',    'Sent gift',             '2025-03-22', '2025-06-01 20:10:00'),
      (3, 'Meeting',     'Lab collab',            '2024-06-01', '2024-06-01 20:15:00');

    INSERT INTO tags (label)
    VALUES
      ('casual'),
      ('close'),
      ('peripheral');

    INSERT INTO relationship_tags (relationship_id, tag_id)
    VALUES
      (1, 1),
      (2, 2),
      (3, 3);

END //

-- Stored Procedures for users
DROP PROCEDURE IF EXISTS CreateUser;
CREATE PROCEDURE CreateUser(
  IN p_name      VARCHAR(255),
  IN p_username  VARCHAR(255),
  IN p_dob       DATE,
  IN p_gender    VARCHAR(50)
)
BEGIN
  INSERT INTO users (name, username, dob, gender)
  VALUES (p_name, p_username, p_dob, p_gender);
END //

DROP PROCEDURE IF EXISTS UpdateUser;
CREATE PROCEDURE UpdateUser(
  IN p_user_id   INT,
  IN p_name      VARCHAR(255),
  IN p_username  VARCHAR(255),
  IN p_dob       DATE,
  IN p_gender    VARCHAR(50)
)
BEGIN
  UPDATE users
     SET name     = p_name,
         username = p_username,
         dob      = p_dob,
         gender   = p_gender
   WHERE user_id = p_user_id;
END //

DROP PROCEDURE IF EXISTS DeleteUser;
CREATE PROCEDURE DeleteUser(
  IN p_user_id   INT
)
BEGIN
  DELETE FROM users
   WHERE user_id = p_user_id;
END //

-- Stored Procedures for people
DROP PROCEDURE IF EXISTS CreatePerson;
CREATE PROCEDURE CreatePerson(
  IN p_user_id INT,
  IN p_name    VARCHAR(255),
  IN p_phone   VARCHAR(15),
  IN p_email   VARCHAR(255),
  IN p_dob     DATE,
  IN p_gender  VARCHAR(50)
)
BEGIN
  INSERT INTO people (user_id, name, phone, email, dob, gender)
  VALUES (p_user_id, p_name, p_phone, p_email, p_dob, p_gender);
END //

DROP PROCEDURE IF EXISTS UpdatePerson;
CREATE PROCEDURE UpdatePerson(
  IN p_people_id INT,
  IN p_name      VARCHAR(255),
  IN p_phone     VARCHAR(15),
  IN p_email     VARCHAR(255),
  IN p_dob       DATE,
  IN p_gender    VARCHAR(50)
)
BEGIN
  UPDATE people
     SET name   = p_name,
         phone  = p_phone,
         email  = p_email,
         dob    = p_dob,
         gender = p_gender
   WHERE people_id = p_people_id;
END //

DROP PROCEDURE IF EXISTS DeletePerson;
CREATE PROCEDURE DeletePerson(
  IN p_people_id INT
)
BEGIN
  DELETE FROM people WHERE people_id = p_people_id;
END //

DELIMITER ;

-- Raw schema definitions (optional, for reference only; not needed if you use the Reset proc)
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS relationship_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS relationship_events;
DROP TABLE IF EXISTS relationships;
DROP TABLE IF EXISTS people;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id   INT(11)      NOT NULL AUTO_INCREMENT,
  name      VARCHAR(255) NOT NULL,
  username  VARCHAR(255) NOT NULL UNIQUE,
  dob       DATE,
  gender    VARCHAR(50),
  created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id)
);

CREATE TABLE people (
  people_id  INT(11)      NOT NULL AUTO_INCREMENT,
  user_id    INT(11)      NOT NULL,
  name       VARCHAR(255) NOT NULL,
  phone      VARCHAR(15),
  email      VARCHAR(255),
  dob        DATE,
  gender     VARCHAR(50),
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (people_id),
  FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE relationships (
  relationship_id INT(11)    NOT NULL AUTO_INCREMENT,
  person_id       INT(11)    NOT NULL,
  rel_type        VARCHAR(50),
  status          VARCHAR(50),
  started_at      DATE,
  ended_at        DATE,
  notes           TEXT,
  PRIMARY KEY (relationship_id),
  FOREIGN KEY (person_id)
    REFERENCES people(people_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE relationship_events (
  rel_event_id    INT(11)      NOT NULL AUTO_INCREMENT,
  relationship_id INT(11)      NOT NULL,
  event_type      VARCHAR(100),
  event_desc      TEXT,
  event_date      DATE         NOT NULL,
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (rel_event_id),
  FOREIGN KEY (relationship_id)
    REFERENCES relationships(relationship_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
CREATE TABLE tags (
  tag_id   INT(11)      NOT NULL AUTO_INCREMENT,
  label    VARCHAR(100) NOT NULL UNIQUE,
  PRIMARY KEY (tag_id)
);
CREATE TABLE relationship_tags (
  relationship_id INT(11) NOT NULL,
  tag_id          INT(11) NOT NULL,
  PRIMARY KEY (relationship_id, tag_id),
  FOREIGN KEY (relationship_id)
    REFERENCES relationships(relationship_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (tag_id)
    REFERENCES tags(tag_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
