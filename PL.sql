/*
    PL.SQL - Project Step 5
    Group 27: Hunter Havice and Yigit Kolat
    Last Updated: 05/22/2025
*/

-- Drop procedure if it exists
DROP PROCEDURE IF EXISTS DeleteSamplePlayer;

DELIMITER //
CREATE PROCEDURE DeleteSamplePlayer()
BEGIN
    DELETE FROM users WHERE name = 'Alex Ode';
END //
DELIMITER ;
