export function checkUrlAccessibility(url) {
  return fetch(url, {
    method: "HEAD",
    mode: "cors",
    headers: {
      "Access-Control-Allow-Origin": "*",
      // Ajoutez d'autres en-têtes CORS si nécessaire
    },
  })
    .then((response) => {
      return response.ok; // Renvoie true si le statut est 200-299, sinon false
    })
    .catch((error) => {
      return false; // En cas d'erreur, renvoie false
    });
}
