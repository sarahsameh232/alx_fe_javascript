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
