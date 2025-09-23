window.addEventListener("DOMContentLoaded", () => {
  // Get the category from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category") || "Trending"; // default Trending

  // Find the filter div containing that category
  const filters = document.querySelectorAll(".filter");
  filters.forEach((filter) => {
    const link = filter.querySelector("a");
    if (link && link.textContent.trim() === category) {
      filter.classList.add("active");
    } else {
      filter.classList.remove("active");
    }
  });
});
