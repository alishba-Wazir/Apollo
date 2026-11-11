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
  await page.setViewport({ width: 1440, height: 1050 });

  // 1. Admin Portal without top navbar, with increasing animated counters & charts
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

  console.log("Navigating to /admin (verifying no top navbar & animated numbers)...");
  await page.goto("http://localhost:3000/admin", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1600)); // allow numbers and charts to animate up
  await page.screenshot({
    path: path.join(outputDir, "phase2_admin_network_no_navbar.png"),
    fullPage: false,
  });
  console.log("Captured phase2_admin_network_no_navbar.png");

  // 2. Phase 2 Data Sync Engine
  console.log("Navigating to /admin/sync (Phase 2 Data Sync)...");
  await page.goto("http://localhost:3000/admin/sync", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({
    path: path.join(outputDir, "phase2_data_sync_engine.png"),
    fullPage: false,
  });
  console.log("Captured phase2_data_sync_engine.png");

  // 3. Branch Manager without top navbar
  console.log("Setting Branch Manager cookie...");
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

  console.log("Navigating to /branch/today (verifying no top navbar)...");
  await page.goto("http://localhost:3000/branch/today", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({
    path: path.join(outputDir, "phase2_branch_today_no_navbar.png"),
    fullPage: false,
  });
  console.log("Captured phase2_branch_today_no_navbar.png");

  await browser.close();
  console.log("All Phase 2 screenshots successfully captured!");
}

run().catch((err) => {
  console.error("Phase 2 screenshot error:", err);
  process.exit(1);
});
