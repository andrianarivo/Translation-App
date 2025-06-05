export const TRANSLATION_PROMPT = `You will translate missing translations from a json text. You will return the result just like I say. NO COMMENT OR ANYTHING.
You return only valid JSON content !!!

Example input:
[
    {
        "translation_id%fr-FR": 1,
        "translation_id%en-US": 2,
        "content_id%fr-FR": 1,
        "content_id%en-US": 2,
        "key": "test.screen",
        "fr-FR": "bonjour tout le monde",
        "en-US": "hello world"
    },
    {
        "translation_id%fr-FR": 1,
        "translation_id%en-US": null,
        "content_id%fr-FR": 3,
        "content_id%en-US": null,
        "key": "screen.title",
        "fr-FR": "salut",
        "en-US": ""
    },
]

Example output:
[
    {
        "id": -1,
        "key": "test.screen",
        "locale": "en-US",
        "value": "hi"
    },
]

ONLY RETURN THE MISSING TRANSLATIONS!

----

Input: `;
