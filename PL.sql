/*
    PL.SQL - Project Step 4
    Group 27: Hunter Havice and Yigit Kolat
    Last Updated: 05/22/2025
*/

DELIMITER //
CREATE PROCEDURE DeleteSamplePlayer()
BEGIN
    DELETE FROM players WHERE name = 'Alex Ode';
END //
DELIMITER ;

