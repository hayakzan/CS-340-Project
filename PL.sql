/*
    PL.SQL - Project Step 5
    Group 27: Hunter Havice and Yigit Kolat
    Last Updated: 06/02/2025
*/

-- Drop procedure if it exists
DROP PROCEDURE IF EXISTS DeleteSamplePlayer;
DELIMITER //
CREATE PROCEDURE DeleteSamplePlayer()
BEGIN
  -- remove the one with the smallest user_id
  DELETE FROM users
  ORDER BY user_id ASC
  LIMIT 1;
END //
DELIMITER ;
