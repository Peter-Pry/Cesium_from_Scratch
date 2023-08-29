import {generateTabbedDescription} from './utils.js';
import {getReverseGeocoding} from './reverseGeocoding.js';

export function LabelShowMouseHover(viewer) {
  let hoveredEntity = null;

  // Afficher le label de l'entité lorsque la souris passe sur l'entité
  viewer.screenSpaceEventHandler.setInputAction(function (movement) {
    const pickedObject = viewer.scene.pick(movement.endPosition);
    if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
      if (hoveredEntity !== pickedObject.id) {
        if (hoveredEntity !== null) {
          hoveredEntity.label.show = false;
        }
        hoveredEntity = pickedObject.id;
        hoveredEntity.label.show = true;
      }
    } else {
      if (hoveredEntity !== null) {
        hoveredEntity.label.show = false;
        hoveredEntity = null;
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  // Cacher le label de l'entité lorsque la souris quitte l'entité
  viewer.screenSpaceEventHandler.setInputAction(function (movement) {
    if (hoveredEntity !== null) {
      hoveredEntity.label.show = false;
      hoveredEntity = null;
    }
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
}

export function ToolTipMouseHover(viewer) {
  let tooltip = document.createElement("div");
  tooltip.className = "cesium-tooltip";
  document.body.appendChild(tooltip);

  viewer.canvas.addEventListener("mousemove", function (e) {
    var pickedObject = viewer.scene.pick(
      new Cesium.Cartesian2(e.clientX, e.clientY)
    );
    if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
      var entity = pickedObject.id;
      if (entity.label) {
        tooltip.style.display = "block";
        tooltip.style.left = e.clientX + 10 + "px";
        tooltip.style.top = e.clientY + 10 + "px";
        tooltip.textContent = entity.name;
      } else {
        tooltip.style.display = "none";
      }
    } else {
      tooltip.style.display = "none";
    }
  });
}

export function Leftclick(viewer) {
  let firstClickOnMap = false;

  // Ajoutez l'observateur ici
  viewer.selectedEntityChanged.addEventListener(function (newEntity) {
    if (
      previousSelectedEntity &&
      previousSelectedEntity.id === "Adresse du point"
    ) {
      viewer.entities.remove(previousSelectedEntity);
    }
    previousSelectedEntity = newEntity;
  });

  viewer.screenSpaceEventHandler.setInputAction(function (movement) {
    handleLeftClick(movement, viewer, firstClickOnMap)
      .then((result) => {
        firstClickOnMap = result;
      })
      .catch((error) => {
        console.error("Erreur lors du traitement du clic gauche:", error);
      });
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

let previousSelectedEntity = null;

async function handleLeftClick(movement, viewer, firstClickOnMap) {
  const pickedObject = viewer.scene.pick(movement.position);
  if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {


    const entity = pickedObject.id;

    // Si l'utilisateur clique sur la même entité une deuxième fois
    if (previousSelectedEntity === entity) {
        viewer.selectedEntity = undefined; // Fermez l'infobox
        previousSelectedEntity = null; // Réinitialisez la dernière entité sélectionnée
        return false;
    }
    

    viewer.selectedEntity = entity;
    previousSelectedEntity = entity; // Mettez à jour la dernière entité sélectionnée
    return false;



  } else {
    // Supprimez l'entité temporaire précédente si elle existe
    const tempEntityExists = viewer.entities.getById("Adresse du point");
    if (tempEntityExists) {
      viewer.entities.remove(tempEntityExists);
    }

    if (firstClickOnMap) {
      const cartesian = viewer.camera.pickEllipsoid(
        movement.position,
        viewer.scene.globe.ellipsoid
      );
      if (cartesian) {
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        const longitude = Cesium.Math.toDegrees(cartographic.longitude);
        const latitude = Cesium.Math.toDegrees(cartographic.latitude);
        const addressInfo = await getReverseGeocoding(latitude, longitude);


        // Créez une entité temporaire avec un point rouge
        const tempEntity = new Cesium.Entity({
            id: "Adresse du point",
            position: cartesian,
            description: addressInfo,
            point: { // Ajoutez cette propriété pour le point rouge
                pixelSize: 10, // Taille du point
                color: Cesium.Color.RED, // Couleur du point
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND // Fixez le point au sol
            }
        });


        viewer.entities.add(tempEntity);
        viewer.selectedEntity = tempEntity;
      }
      return false;
    } else {
      viewer.selectedEntity = undefined;
      return true;
    }
  }
}




  