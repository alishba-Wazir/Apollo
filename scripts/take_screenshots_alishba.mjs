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

  // 1. Trainer Copilot with Alishba's Draft Message Modal
  await page.goto("http://localhost:3000/pro", { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  });
  await new Promise((r) => setTimeout(r, 600));

  // Click "Draft Message" on Alishba's card
  await page.evaluate(() => {
    const draftBtns = Array.from(document.querySelectorAll("button")).filter(
      (b) => b.textContent && b.textContent.includes("Draft Message")
    );
    if (draftBtns.length > 0) draftBtns[0].click(); // Alishba is the first card
  });
  await new Promise((r) => setTimeout(r, 800));

  await page.screenshot({
    path: path.join(outputDir, "alishba_pro_draft_whatsapp.png"),
    fullPage: false,
  });
  console.log("Captured alishba_pro_draft_whatsapp.png");

  // 2. COMMAND Hub Integration Connectors showing Alishba 03255439748
  await page.goto("http://localhost:3000/command/brain", { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  });
  await new Promise((r) => setTimeout(r, 600));

  // Click Integration Connectors tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const connBtn = btns.find((b) => b.textContent && b.textContent.includes("Integration Connectors"));
    if (connBtn) connBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  await page.screenshot({
    path: path.join(outputDir, "alishba_command_connectors.png"),
    fullPage: false,
  });
  console.log("Captured alishba_command_connectors.png");

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
