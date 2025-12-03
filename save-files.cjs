const fs = require("fs");
const path = require("path");

// Root directory = SANITY-TESTS folder
const ROOT_DIR = __dirname;
const OUTPUT_FILE = path.join(ROOT_DIR, "all-files.txt");

// Directories we want to include
const ALLOWED_FOLDERS = ["fixtures", "pages", "tests"];

// Directories we want to skip completely
const IGNORE_DIRS = ["node_modules", "test-results"];

// Files we want to skip
const IGNORE_FILES = ["package-lock.json"];

// Clear output file
fs.writeFileSync(OUTPUT_FILE, "", "utf8");

// Explicitly include package.json first
const PACKAGE_JSON = path.join(ROOT_DIR, "package.json");
if (fs.existsSync(PACKAGE_JSON)) {
    const pkgContent = fs.readFileSync(PACKAGE_JSON, "utf8");
    fs.appendFileSync(
        OUTPUT_FILE,
        `\n\n===== FILE: package.json =====\n\n${pkgContent}\n`
    );
    console.log(`Saved: package.json`);
}

function scanAndSave(dir) {
    const items = fs.readdirSync(dir).sort(); // sorted for consistent order

    items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);

        // Skip node_modules, test-results, and unwanted files
        if (stats.isDirectory() && IGNORE_DIRS.includes(item)) return;
        if (stats.isFile() && IGNORE_FILES.includes(item)) return;

        if (stats.isDirectory()) {
            const relativeDir = path.relative(ROOT_DIR, fullPath);

            // Only scan inside intended folders or their children
            const isAllowed =
                ALLOWED_FOLDERS.some(folder =>
                    relativeDir === folder || relativeDir.startsWith(folder + path.sep)
                );

            if (isAllowed) scanAndSave(fullPath);

            return;
        }

        // Save only .js files
        if (stats.isFile() && item.endsWith(".js")) {
            const content = fs.readFileSync(fullPath, "utf8");

            const relativePath = path.relative(ROOT_DIR, fullPath);

            fs.appendFileSync(
                OUTPUT_FILE,
                `\n\n===== FILE: ${relativePath} =====\n\n${content}\n`
            );

            console.log(`Saved: ${relativePath}`);
        }
    });
}

scanAndSave(ROOT_DIR);

console.log("\nDone! All JavaScript files + package.json saved into all-files.txt");
