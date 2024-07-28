const quotes = [
  { text: "No pain no gain", category: "Motivation" },
  {
    text: "There is no shame in failure as long as one try one's best",
    category: "Inspiration",
  },
  {
    text: "A whole stack of memories never equal one little hope",
    category: "Hope",
  },
];

function showRandomQuote() {
  const randomandomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomandomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
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
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Your quote has been added");
}
