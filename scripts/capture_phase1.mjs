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
  await page.setViewport({ width: 1440, height: 950 });

  // 1. Login Screen
  console.log("Navigating to /login...");
  await page.goto("http://localhost:3000/login", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(outputDir, "phase1_login.png"),
    fullPage: false,
  });
  console.log("Captured phase1_login.png");

  // 2. Set Admin Cookie
  console.log("Setting Admin session cookie...");
  const adminSession = {
    id: "usr-admin-01",
    email: "admin@trifit.com",
    name: "TriFit Lead Admin",
    role: "ADMIN",
    branchId: null,
    branchName: "All Branches (Network-Wide)",
    branchCity: "Karachi & Islamabad",
  };
  await page.setCookie({
    name: "apollo_session",
    value: encodeURIComponent(JSON.stringify(adminSession)),
    domain: "localhost",
    path: "/",
  });

  // 3. Admin Network Overview
  console.log("Navigating to /admin...");
  await page.goto("http://localhost:3000/admin", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({
    path: path.join(outputDir, "phase1_admin_network.png"),
    fullPage: false,
  });
  console.log("Captured phase1_admin_network.png");

  // 4. Admin Settings & Audit Log
  console.log("Navigating to /admin/audit...");
  await page.goto("http://localhost:3000/admin/audit", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({
    path: path.join(outputDir, "phase1_admin_audit.png"),
    fullPage: false,
  });
  console.log("Captured phase1_admin_audit.png");

  // 5. Set Branch Manager (Seaview) Cookie
  console.log("Setting Branch Manager (Seaview) session cookie...");
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

  // 6. Branch Manager Today Dashboard
  console.log("Navigating to /branch/today...");
  await page.goto("http://localhost:3000/branch/today", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({
    path: path.join(outputDir, "phase1_branch_today.png"),
    fullPage: false,
  });
  console.log("Captured phase1_branch_today.png");

  // 7. Branch Manager Win-back AI Screen
  console.log("Navigating to /branch/winback...");
  await page.goto("http://localhost:3000/branch/winback", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({
    path: path.join(outputDir, "phase1_branch_winback.png"),
    fullPage: false,
  });
  console.log("Captured phase1_branch_winback.png");

  await browser.close();
  console.log("All screenshots successfully captured!");
}

run().catch((err) => {
  console.error("Screenshot error:", err);
  process.exit(1);
});
