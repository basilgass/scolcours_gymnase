import axios from "axios"

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest"
// Ajoute cette ligne pour activer l’envoi des cookies avec les requêtes
axios.defaults.withCredentials = true
