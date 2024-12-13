async function performWebSearch(query) {
  // This is a mock. Integrate with a real API (e.g., Bing Search API) if desired.
  // For now, return a mock result.
  return [{ title: `Info about ${query}`, snippet: "Mock search data." }];
}

module.exports = { performWebSearch };
