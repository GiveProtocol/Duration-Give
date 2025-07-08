// Enhanced search using Lunr.js
(function () {
  "use strict";

  /* global lunr */

  let searchIndex;
  let searchData;

  // Initialize search when DOM is ready
  document.addEventListener("DOMContentLoaded", function () {
    initializeSearch();
  });

  async function initializeSearch() {
    try {
      // Load search data
      const response = await fetch("/search.json");
      searchData = await response.json();

      // Build Lunr index
      searchIndex = lunr(function () {
        this.field("title", { boost: 10 });
        this.field("content", { boost: 5 });
        this.field("tags", { boost: 8 });
        this.field("category", { boost: 6 });
        this.field("url");
        this.ref("id");

        searchData.forEach(function (doc, idx) {
          doc.id = idx;
          this.add(doc);
        }, this);
      });

      // Set up search UI
      setupSearchUI();
    } catch (error) {
      console.warn("Search initialization failed:", error);
      // Fallback to simple search if Lunr fails
      initializeFallbackSearch();
    }
  }

  function setupSearchUI() {
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");
    const searchOverlay = document.getElementById("search-overlay");
    const closeSearch = document.getElementById("close-search");

    if (!searchInput || !searchResults) return;

    let searchTimeout;

    searchInput.addEventListener("input", function () {
      clearTimeout(searchTimeout);
      const query = this.value.trim();

      if (query.length === 0) {
        hideSearchResults();
        return;
      }

      // Debounce search
      searchTimeout = setTimeout(() => {
        performSearch(query);
      }, 200);
    });

    searchInput.addEventListener("focus", function () {
      if (this.value.trim() && searchResults.children.length > 0) {
        showSearchResults();
      }
    });

    // Close search overlay
    if (closeSearch) {
      closeSearch.addEventListener("click", hideSearchResults);
    }

    if (searchOverlay) {
      searchOverlay.addEventListener("click", function (e) {
        if (e.target === searchOverlay) {
          hideSearchResults();
        }
      });
    }

    // Keyboard navigation
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        hideSearchResults();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        navigateResults("down");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        navigateResults("up");
      } else if (e.key === "Enter") {
        e.preventDefault();
        activateSelectedResult();
      }
    });
  }

  function performSearch(query) {
    if (!searchIndex || !searchData) {
      return;
    }

    try {
      // Enhance query for better results
      const enhancedQuery = enhanceQuery(query);

      // Perform search
      const results = searchIndex.search(enhancedQuery);

      // Process and display results
      displaySearchResults(results, query);
    } catch (error) {
      console.warn("Search error:", error);
      // Fallback to simple string matching
      performFallbackSearch(query);
    }
  }

  function enhanceQuery(query) {
    // Add fuzzy matching and boost exact matches
    const terms = query.split(/\s+/).filter((term) => term.length > 0);

    return terms
      .map((term) => {
        if (term.length <= 3) {
          // Short terms: exact match only
          return term;
        } else {
          // Longer terms: exact match boosted + fuzzy match
          return `${term}^10 ${term}~1`;
        }
      })
      .join(" ");
  }

  function displaySearchResults(results, originalQuery) {
    const searchResultsContainer = document.getElementById("search-results");

    if (!searchResultsContainer) return;

    // Clear previous results
    searchResultsContainer.innerHTML = "";

    if (results.length === 0) {
      searchResultsContainer.innerHTML = `
        <div class="search-no-results">
          <div class="no-results-icon">
            <i class="lucide-search-x"></i>
          </div>
          <div class="no-results-text">
            <h3>No results found</h3>
            <p>Try different keywords or check your spelling</p>
          </div>
        </div>
      `;
    } else {
      const resultsHTML = results
        .slice(0, 8)
        .map((result, index) => {
          const doc = searchData[result.ref];
          const highlighted = highlightSearchTerms(doc, originalQuery);

          return `
          <div class="search-result" data-index="${index}">
            <a href="${doc.url}" class="result-link">
              <div class="result-header">
                <div class="result-title">${highlighted.title}</div>
                ${doc.category ? `<div class="result-category">${doc.category}</div>` : ""}
              </div>
              <div class="result-excerpt">${highlighted.content}</div>
              <div class="result-meta">
                <span class="result-score">Relevance: ${Math.round(result.score * 100)}%</span>
              </div>
            </a>
          </div>
        `;
        })
        .join("");

      searchResultsContainer.innerHTML = resultsHTML;
    }

    showSearchResults();
  }

  function highlightSearchTerms(doc, query) {
    const terms = query
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 1);

    let highlightedTitle = doc.title;
    let highlightedContent = doc.content.substring(0, 200) + "...";

    terms.forEach((term) => {
      const regex = new RegExp(`(${escapeRegex(term)})`, "gi");
      highlightedTitle = highlightedTitle.replace(regex, "<mark>$1</mark>");
      highlightedContent = highlightedContent.replace(regex, "<mark>$1</mark>");
    });

    return {
      title: highlightedTitle,
      content: highlightedContent,
    };
  }

  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function showSearchResults() {
    const searchOverlay = document.getElementById("search-overlay");
    if (searchOverlay) {
      searchOverlay.classList.add("active");
    }
  }

  function hideSearchResults() {
    const searchOverlay = document.getElementById("search-overlay");
    const searchInput = document.getElementById("search-input");

    if (searchOverlay) {
      searchOverlay.classList.remove("active");
    }

    if (searchInput) {
      searchInput.value = "";
    }
  }

  function navigateResults(direction) {
    const results = document.querySelectorAll(".search-result");
    const currentSelected = document.querySelector(".search-result.selected");

    if (results.length === 0) return;

    let newIndex = 0;
    if (currentSelected) {
      currentSelected.classList.remove("selected");
      const currentIndex = parseInt(currentSelected.dataset.index);

      if (direction === "down") {
        newIndex = (currentIndex + 1) % results.length;
      } else {
        newIndex = currentIndex === 0 ? results.length - 1 : currentIndex - 1;
      }
    }

    results[newIndex].classList.add("selected");
    results[newIndex].scrollIntoView({ block: "nearest" });
  }

  function activateSelectedResult() {
    const selected = document.querySelector(
      ".search-result.selected .result-link",
    );
    if (selected) {
      selected.click();
    } else {
      const firstResult = document.querySelector(".search-result .result-link");
      if (firstResult) {
        firstResult.click();
      }
    }
  }

  function performFallbackSearch(query) {
    const results = searchData.filter((doc) => {
      const searchText = (
        doc.title +
        " " +
        doc.content +
        " " +
        (doc.tags || "")
      ).toLowerCase();
      return searchText.includes(query.toLowerCase());
    });

    displayFallbackResults(results, query);
  }

  function displayFallbackResults(results, _query) {
    const searchResultsContainer = document.getElementById("search-results");
    if (!searchResultsContainer) return;

    searchResultsContainer.innerHTML = "";

    if (results.length === 0) {
      searchResultsContainer.innerHTML =
        '<div class="search-no-results">No results found</div>';
    } else {
      const resultsHTML = results
        .slice(0, 6)
        .map(
          (doc) => `
        <div class="search-result">
          <a href="${doc.url}" class="result-link">
            <div class="result-title">${doc.title}</div>
            <div class="result-excerpt">${doc.content.substring(0, 150)}...</div>
          </a>
        </div>
      `,
        )
        .join("");

      searchResultsContainer.innerHTML = resultsHTML;
    }

    showSearchResults();
  }

  function initializeFallbackSearch() {
    // Fallback to simple search if Lunr fails
    fetch("/search.json")
      .then((response) => response.json())
      .then((data) => {
        searchData = data;
        setupSearchUI();
      })
      .catch((error) => {
        console.error("Failed to load search data:", error);
      });
  }

  // Export for global use
  window.LunrSearch = {
    performSearch,
    hideSearchResults,
  };
})();
