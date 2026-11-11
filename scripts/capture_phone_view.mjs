import puppeteer from "puppeteer-core";
import path from "path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const outputDir = "C:\\Users\\PMLS\\.gemini\\antigravity\\brain\\2e0ee44a-adfd-4a12-b3ca-3ef1228778aa";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });

  await page.goto("http://localhost:3000/login", { waitUntil: "domcontentloaded", timeout: 15000 });
  await new Promise((r) => setTimeout(r, 600));

  const managerSession = {
    id: "usr-mgr-seaview",
    email: "manager.seaview@trifit.com",
    name: "Seaview General Manager",
    role: "BRANCH_MANAGER",
    branchId: "branch-seaview",
    branchName: "TRI FIT Seaview Flagship",
    branchCity: "Karachi",
  };
  await page.setCookie({
    name: "apollo_session",
    value: encodeURIComponent(JSON.stringify(managerSession)),
    domain: "localhost",
    path: "/",
  });

  await page.goto("http://localhost:3000/branch/winback", { waitUntil: "domcontentloaded", timeout: 15000 });
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("apollo-theme", "dark");
  });
  await new Promise((r) => setTimeout(r, 1000));

  // Scroll down so the phone mockup is centered in view
  await page.evaluate(() => {
    window.scrollBy(0, 480);
  });
  await new Promise((r) => setTimeout(r, 600));

  await page.screenshot({
    path: path.join(outputDir, "winback_phone_mockup_dark.png"),
    fullPage: false,
  });
  console.log("Captured winback_phone_mockup_dark.png");

  await browser.close();
}

run().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
