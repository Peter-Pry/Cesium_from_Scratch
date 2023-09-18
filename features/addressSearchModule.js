import { capitalizeFirstLetterOfEachWord } from "../utils/capitalizeFirstLetterOfEachWord.js";

/**
 * Fonction pour ajouter un module de recherche d'adresse avec des options de géocodage configurables.
 * @param {Object} viewer - L'instance du viewer Cesium.
 * @param {string} containerId - L'ID du conteneur DOM où le module de recherche sera ajouté.
 * @param {Object} [options={}] - Les options de configuration pour le module de recherche.
 * @param {Array} [options.geocodingServices] - Les services de géocodage disponibles pour la recherche.
 * @returns {Object} - Un ensemble de fonctions utilitaires liées au module de recherche.
 */
export default function addSearchModule(viewer, containerId, options = {}) {
  // Initialisation des éléments du DOM
  const container = document.getElementById(containerId);
  const addressInput = document.createElement("input");
  const searchButton = document.createElement("button");
  const geocodingService = document.createElement("select");
  const resultsContainer = document.createElement("div");

  // Configuration des éléments du DOM
  addressInput.placeholder = "Entrez une adresse...";
  searchButton.textContent = "Rechercher";
  resultsContainer.classList.add("adress-search-results-container");

  // Ajout des options de géocodage configurables
  const geocodingServices = options.geocodingServices || [
    { value: "ban", text: "BAN (Base Adresse Nationale)" },
    { value: "nominatim", text: "Nominatim (OpenStreetMap)" },
    { value: "ign", text: "IGN Autocomplétion" }, // Ajout du service IGN AutoComplétion
    //{ value: "ign_search", text: "IGN Classique Search" },
  ];

  geocodingServices.forEach((service) => {
    const option = document.createElement("option");
    option.value = service.value;
    option.textContent = service.text;
    geocodingService.appendChild(option);
  });

  // Ajout des éléments au conteneur
  container.appendChild(addressInput);
  container.appendChild(geocodingService);
  container.appendChild(searchButton);
  container.appendChild(resultsContainer);

  // Fonction pour vérifier si un élément est en dehors de la zone de recherche et du bouton de recherche
  function isOutsideSearchZone(target) {
    return target !== addressInput && target !== searchButton && target !== geocodingService && !resultsContainer.contains(target);
  }

  // Gestionnaire d'événements pour le clic en dehors de la zone de recherche
  document.addEventListener("click", function (event) {
    if (isOutsideSearchZone(event.target)) {
      // Réinitialisez la recherche
      addressInput.value = "";
      resultsContainer.innerHTML = "";
    }
  });

  let currentEntity = null;

  /**
   * Récupère les résultats de recherche d'une adresse.
   *
   * @param {string} query - La requête de recherche.
   * @param {string} service - Le service de géocodage à utiliser ("ban" ou "nominatim").
   * @returns {Promise<Object>} - Les résultats de la recherche.
   */
  async function getSearchResults(query, service) {
    let url;
    if (service === "ban") {
      url = `https://api-adresse.data.gouv.fr/search/?q=${query}&limit=5`;
    } else if (service === "nominatim") {
      url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`;
    } else if (service === "ign") {
      url = `https://wxs.ign.fr/essentiels/geoportail/geocodage/rest/0.1/completion?text=${query}&terr=06&maximumResponses=5`; // URL du service IGN
    } else if (service === "ign_search") {
      url = `https://wxs.ign.fr/essentiels/geoportail/geocodage/rest/0.1/search?q=${query}&index=poi,address&limit=5&city=antibes`;
    }

    const response = await fetch(url);
    //console.log(response);
    return response.json();
  }

  /**
   * Met à jour le conteneur de résultats avec les données de recherche.
   *
   * @param {Object} data - Les données de recherche.
   * @param {string} service - Le service de géocodage utilisé.
   * @param {HTMLElement} resultsContainer - Le conteneur de résultats.
   * @param {HTMLInputElement} addressInput - L'élément input pour l'adresse.
   * @param {Object} viewer - L'instance du viewer Cesium.
   */
  function updateResultsContainer(data, service, resultsContainer, addressInput, viewer) {
    resultsContainer.innerHTML = "";

    // Déterminez les éléments à afficher en fonction du service utilisé
    let items = [];
    if (service === "ban") {
      items = data.features;
    } else if (service === "nominatim") {
      items = data;
    } else if (service === "ign") {
      items = data.results; // Traitement des résultats IGN
    } else if (service === "ign_search") {
      items = data.features; // Traitement des résultats IGN
    }

    items.forEach((item) => {
      const resultItem = document.createElement("div");
      resultItem.classList.add("adress-search-result-item");

      // Récupérez le label et les coordonnées en fonction du service
      let label, coordinates;
      if (service === "ban") {
        label = item.properties.label;
        coordinates = item.geometry.coordinates;
      } else if (service === "nominatim") {
        label = item.display_name;
        coordinates = [parseFloat(item.lon), parseFloat(item.lat)];
      } else if (service === "ign") {
        label = capitalizeFirstLetterOfEachWord(item.fulltext); // Utilisez la propriété "fulltext" pour le label
        //label = item.fulltext; // Utilisez la propriété "fulltext" pour le label
        coordinates = [item.x, item.y]; // Utilisez les propriétés "x" et "y" pour les coordonnées
      } else if (service === "ign_search") {
        label = item.label; // Utilisez la propriété "fulltext" pour le label
        //label = item.fulltext; // Utilisez la propriété "fulltext" pour le label
        coordinates = [item.x, item.y]; // Utilisez les propriétés "x" et "y" pour les coordonnées
      }

      resultItem.textContent = label;

      // Lorsque vous cliquez sur un élément de résultat
      resultItem.addEventListener("click", () => {
        addressInput.value = label;
        resultsContainer.innerHTML = ""; // Videz les résultats après la sélection

        // Créez une description à partir des données d'adresse
        const entityDescription = createDescriptionFromAddressData(item, service);

        // Déclenchez le déplacement (flyto) vers ces coordonnées
        currentEntity = updateViewerWithCoordinates(
          viewer,
          coordinates,
          currentEntity,
          entityDescription // Passez la description ici
        );
      });

      resultsContainer.appendChild(resultItem);
    });
  }

  // Gestionnaire d'événements pour la saisie de l'adresse
  addressInput.addEventListener("input", async () => {
    const query = addressInput.value;
    const service = geocodingService.value;

    if (query.length > 2) {
      const data = await getSearchResults(query, service);
      updateResultsContainer(data, service, resultsContainer, addressInput, viewer);
    } else {
      resultsContainer.innerHTML = "";
    }
  });

  /**
   * Récupère les coordonnées d'une adresse.
   *
   * @param {string} address - L'adresse à rechercher.
   * @param {string} service - Le service de géocodage à utiliser.
   * @returns {Promise<Array>} - Les coordonnées [longitude, latitude].
   */
  async function getCoordinatesFromAddress(address, service) {
    let url, data;

    if (service === "ban") {
      url = `https://api-adresse.data.gouv.fr/search/?q=${address}`;
      const response = await fetch(url);
      data = await response.json();

      if (data.features && data.features.length > 0) {
        return data.features[0].geometry.coordinates;
      }
    } else if (service === "nominatim") {
      url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;
      const response = await fetch(url);
      data = await response.json();

      if (data.length > 0) {
        return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
      }
    }

    return null;
  }

  /**
   * Met à jour le viewer Cesium avec les coordonnées fournies.
   *
   * @param {Object} viewer - L'instance du viewer Cesium.
   * @param {Array} coordinates - Les coordonnées [longitude, latitude].
   * @param {Object} currentEntity - L'entité actuellement affichée.
   * @returns {Object} - La nouvelle entité ajoutée.
   */
  function updateViewerWithCoordinates(viewer, coordinates, currentEntity, description) {
    // Supprimez l'entité précédente si elle existe
    if (currentEntity) {
      viewer.entities.remove(currentEntity);
    }

    // Utilisez viewer.camera.flyTo pour déplacer la caméra
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1], 1000),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        roll: 0.0,
      },
    });

    // Ajoutez une nouvelle entité et retournez-la
    // Ajoutez une nouvelle entité et retournez-la
    return viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1]),
      point: {
        pixelSize: 10,
        color: Cesium.Color.RED,
      },
      description: description, // Utilisez la description ici
      name: "Adresse recherchée",
      id: "SearchAddressEntity",
    });
  }

  // Gestionnaire d'événements pour le bouton de recherche
  searchButton.addEventListener("click", async () => {
    const address = addressInput.value;
    const service = geocodingService.value; // Obtenez le service choisi
    const data = await getSearchResults(address, service);

    let coordinates;

    if (service === "ban" && data.features.length > 0) {
      coordinates = data.features[0].geometry.coordinates;
    } else if (service === "nominatim" && data.length > 0) {
      coordinates = [parseFloat(data[0].lon), parseFloat(data[0].lat)];
    }

    if (coordinates) {
      currentEntity = updateViewerWithCoordinates(viewer, coordinates, currentEntity);
    } else {
      console.log("Aucun résultat de géocodage trouvé.");
    }
  });

  return {
    getSearchResults,
    updateResultsContainer,
    getCoordinatesFromAddress,
    updateViewerWithCoordinates,
  };
}

// Fonction pour créer une description à partir des données d'adresse
function createDescriptionFromAddressData(item, service) {
  let description = "";
  if (service === "ban") {
    description += `${item.properties.label}<br>`;
    // Vous pouvez ajouter d'autres champs si nécessaire
  } else if (service === "nominatim") {
    description += `${item.display_name}<br>`;
    // Vous pouvez ajouter d'autres champs si nécessaire
  }
  return description;
}
