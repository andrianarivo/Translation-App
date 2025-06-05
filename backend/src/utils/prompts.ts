export const TRANSLATION_PROMPT = `You will translate missing translations from a json text. You will return the result just like I say. NO COMMENT OR ANYTHING.
  You return only valid JSON content !!!

----

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
    }
  ]

Example output:
  [
    {
      "id": -1,
      "key": "test.screen",
      "locale": "en-US",
      "value": "hi"
    }
  ]

----

  Example input:
  [
    {
      "translation_id%fr-FR": 1,
      "translation_id%en-US": 2,
      "content_id%fr-FR": 37,
      "content_id%en-US": 73,
      "key": "appointments.screen.detail",
      "fr-FR": "",
      "en-US": "Detail"
    },
    {
      "translation_id%fr-FR": 1,
      "translation_id%en-US": 2,
      "content_id%fr-FR": 38,
      "content_id%en-US": 74,
      "key": "appointments.screen.search_placeholder",
      "fr-FR": "Chercher un médecin ou un problème de santé",
      "en-US": ""
    }
  ]

Example output:
  [
    {
      "id": 37,
      "key": "appointments.screen.detail",
      "locale": "fr-FR",
      "value": "Détails"
    },
    {
      "id": 73,
      "key": "appointments.screen.detail",
      "locale": "en-US",
      "value": "Detail"
    },
    {
      "id": 38,
      "key": "appointments.screen.search_placeholder",
      "locale": "fr-FR",
      "value": "Chercher un médecin ou un problème de santé"
    },
    {
      "id": 74,
      "key": "appointments.screen.search_placeholder",
      "locale": "en-US",
      "value": "Search doctor or health issue"
    }
  ]

----

  Example input:
  [

    {
      "translation_id%fr-FR": 1,
      "translation_id%en-US": null,
      "content_id%fr-FR": 3,
      "content_id%en-US": null,
      "key": "screen.title",
      "fr-FR": "salut",
      "en-US": ""
    },
    {
      "translation_id%fr-FR": 1,
      "translation_id%en-US": 2,
      "content_id%fr-FR": 37,
      "content_id%en-US": 73,
      "key": "appointments.screen.detail",
      "fr-FR": "",
      "en-US": "Detail"
    },
    {
      "translation_id%fr-FR": 1,
      "translation_id%en-US": 2,
      "content_id%fr-FR": 38,
      "content_id%en-US": 74,
      "key": "appointments.screen.search_placeholder",
      "fr-FR": "Chercher un médecin ou un problème de santé",
      "en-US": ""
    }
  ]

Example output:
  [
    {
      "id": -1,
      "key": "test.screen",
      "locale": "en-US",
      "value": "hi"
    },
    {
      "id": 37,
      "key": "appointments.screen.detail",
      "locale": "fr-FR",
      "value": "Détails"
    },
    {
      "id": 74,
      "key": "appointments.screen.search_placeholder",
      "locale": "en-US",
      "value": "Search doctor or health issue"
    }
  ]

ONLY RETURN THE MISSING TRANSLATIONS!

----

  Input: `;
