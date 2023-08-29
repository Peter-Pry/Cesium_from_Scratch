function createSearchModule(
  viewer,
  addressInputId,
  searchButtonId,
  geocodinServiceId
) {
  const addressInput = document.getElementById(addressInputId);
  const searchButton = document.getElementById(searchButtonId);
  const geocodingService = document.getElementById(geocodinServiceId);
  const resultsContainer = document.createElement("div");
  resultsContainer.classList.add("results-container");
  addressInput.parentNode.insertBefore(
    resultsContainer,
    addressInput.nextSibling
  );
  let currentEntity = null;

  // Fonction pure pour récupérer les résultats de recherche
  async function getSearchResults(query, service) {
    let url;
    if (service === "ban") {
      url = `https://api-adresse.data.gouv.fr/search/?q=${query}&limit=5`;
    } else if (service === "nominatim") {
      url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`;
    }

    const response = await fetch(url);
    //console.log(response);
    return response.json();
  }

  // Fonction pure pour mettre à jour le conteneur de résultats
  function updateResultsContainer(
    data,
    service,
    resultsContainer,
    addressInput,
    viewer
  ) {
    resultsContainer.innerHTML = "";

    // Déterminez les éléments à afficher en fonction du service utilisé
    let items = [];
    if (service === "ban") {
      items = data.features;
    } else if (service === "nominatim") {
      items = data;
    }

    items.forEach((item) => {
      const resultItem = document.createElement("div");
      resultItem.classList.add("result-item");

      // Récupérez le label et les coordonnées en fonction du service
      let label, coordinates;
      if (service === "ban") {
        label = item.properties.label;
        coordinates = item.geometry.coordinates;
      } else if (service === "nominatim") {
        label = item.display_name;
        coordinates = [parseFloat(item.lon), parseFloat(item.lat)];
      }

      resultItem.textContent = label;

      // Lorsque vous cliquez sur un élément de résultat
      resultItem.addEventListener("click", () => {
        addressInput.value = label;
        resultsContainer.innerHTML = ""; // Videz les résultats après la sélection

        // Déclenchez le déplacement (flyto) vers ces coordonnées
        currentEntity = updateViewerWithCoordinates(
          viewer,
          coordinates,
          currentEntity
        );
      });

      resultsContainer.appendChild(resultItem);
    });
  }

  // Utilisez les fonctions dans vos gestionnaires d'événements
  addressInput.addEventListener("input", async () => {
    const query = addressInput.value;
    const service = geocodingService.value;

    if (query.length > 2) {
      const data = await getSearchResults(query, service);
      updateResultsContainer(
        data,
        service,
        resultsContainer,
        addressInput,
        viewer
      );
    } else {
      resultsContainer.innerHTML = "";
    }
  });

  // Fonction pure pour récupérer les coordonnées d'une adresse
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

  // Fonction pure pour mettre à jour le viewer avec les coordonnées
  function updateViewerWithCoordinates(viewer, coordinates, currentEntity) {
    // Supprimez l'entité précédente si elle existe
    if (currentEntity) {
      viewer.entities.remove(currentEntity);
    }

    // Utilisez viewer.camera.flyTo pour déplacer la caméra
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        coordinates[0],
        coordinates[1],
        1000
      ),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        roll: 0.0,
      },
    });

    // Ajoutez une nouvelle entité et retournez-la
    return viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1]),
      point: {
        pixelSize: 10,
        color: Cesium.Color.RED,
      },
    });
  }

  // Lorsque le bouton de recherche est cliqué
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
      currentEntity = updateViewerWithCoordinates(
        viewer,
        coordinates,
        currentEntity
      );
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

export default createSearchModule;
