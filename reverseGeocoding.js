export function getReverseGeocoding(latitude, longitude) {
    return new Promise((resolve, reject) => {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.display_name) {
            const address = data.address;
            let description = `<strong>Adresse :</strong> ${data.display_name}<br>`;
            if (address.road) description += `<strong>Rue :</strong> ${address.road}<br>`;
            if (address.city) description += `<strong>Ville :</strong> ${address.city}<br>`;
            if (address.postcode) description += `<strong>Code postal :</strong> ${address.postcode}<br>`;
            if (address.country) description += `<strong>Pays :</strong> ${address.country}<br>`;
            description += `<strong>Latitude :</strong> ${latitude.toFixed(6)}<br>`;
            description += `<strong>Longitude :</strong> ${longitude.toFixed(6)}`;
            resolve(description);
          } else {
            reject("Adresse non trouvée");
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }