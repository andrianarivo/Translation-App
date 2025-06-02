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

SELECT s1.key,
	s1.value AS "fr-FR",
	s2.value AS "en-US",
	s3.value AS "en-US"
FROM (
	SELECT c.key,
		c.value,
		t.name AS lang
	FROM translations t 
	JOIN contents c 
	ON c.translation_id = t.id
	WHERE t.name = 'fr-FR'
) s1
LEFT OUTER JOIN (
	SELECT c.key,
		c.value,
		t.name AS lang
	FROM translations t 
	JOIN contents c 
	ON c.translation_id = t.id
	WHERE t.name = 'en-US'
) s2
ON s1.key = s2.key
LEFT OUTER JOIN (
	SELECT c.key,
		c.value,
		t.name as language
	FROM translations t 
	JOIN contents c 
	ON c.translation_id = t.id
	WHERE t.name = 'en-US'
) s3
ON s1.key = s3.key;