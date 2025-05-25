/*
    PL.SQL - Project Step 4
    Group 27: Hunter Havice and Yigit Kolat
    Last Updated: 05/22/2025
*/

-- Drop procedure if it exists
DROP PROCEDURE IF EXISTS DeleteSampleUser;

DELIMITER //
CREATE PROCEDURE DeleteSampleUser()
BEGIN
    DELETE FROM users WHERE name = 'Alex Ode';
END //
DELIMITER ;