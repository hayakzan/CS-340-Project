/*
    PL.SQL - Project Step 4
    Group 27: Hunter Havice and Yigit Kolat
    Last Updated: 05/22/2025
*/

-- Drop procedure if it exists
DROP PROCEDURE IF EXISTS DeleteSamplePlayer;

DELIMITER //
CREATE PROCEDURE DeleteSamplePlayer()
BEGIN
    DELETE FROM people WHERE name = 'David Lee';
END //
DELIMITER ;