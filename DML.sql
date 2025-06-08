/*
    Data Manipulation Queries for Relationship Tracker
    Project Step 5
    Group 27: Hunter Havice and Yigit Kolat
    Last Updated: 06/02/2025
*/

-- =========================
-- Users
-- =========================
-- List all users
SELECT *
  FROM users;

-- Get a single user by ID
SELECT *
  FROM users
 WHERE user_id = @userId;

-- Create a new user
INSERT INTO users (name, username, dob, gender)
VALUES (@name, @username, @dob, @gender);

-- Update an existing user
UPDATE users
   SET name     = @name,
       username = @username,
       dob      = @dob,
       gender   = @gender
 WHERE user_id = @userId;

-- Delete a user
DELETE FROM users
 WHERE user_id = @userId;


-- =========================
-- People
-- =========================
-- List all people for a given user
SELECT *
  FROM people
 WHERE user_id = @userId;

-- Get a single person by ID
SELECT *
  FROM people
 WHERE people_id = @personId;

-- Create a new person
INSERT INTO people
  (user_id, name, phone, email, dob, gender)
VALUES
  (@userId, @name, @phone, @email, @dob, @gender);

-- Update an existing person
UPDATE people
   SET name   = @name,
       phone  = @phone,
       email  = @email,
       dob    = @dob,
       gender = @gender
 WHERE people_id = @personId;

-- Delete a person
DELETE FROM people
 WHERE people_id = @personId;


-- =========================
-- Relationships
-- =========================
-- List all relationships for a person
SELECT relationship_id,
       rel_type,
       status,
       started_at,
       ended_at,
       notes
  FROM relationships
 WHERE person_id = @personId;

-- Get a single relationship by ID
SELECT *
  FROM relationships
 WHERE relationship_id = @relationshipId;

-- Create a new relationship
INSERT INTO relationships
  (person_id, rel_type, status, started_at, ended_at, notes)
VALUES
  (@personId, @relType, @status, @startedAt, @endedAt, @notes);

-- Update an existing relationship
UPDATE relationships
   SET rel_type   = @relType,
       status     = @status,
       started_at = @startedAt,
       ended_at   = @endedAt,
       notes      = @notes
 WHERE relationship_id = @relationshipId;

-- Delete a relationship
DELETE FROM relationships
 WHERE relationship_id = @relationshipId;


-- =========================
-- Relationship Events
-- =========================
-- List all events for a person
SELECT e.rel_event_id   AS event_id,
       e.event_type     AS eventType,
       e.event_desc     AS eventDesc,
       e.event_date     AS eventDate,
       e.created_at     AS createdAt
  FROM relationship_events AS e
  JOIN relationships        AS r
    ON e.relationship_id = r.relationship_id
 WHERE r.person_id = @personId;

-- Get a single event by ID
SELECT *
  FROM relationship_events
 WHERE rel_event_id = @eventId;

-- Create a new event
INSERT INTO relationship_events
  (relationship_id, event_type, event_desc, event_date)
VALUES
  (@relationshipId, @eventType, @eventDesc, @eventDate);

-- Update an existing event
UPDATE relationship_events
   SET event_type = @eventType,
       event_desc = @eventDesc,
       event_date = @eventDate
 WHERE rel_event_id = @eventId;

-- Delete an event
DELETE FROM relationship_events
 WHERE rel_event_id = @eventId;


-- =========================
-- Tags
-- =========================
-- List all tags
SELECT *
  FROM tags;

-- Get a single tag by ID
SELECT *
  FROM tags
 WHERE tag_id = @tagId;

-- Create a new tag
INSERT INTO tags (label)
VALUES (@label);

-- Update a tag
UPDATE tags
   SET label = @label
 WHERE tag_id = @tagId;

-- Delete a tag
DELETE FROM tags
 WHERE tag_id = @tagId;


-- =========================
-- Relationship Tags (M:N)
-- =========================
-- List all tags for a person
SELECT rt.relationship_id,
       rt.tag_id,
       t.label      AS tagLabel
  FROM relationship_tags AS rt
  JOIN relationships      AS r
    ON rt.relationship_id = r.relationship_id
  JOIN tags               AS t
    ON rt.tag_id          = t.tag_id
 WHERE r.person_id = @personId;

-- Assign a tag to a relationship
INSERT INTO relationship_tags
  (relationship_id, tag_id)
VALUES
  (@relationshipId, @tagId);

-- Remove a tag from a relationship
DELETE FROM relationship_tags
 WHERE relationship_id = @relationshipId
   AND tag_id          = @tagId;
