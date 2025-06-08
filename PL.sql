-- PL.SQL – Project Step 6
-- Group 27: Hunter Havice and Yigit Kolat
-- Contains all C-U-D stored procedures for the users table

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

DELIMITER ;
