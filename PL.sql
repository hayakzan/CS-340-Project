DELIMITER //
CREATE PROCEDURE DeleteSamplePlayer()
BEGIN
    DELETE FROM players WHERE name = 'Alex Ode';
END //
DELIMITER ;
