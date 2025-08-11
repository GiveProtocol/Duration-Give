const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

// Function to recursively find all markdown files
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip hidden directories and node_modules
      if (
        !file.startsWith(".") &&
        file !== "node_modules" &&
        file !== "_site"
      ) {
        findMarkdownFiles(filePath, fileList);
      }
    } else if (
      file.endsWith(".md") &&
      !file.startsWith("test-") &&
      !file.includes("TEST_REPORT") &&
      !file.includes("README-SEARCH") &&
      !file.includes("DEPLOYMENT-CHECKLIST") &&
      !file.includes("SEARCH-ANALYTICS")
    ) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Function to generate search data
function generateSearchData() {
  const docsDir = __dirname;
  const markdownFiles = findMarkdownFiles(docsDir);
  const searchData = [];

  markdownFiles.forEach((filePath) => {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const parsed = matter(content);

      // Generate URL from file path
      let url = path
        .relative(docsDir, filePath)
        .replace(/index\.md$/, "")
        .replace(/\.md$/, "/")
        .replace(/\\/g, "/");

      // Ensure URL starts with /
      if (!url.startsWith("/")) {
        url = `/${url}`;
      }

      // Clean up double slashes
      url = url.replace(/\/+/g, "/");

      // Handle root index
      if (url === "/index/") {
        url = "/";
      }

      // Ensure trailing slash for directories
      if (!url.endsWith("/") && url !== "/") {
        url += "/";
      }

      const searchItem = {
        title: parsed.data.title || path.basename(filePath, ".md"),
        category: parsed.data.category || "Documentation",
        tags: parsed.data.tags || "",
        url,
        date: parsed.data.date || new Date().toISOString(),
        content: parsed.content.replace(/\n/g, " ").replace(/\s+/g, " ").trim(),
      };

      searchData.push(searchItem);
    } catch (error) {
      console.warn(`Warning: Could not process ${filePath}:`, error.message);
    }
  });

  return searchData;
}

// Generate and write search.json
try {
  const searchData = generateSearchData();
  const outputPath = path.join(__dirname, "search.json");

  fs.writeFileSync(outputPath, JSON.stringify(searchData, null, 2));

  console.log(`✅ Generated search.json with ${searchData.length} items`);
  console.log(`📁 Output: ${outputPath}`);

  // Show first few items for verification
  if (searchData.length > 0) {
    console.log("\n📋 Sample items:");
    searchData.slice(0, 3).forEach((item) => {
      console.log(`  - ${item.title} (${item.url})`);
    });
  }
} catch (error) {
  console.error("❌ Error generating search.json:", error.message);
  throw error;
}
