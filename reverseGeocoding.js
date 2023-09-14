/**
 * Récupère l'adresse correspondant à une paire de coordonnées (latitude, longitude) en utilisant le service de géocodage inverse de Nominatim.
 *
 * @param {number} latitude - La latitude du point d'intérêt.
 * @param {number} longitude - La longitude du point d'intérêt.
 * @returns {Promise<string>} Une promesse qui renvoie une description formatée de l'adresse ou rejette une erreur.
 */
export function getReverseGeocoding(latitude, longitude) {
  return new Promise((resolve, reject) => {
    // Construction de l'URL pour le service de géocodage inverse de Nominatim
    //const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
    const url = `https://wxs.ign.fr/essentiels/geoportail/geocodage/rest/0.1/reverse?lat=${latitude}&lon=${longitude}&limit=1`;

    // Effectue une requête au service de géocodage inverse
    fetch(url)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        console.log(data);
        // Vérifie si une adresse a été trouvée
        if (data && data.features[0]) {
          const address = data.features[0].properties;
          // Construction de la description de l'adresse
          let description = `<strong>Adresse complète :</strong> ${address.label}<br>`;
          if (address.housenumber) description += `<strong>Numéro :</strong> ${address.housenumber}<br>`;
          if (address.street) description += `<strong>Rue :</strong> ${address.street}<br>`;
          if (address.city) description += `<strong>Ville :</strong> ${address.city}<br>`;
          if (address.postcode) description += `<strong>Code postal :</strong> ${address.postcode}<br>`;
          if (address.country) description += `<strong>Pays :</strong> ${address.country}<br>`;
          description += `<strong>Latitude :</strong> ${latitude.toFixed(6)}<br>`;
          description += `<strong>Longitude :</strong> ${longitude.toFixed(6)}`;
          // Résout la promesse avec la description de l'adresse
          resolve(description);
        } else {
          // Rejette la promesse si aucune adresse n'a été trouvée
          reject("Adresse non trouvée");
        }
      })
      .catch((error) => {
        // Rejette la promesse en cas d'erreur lors de la requête
        reject(error);
      });
  });
}
