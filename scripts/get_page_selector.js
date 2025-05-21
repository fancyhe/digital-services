/**
 * HTML Scraper using Cheerio library (jQuery-like API for server-side)
 * 
 * Note: Before using this script, you need to add the Cheerio library:
 * 1. In Apps Script, go to Libraries (+)
 * 2. Add the Cheerio library by its Script ID: 1ReeQ6WO8kKNxoaA_O0XEQ589cIrRvEBA9qcWpNqdOP17i47u6N9M5Xh0
 * 3. Choose the latest version and save
 */

/**
 * Fetches content from a webpage based on CSS or XPath-like selectors
 * 
 * @param {string} url - The URL to fetch
 * @param {string} selector - CSS selector or XPath-like expression
 * @return {string[][]} A 2D array containing the matching elements' text content
 * @customfunction
 */
function GET_PAGE_CONTENT_SELECTOR(url, selector) {
  try {
    // Fetch the HTML content
    const response = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      followRedirects: true
    });

    if (response.getResponseCode() !== 200) {
      return [["Error: HTTP status code " + response.getResponseCode()]];
    }

    const html = response.getContentText();

    // Load HTML into Cheerio
    const $ = Cheerio.load(html);

    // Select elements using the CSS selector
    const elements = $(selector);

    // If no elements found, return appropriate message
    if (elements.length === 0) {
      return [["No elements found matching the selector"]];
    }

    // Extract text content from matched elements
    const results = [];
    elements.each(function (i, elem) {
      const text = $(elem).text().trim();
      if (text) {
        results.push([text]);
      }
    });

    return results.length > 0 ? results : [["No text content found in matching elements"]];

  } catch (error) {
    return [["Error: " + error.toString()]];
  }
}

/**
 * Helper function to test the GET_PAGE_CONTENT_SELECTOR function
 */
function testGetPageXPathContent() {
  const url = "https://apps.apple.com/us/app/youtube/id544007664";
  const selector = "html > body span.truncate-single-line.truncate-single-line--block"

  const result = GET_PAGE_CONTENT_SELECTOR(url, selector);
  Logger.log(result);
}
