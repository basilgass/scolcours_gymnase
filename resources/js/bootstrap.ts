import axios from "axios"

window["axios"] = axios
window["axios"].defaults.headers.common["X-Requested-With"] = "XMLHttpRequest"
// Ajoute cette ligne pour activer l’envoi des cookies avec les requêtes
window["axios"].defaults.withCredentials = true
