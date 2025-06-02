SELECT c.key,
	c.value,
	t.name as language
FROM translations t 
JOIN contents c 
ON c.translation_id = t.id
WHERE t.name = 'en-US';

SELECT c.key,
	c.value,
	t.name as language
FROM translations t 
JOIN contents c 
ON c.translation_id = t.id
WHERE t.name = 'fr-FR';

SELECT * FROM translation_files;

TRUNCATE translation_files RESTART IDENTITY CASCADE;
TRUNCATE translations RESTART IDENTITY CASCADE;
TRUNCATE contents RESTART IDENTITY CASCADE;