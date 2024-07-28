// const quotes = [
//   { text: "No pain no gain", category: "Motivation" },
//   {
//     text: "There is no shame in failure as long as one try one's best",
//     category: "Inspiration",
//   },
//   {
//     text: "A whole stack of memories never equal one little hope",
//     category: "Hope",
//   },
// ];
const quotes = JSON.parse(localStorage.getItem("storedQuotes") || "[]");
console.log(quotes.length);
//   {
//     text: "A whole stack of memories never equal one little hope",
//     category: "Hope",
//   },

const API_URL = "https://jsonplaceholder.typicode.com/posts";

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(API_URL);
    const serverQuotes = await response.json();
    return serverQuotes.map((quote) => ({
      text: quote.title,
      category: "Server",
    }));
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
    return [];
  }
}

// Function to sync quotes with the server
async function syncQuotesWithServer() {
  const serverQuotes = await fetchQuotesFromServer();

  const newQuotes = [
    ...serverQuotes,
    ...quotes.filter(
      (localQuote) =>
        !serverQuotes.some(
          (serverQuote) => serverQuote.text === localQuote.text
        )
    ),
  ];

  if (JSON.stringify(newQuotes) !== JSON.stringify(quotes)) {
    quotes.splice(0, quotes.length, ...newQuotes);
    localStorage.setItem("storedQuotes", JSON.stringify(quotes));
    populateCategories();
    showRandomQuote();
    showNotification("Quotes updated from the server.");
  }
}

// Function to start periodic sync
function startPeriodicSync() {
  setInterval(syncQuotesWithServer, 60000); // Fetch new quotes every 60 seconds
}

// Function to add a new quote to the server
async function addQuoteToServer(quote) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quote),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const newQuote = await response.json();
    return { text: newQuote.title, category: "Server" };
  } catch (error) {
    console.error("Error adding quote to server:", error);
    return null;
  }
}

// Example usage of addQuoteToServer function
async function addNewQuote(quote) {
  const newQuote = await addQuoteToServer(quote);
  if (newQuote) {
    quotes.push(newQuote);
    localStorage.setItem("storedQuotes", JSON.stringify(quotes));
    showNotification("New quote added to server and local storage.");
  }
}

// Call the startPeriodicSync function to begin periodic sync
startPeriodicSync();

// Existing functions remain unchanged
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
//
//starting the functions
function showRandomQuote() {
  const randomandomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomandomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  const quoteTextElement = document.createElement("p");
  quoteTextElement.textContent = quote.text;
  const quoteCategoryElement = document.createElement("p");
  quoteCategoryElement.innerHTML = `<em>${quote.category}</em>`;

  quoteDisplay.appendChild(quoteTextElement);
  quoteDisplay.appendChild(quoteCategoryElement);
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

function createAddQuoteForm() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document
    .getElementById("newQuoteCategory")
    .value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please enter both quote text and category.");
    return;
  }
  const newObj = { text: quoteText, category: quoteCategory };
  quotes.push(newObj);

  localStorage.setItem("storedQuotes", JSON.stringify(quotes));
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Your quote has been added");
}
document.getElementById("exportQuotes").addEventListener("click", exportQuotes);

function exportQuotes() {
  const quotesJSON = JSON.stringify(quotes, null, 2);
  const blob = new Blob([quotesJSON], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

function populateCategories() {
  const categories = [...new Set(quotes.map((quote) => quote.category))];
  const categoryFilter = document.getElementById("categoryFilter");

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Set the last selected category
  categoryFilter.value = lastSelectedCategory;
}

// Function to filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

// Function to filter the quotes array based on the selected category
function filterQuotesArray() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  if (selectedCategory === "all") {
    return quotes;
  }
  return quotes.filter((quote) => quote.category === selectedCategory);
}
// Function to show notifications
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
}

// Start periodic data sync
function startPeriodicSync() {
  setInterval(syncQuotesWithServer, 60000); // Fetch new quotes every 60 seconds
}
