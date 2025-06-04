function flatten({obj, prefix = ''}) {
  const result = {};

  function isValidObject(value) {
    return typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        !(value instanceof Date);
  }

  function flattenRecursive(obj, prefix) {
    if (obj !== null) {
      for (const key of Object.keys(obj)) {
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (isValidObject(obj[key])) {
          flattenRecursive(obj[key], newKey);
        } else {
          result[newKey] = String(obj[key]);
        }
      }
    }
  }

  flattenRecursive(obj, prefix);
  return result;
}

// Your JSON data
const jsonData = {
  "test": {
    "screen": "bonjour tout le monde"
  },
  "screen": {
    "title": "salut"
  },
  "doctor_profile": {
    "name": "Dr. Joseph Brostito",
    "specialty": "Médecin généraliste",
    "distance": "1,2 KM",
    "reviews": "4,8 (120 avis)",
    "open_time": "Ouvert à 17h00"
  },
  "appointment": {
    "date": "Dimanche 12 juin",
    "time": "11:00 - 12:00 AM"
  },
  "health_info": {
    "covid_title": "Covid 19",
    "doctor_label": "Médecin",
    "medicine_label": "Médicament",
    "hospital_label": "Hôpital"
  },
  "doctor_listing": {
    "nearby_doctors_title": "Médecins à proximité"
  },
  "greeting": {
    "user": "Salut Antoine"
  },
  "time": {
    "current": "9:41"
  },
  "navigation": {
    "home": "Accueil"
  },
  "appointments": {
    "screen": {
      "availabilities": "Disponibilités",
      "cancelled": "Rendez-vous annulés",
      "upcoming": "Rendez-vous à venir",
      "attended": "Rendez-vous assistés",
      "doctor_name": {
        "1": "Dr. Joseph Brostito",
        "2": "Dr. Bessie Coleman",
        "3": "Dr. Babe Didrikson"
      },
      "specialization": {
        "1": "Spécialiste dentaire",
        "2": "Spécialiste dentaire",
        "3": "Spécialiste dentaire"
      },
      "date": {
        "1": "Dimanche 12 juin",
        "2": "Dimanche 12 juin",
        "3": "Dimanche 12 juin"
      },
      "time": {
        "1": "11:00 - 12:00 AM",
        "2": "11:00 - 12:00 AM",
        "3": "11:00 - 12:00 AM"
      },
      "book_now": {
        "1": "Réservez maintenant",
        "2": "Réservez maintenant"
      },
      "detail": "Détails",
      "search_placeholder": "Chercher un médecin ou un problème de santé",
      "current_time": "9:41"
    }
  }
};

// Flatten the JSON object
// const flattened = flatten({obj: jsonData});
// Output the result
// Object.entries(flattened).map(([key, value]) => {
//   console.log(`${key}: ${value}`);
// });
//for (const key in jsonData) {
//  console.log(jsonData.hasOwnProperty(key));
//}

// console.log(typeof null);

const flatData = [
  { key: 'doctor_profile.name', value: 'Dr. Joseph Brostito' },
  { key: 'doctor_profile.specialty', value: 'Médecin généraliste' },
  { key: 'doctor_profile.distance', value: '1,2 KM' },
  { key: 'doctor_profile.reviews', value: '4,8 (120 avis)' },
  { key: 'doctor_profile.open_time', value: 'Ouvert à 17h00' },
  { key: 'appointment.date', value: 'Dimanche 12 juin' },
  { key: 'appointment.time', value: '11:00 - 12:00 AM' },
  { key: 'health_info.covid_title', value: 'Covid 19' },
  { key: 'health_info.doctor_label', value: 'Médecin' },
  { key: 'health_info.hospital_label', value: 'Hôpital' },
  {
    key: 'doctor_listing.nearby_doctors_title',
    value: 'Médecins à proximité'
  },
  { key: 'greeting.user', value: 'Salut Antoine' },
  { key: 'time.current', value: '9:41' },
  { key: 'navigation.home', value: 'Accueil' },
  {
    key: 'appointments.screen.availabilities',
    value: 'Disponibilités'
  },
  {
    key: 'appointments.screen.cancelled',
    value: 'Rendez-vous annulés'
  },
  { key: 'appointments.screen.upcoming', value: 'Rendez-vous à venir' },
  {
    key: 'appointments.screen.attended',
    value: 'Rendez-vous assistés'
  },
  {
    key: 'appointments.screen.doctor_name.1',
    value: 'Dr. Joseph Brostito'
  },
  {
    key: 'appointments.screen.doctor_name.2',
    value: 'Dr. Bessie Coleman'
  },
  {
    key: 'appointments.screen.doctor_name.3',
    value: 'Dr. Babe Didrikson'
  },
  {
    key: 'appointments.screen.specialization.1',
    value: 'Spécialiste dentaire'
  },
  {
    key: 'appointments.screen.specialization.2',
    value: 'Spécialiste dentaire'
  },
  {
    key: 'appointments.screen.specialization.3',
    value: 'Spécialiste dentaire'
  },
  { key: 'appointments.screen.date.1', value: 'Dimanche 12 juin' },
  { key: 'appointments.screen.date.2', value: 'Dimanche 12 juin' },
  { key: 'appointments.screen.date.3', value: 'Dimanche 12 juin' },
  { key: 'appointments.screen.time.1', value: '11:00 - 12:00 AM' },
  { key: 'appointments.screen.time.2', value: '11:00 - 12:00 AM' },
  { key: 'appointments.screen.time.3', value: '11:00 - 12:00 AM' },
  {
    key: 'appointments.screen.book_now.1',
    value: 'Réservez maintenant'
  },
  {
    key: 'appointments.screen.book_now.2',
    value: 'Réservez maintenant'
  },
  { key: 'appointments.screen.detail', value: 'Détails' },
  {
    key: 'appointments.screen.search_placeholder',
    value: 'Chercher un médecin ou un problème de santé'
  },
  { key: 'appointments.screen.current_time', value: '9:41' },
  { key: 'bottom.nav.title', value: 'surveille-covid' },
  {
    key: 'bottom.nav.subtitle',
    value: 'comment surveiller le covid-19'
  },
  { key: 'test.screen', value: 'bonjour tous' },
  { key: 'health_info.medicine_label', value: 'Médicament' },
  { key: 'screen.title', value: 'salut' }
];

function unflatten(data) {
  const result = {};

  for (const item of data) {
    const keys = item.key.split('.');
    let current = result;

    // Parcourir toutes les clés sauf la dernière
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];

      // Si la clé n'existe pas ou n'est pas un objet, créer un nouvel objet
      if (!current[key] || typeof current[key] !== 'object' || Array.isArray(current[key])) {
        current[key] = {};
      }

      current = current[key];
    }

    // Assigner la valeur à la dernière clé
    const lastKey = keys[keys.length - 1];
    current[lastKey] = item.value;
  }

  return result;
}

const unflattenedData = unflatten(flatData);
console.log(JSON.stringify(unflattenedData, null, 2));
