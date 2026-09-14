import { test, expect } from "@playwright/test";
for (const width of [360,768,1440]) {
 test("portfolio ES/EN at " + width, async ({page})=>{
  await page.setViewportSize({width,height:900});
  const errors=[]; page.on("pageerror", error=>errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/content-ready/);
  await expect(page.locator("#project-stage article")).toHaveCount(8);
  await expect(page.locator("h1")).toContainText("full-stack junior");
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  if (width<=900) await page.locator("#nav-toggle").click();
  await page.locator("#lang-toggle").click();
  await expect(page.locator("html")).toHaveAttribute("lang","en");
  await expect(page.locator("#contact h2")).toHaveText("Contact");
  if (width<=900) await page.keyboard.press("Escape");
  await page.screenshot({path:"test-results/portfolio-"+width+".png",fullPage:true});
  expect(errors).toEqual([]);
 });
}
test("content remains readable when translations fail",async({page})=>{
 await page.route("**/assets/i18n/*.json",route=>route.abort());
 await page.goto("/");
 await expect(page.locator("h1")).toContainText("Sebastián");
 await expect(page.locator("#project-stage article")).toHaveCount(3);
 await expect(page.locator("#projects")).toBeVisible();
});
test("static links resolve and keyboard skip link works",async({page,request})=>{
 await page.goto("/");
 await page.keyboard.press("Tab");
 await expect(page.locator(".skip-link")).toBeFocused();
 await page.keyboard.press("Enter");
 await expect(page.locator("#main-content")).toBeFocused();
 const urls=await page.locator("a[href]").evaluateAll(links=>links.map(a=>a.getAttribute("href")));
 for(const href of urls){
   if(href.startsWith("#")){expect(await page.locator(href).count()).toBeGreaterThan(0);}
   else if(!/^(https?:|mailto:)/.test(href)){expect((await request.get(href)).ok()).toBeTruthy();}
 }
});
test("generate current CV PDFs",async({page})=>{
 for(const lang of ["ES","EN"]){
  await page.goto("/assets/cv/CV_"+lang+".html");
  await expect(page.locator("h1")).toHaveText("Sebastián Expósito Ruiz");
  await page.pdf({path:"assets/cv/CV_"+lang+".pdf",format:"A4",printBackground:true});
 }
});