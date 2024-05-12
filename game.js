//CODE JS POUR LE JEU SANS IMPLANTATION DU FORMULAIRE

// Variable globale pour stocker le film actuel
let currentMovie = null;

// Tableau pour stocker les messages à afficher en cas de mauvaise réponse
const failureMessages = [
    "Sorry, not even close !",
    "Really ? This is the best you can do ?",
    "No, come on, you're almost there !",
    "Humm, nope but keep trying !",
    "My four old year son already found the answer !"
    // Ajoutez autant de messages que vous le souhaitez
];

// Index pour suivre le prochain message à afficher
let failureMessageIndex = 0;

// Fonction pour nettoyer la réponse en supprimant les articles définis et indéfinis
function cleanResponse(response) {
    if (!response) {
        return "";
    }

    var articles = ["the", "a", "an", "le", "la", "les"];

    var lowercaseResponse = response.toLowerCase();
    var words = lowercaseResponse.split(" ");
    var filteredWords = words.filter(function(word) {
        return !articles.includes(word);
    });
    var cleanedResponse = filteredWords.join(" ");

    return cleanedResponse;
}

// Fonction pour récupérer les données de la base de données via Mongoose
const fetchData = async () => {
    try {
        // Envoyer une requête HTTP GET pour récupérer les données de la base de données
        const response = await fetch('//necibsamir:NnChXFhVjzY78lZm@cluster0.i1d1jkk.mongodb.net/'); // Remplacez /votre-endpoint par l'URL appropriée
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des données :', error);
        return [];
    }
};

// Fonction pour sélectionner un film aléatoire à partir de la liste de films
const selectRandomMovie = (films) => {
    const randomIndex = Math.floor(Math.random() * films.length);
    return films[randomIndex];
};

// Fonction pour afficher le film sélectionné sur la page
const displayRandomMovie = async () => {
    const films = await fetchData();
    if (films && films.length > 0) {
        currentMovie = selectRandomMovie(films);
        const filmImage = document.getElementById("filmImage");
        filmImage.src = currentMovie.screenshot;
        filmImage.alt = "nice try";
    } else {
        console.error('Aucun film trouvé.');
    }
};

// Appel de la fonction pour afficher un film aléatoire lorsque la page se charge
displayRandomMovie();

// Variable globale pour stocker l'index du dernier message d'échec affiché
let lastFailureMessageIndex = -1;

// Fonction pour vérifier la réponse de l'utilisateur
function checkGuess() {
    const guessInput = document.getElementById("guessInput");
    const resultMessage = document.getElementById("resultMessage");

    // Get the user's guess and clean it
    const userGuess = guessInput.value.trim();
    const cleanedUserGuess = cleanResponse(userGuess);

    // Clean the current movie title for comparison
    const cleanedFilmName = cleanResponse(currentMovie.title);

    // Check if the user's guess matches the current movie title
    if (cleanedUserGuess === cleanedFilmName) {
        resultMessage.textContent = "Hell yeah, you found the right answer. Come back tomorrow for a new movie";
        // Clear the image
        const filmImage = document.getElementById("filmImage");
        filmImage.src = "";
        filmImage.alt = "";
        // Hide the answer bar
        guessInput.style.display = "none";
        // Hide or remove the send button
        sendButton.style.display = "none"; // Hide the button
        // or sendButton.remove(); // Remove the button from the DOM

        // Reset the last failure message index
        lastFailureMessageIndex = -1;
    } else {
        let randomIndex;
        do {
            // Generate a random index for the failure message
            randomIndex = Math.floor(Math.random() * failureMessages.length);
        } while (randomIndex === lastFailureMessageIndex); // Keep generating until it's different from the last one

        // Update the last failure message index
        lastFailureMessageIndex = randomIndex;

        // Display the failure message
        resultMessage.textContent = failureMessages[randomIndex];

        // Clear the input field
        guessInput.value = "";
    }
}

// Fonction pour vérifier si la touche Entrée est enfoncée et appeler checkGuess() si c'est le cas
function checkEnter(event) {
    if (event.key === "Enter") {
        checkGuess();
    }
}
