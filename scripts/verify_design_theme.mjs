import puppeteer from "puppeteer-core";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACT_DIR = "C:\\Users\\PMLS\\.gemini\\antigravity\\brain\\b7f34194-b73c-4708-ab75-df2efc448e49";

const pagesToVerify = [
  { url: "http://localhost:3000/admin/finance", name: "finance" },
  { url: "http://localhost:3000/admin/brain", name: "brain" },
  { url: "http://localhost:3000/admin/settings", name: "settings" },
  { url: "http://localhost:3000/admin/kiosks", name: "kiosks" },
  { url: "http://localhost:3000/admin/staff/trainer-1", name: "staff_dossier" },
];

async function capture() {
  console.log("Launching local Chrome via puppeteer-core to verify DESIGN.md across themes...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  for (const pageItem of pagesToVerify) {
    // 1. Dark Mode
    await page.goto(pageItem.url, { waitUntil: "networkidle0" });
    await page.evaluate(() => {
      localStorage.setItem("apollo-theme", "theme-dark");
      localStorage.setItem("apollo_admin_theme", "theme-dark");
      document.documentElement.classList.remove("theme-light");
      document.documentElement.classList.add("theme-dark");
      document.documentElement.setAttribute("data-theme", "dark");
    });
    await new Promise((r) => setTimeout(r, 800));
    const destDark = path.join(ARTIFACT_DIR, `shot-${pageItem.name}-dark-verified.png`);
    await page.screenshot({ path: destDark, fullPage: false });
    console.log(`Saved Dark: ${destDark}`);

    // 2. Light Mode
    await page.evaluate(() => {
      localStorage.setItem("apollo-theme", "theme-light");
      localStorage.setItem("apollo_admin_theme", "theme-light");
      document.documentElement.classList.remove("theme-dark");
      document.documentElement.classList.add("theme-light");
      document.documentElement.setAttribute("data-theme", "light");
    });
    await new Promise((r) => setTimeout(r, 800));
    const destLight = path.join(ARTIFACT_DIR, `shot-${pageItem.name}-light-verified.png`);
    await page.screenshot({ path: destLight, fullPage: false });
    console.log(`Saved Light: ${destLight}`);
  }

  await browser.close();
  console.log("All visual theme verification screenshots captured successfully!");
}

capture().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
