-- USERS
DROP PROCEDURE IF EXISTS CreateUser;
DROP PROCEDURE IF EXISTS UpdateUser;
DROP PROCEDURE IF EXISTS DeleteUser;

DELIMITER //
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

CREATE PROCEDURE DeleteUser(
  IN p_user_id   INT
)
BEGIN
  DELETE FROM users
   WHERE user_id = p_user_id;
END //

-- PEOPLE
DROP PROCEDURE IF EXISTS CreatePerson;
DROP PROCEDURE IF EXISTS UpdatePerson;
DROP PROCEDURE IF EXISTS DeletePerson;

CREATE PROCEDURE CreatePerson(
  IN p_user_id   INT,
  IN p_name      VARCHAR(255),
  IN p_phone     VARCHAR(50),
  IN p_email     VARCHAR(255),
  IN p_dob       DATE,
  IN p_gender    VARCHAR(50)
)
BEGIN
  INSERT INTO people (user_id, name, phone, email, dob, gender)
  VALUES (p_user_id, p_name, p_phone, p_email, p_dob, p_gender);
END //

CREATE PROCEDURE UpdatePerson(
  IN p_people_id INT,
  IN p_name      VARCHAR(255),
  IN p_phone     VARCHAR(50),
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

CREATE PROCEDURE DeletePerson(
  IN p_people_id INT
)
BEGIN
  DELETE FROM people
   WHERE people_id = p_people_id;
END //

-- RELATIONSHIPS
DROP PROCEDURE IF EXISTS CreateRelationship;
DROP PROCEDURE IF EXISTS UpdateRelationship;
DROP PROCEDURE IF EXISTS DeleteRelationship;

CREATE PROCEDURE CreateRelationship(
  IN p_person_id INT,
  IN p_rel_type  VARCHAR(255),
  IN p_status    VARCHAR(50),
  IN p_started_at DATE,
  IN p_ended_at  DATE,
  IN p_notes     TEXT
)
BEGIN
  INSERT INTO relationships (person_id, rel_type, status, started_at, ended_at, notes)
  VALUES (p_person_id, p_rel_type, p_status, p_started_at, p_ended_at, p_notes);
END //

CREATE PROCEDURE UpdateRelationship(
  IN p_relationship_id INT,
  IN p_rel_type        VARCHAR(255),
  IN p_status          VARCHAR(50),
  IN p_started_at      DATE,
  IN p_ended_at        DATE,
  IN p_notes           TEXT
)
BEGIN
  UPDATE relationships
     SET rel_type   = p_rel_type,
         status     = p_status,
         started_at = p_started_at,
         ended_at   = p_ended_at,
         notes      = p_notes
   WHERE relationship_id = p_relationship_id;
END //

CREATE PROCEDURE DeleteRelationship(
  IN p_relationship_id INT
)
BEGIN
  DELETE FROM relationships
   WHERE relationship_id = p_relationship_id;
END //

-- RELATIONSHIP EVENTS (Create/Update/Delete)
DROP PROCEDURE IF EXISTS CreateRelationshipEvent;
DROP PROCEDURE IF EXISTS UpdateRelationshipEvent;
DROP PROCEDURE IF EXISTS DeleteRelationshipEvent;

CREATE PROCEDURE CreateRelationshipEvent(
  IN p_relationship_id INT,
  IN p_event_type      VARCHAR(100),
  IN p_event_desc      TEXT,
  IN p_event_date      DATE
)
BEGIN
  INSERT INTO relationship_events (relationship_id, event_type, event_desc, event_date)
  VALUES (p_relationship_id, p_event_type, p_event_desc, p_event_date);
END //

CREATE PROCEDURE UpdateRelationshipEvent(
  IN p_rel_event_id    INT,
  IN p_event_type      VARCHAR(100),
  IN p_event_desc      TEXT,
  IN p_event_date      DATE
)
BEGIN
  UPDATE relationship_events
     SET event_type = p_event_type,
         event_desc = p_event_desc,
         event_date = p_event_date
   WHERE rel_event_id = p_rel_event_id;
END //

CREATE PROCEDURE DeleteRelationshipEvent(
  IN p_rel_event_id INT
)
BEGIN
  DELETE FROM relationship_events
   WHERE rel_event_id = p_rel_event_id;
END //

-- RELATIONSHIP TAGS (Assign/Delete)
DROP PROCEDURE IF EXISTS AssignRelationshipTag;
DROP PROCEDURE IF EXISTS RemoveRelationshipTag;

CREATE PROCEDURE AssignRelationshipTag(
  IN p_relationship_id INT,
  IN p_tag_id          INT
)
BEGIN
  INSERT INTO relationship_tags (relationship_id, tag_id)
  VALUES (p_relationship_id, p_tag_id);
END //

CREATE PROCEDURE RemoveRelationshipTag(
  IN p_relationship_id INT,
  IN p_tag_id          INT
)
BEGIN
  DELETE FROM relationship_tags
   WHERE relationship_id = p_relationship_id
     AND tag_id = p_tag_id;
END //
DELIMITER ;
