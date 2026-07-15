import path from "node:path";
import { pathToFileURL } from "node:url";
import * as cheerio from "cheerio";
import { BASE_URL, OUTPUT_DIR, absoluteUrl, fetchTextWithRetry, writeJson } from "./lib.mjs";

function linkInfo($, a, baseUrl) {
  const label = a.find(".submenu__item_text").first().text().trim() || a.text().trim();
  const href = a.attr("href");
  return { label, href: href && href !== "#" ? absoluteUrl(baseUrl, href) : null };
}

// A megamenu is either a flat list of links (".single" wrappers, e.g. "Brands")
// or grouped under headers (".megamenu-childs__container", e.g. "Fragrance").
function parseMegamenu($, megaLi, baseUrl) {
  const content = megaLi.find(".megamenu-container_content__html").first();

  const groups = content.children(".megamenu-childs__container");
  if (groups.length > 0) {
    return groups.toArray().map((groupEl) => {
      const group = $(groupEl);
      const header = group.find("> a.megamenu-item").first();
      const label = header.find(".submenu__item_text").first().text().trim();
      const href = header.attr("href");
      const children = group
        .find("li.megamenu-grandchild > a")
        .toArray()
        .map((a) => linkInfo($, $(a), baseUrl));
      return { label, href: href && href !== "#" ? absoluteUrl(baseUrl, href) : null, children };
    });
  }

  const singles = content.children(".single");
  return singles.toArray().map((singleEl) => linkInfo($, $(singleEl).find("a").first(), baseUrl));
}

export async function scrapeNavigation({ baseUrl = BASE_URL } = {}) {
  console.log("[navigation] fetching homepage HTML...");
  const result = await fetchTextWithRetry(`${baseUrl}/`);

  if (!result.ok) {
    console.error(`[navigation] failed after retries: ${result.error}`);
    const output = {
      source: `${baseUrl}/`,
      scrapedAt: new Date().toISOString(),
      totalItems: 0,
      error: result.error,
      items: [],
    };
    await writeJson(path.join(OUTPUT_DIR, "navigation.json"), output);
    return { total: 0, error: result.error };
  }

  const $ = cheerio.load(result.data);
  const nav = $("nav.desktop-main-menu").first();
  const topLevelLis = nav.find("> ul.list-menu--inline > li").toArray();

  const items = [];
  for (const el of topLevelLis) {
    const li = $(el);
    // Megamenu content lives in a sibling <li id="mega_menu_...">, already
    // consumed when we processed the preceding label <li> - skip it here.
    if ((li.attr("id") || "").startsWith("mega_menu_")) continue;

    const link = li.find("> a").first();
    const label = link.find(".submenu__item_text, span").first().text().trim() || link.text().trim();
    const href = link.attr("href");
    const classes = li.attr("class") || "";

    let children = [];
    if (classes.includes("submenu--megamenu")) {
      const megaLi = li.next('li[id^="mega_menu_"]');
      children = parseMegamenu($, megaLi, baseUrl);
    } else if (classes.includes("submenu-container")) {
      children = li
        .find("div.submenu-design__simple li > a.submenu__item")
        .toArray()
        .map((a) => linkInfo($, $(a), baseUrl));
    }

    items.push({
      label,
      href: href && href !== "#" ? absoluteUrl(baseUrl, href) : null,
      children,
    });
  }

  const output = {
    source: `${baseUrl}/`,
    scrapedAt: new Date().toISOString(),
    totalItems: items.length,
    items,
  };

  await writeJson(path.join(OUTPUT_DIR, "navigation.json"), output);
  console.log(`[navigation] saved ${items.length} top-level nav items to data/scraped/navigation.json`);

  return { total: items.length };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  scrapeNavigation()
    .then((r) => console.log(`Done. ${r.total} navigation items.`))
    .catch((err) => {
      console.error("Fatal error scraping navigation:", err);
      process.exitCode = 1;
    });
}
