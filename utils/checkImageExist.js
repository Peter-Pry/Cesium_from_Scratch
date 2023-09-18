// Fonction pour vérifier si une image existe à l'URL donnée
export function checkImageExist(url) {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.onload = function () {
      resolve(true);
    };
    img.onerror = function () {
      resolve(false);
    };
    img.src = url;
  });
}
