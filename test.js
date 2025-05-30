function flattenObject(obj, prefix = '') {
  const result = {};
  
  function flatten(obj, prefix) {
    for (const key of Object.keys(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        flatten(obj[key], newKey);
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  
  flatten(obj, prefix);
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
const flattened = flattenObject(jsonData);

// Output the result
console.log(flattened);

//for (const key in jsonData) {
//  console.log(jsonData.hasOwnProperty(key));
//}

// console.log(typeof null);