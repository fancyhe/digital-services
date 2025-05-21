/**
 * Fetches content from a webpage based on XPath expressions
 * 
 * @param {string} url - The URL to fetch
 * @param {string} xpath - The XPath expression to evaluate
 * @return {string[][]} A 2D array containing the matching elements' text content
 * @customfunction
 */
function GET_PAGE_XPATH_CONTENT(url, xpath) {

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

    // Clean the HTML before parsing
    const cleanedHtml = cleanHtml(html);

    try {
      // Create an XML document from the HTML
      const document = XmlService.parse(cleanedHtml);
      const root = document.getRootElement();

      // Evaluate the XPath expression
      const elements = getElementsFromXPath(root, xpath);

      // If no elements found, return empty array
      if (!elements || elements.length === 0) {
        return [["No elements found matching the XPath expression"]];
      }
      
      // Extract text content from matched elements
      const results = elements.map(element => [extractText(element)]);
      return results;
    } catch (parseError) {
      // If parsing fails, try using regex-based extraction as a fallback, or
      throw parseError; // Re-throw if fallback also fails
    }
  } catch (error) {
    return [["Error: " + error.toString()]];
  }
}

/**
 * Cleans HTML to make it parseable by XmlService
 * 
 * @param {string} html - The HTML string to clean
 * @return {string} The cleaned HTML
 */
function cleanHtml(html) {
  // Remove DOCTYPE declaration
  html = html.replace(/<!DOCTYPE[^>]*>/i, '');

  // Remove comment blocks including EMBER_CLI_FASTBOOT_TITLE and similar
  html = html.replace(/<!--[\s\S]*?-->/g, '');

  // Fix attributes without values (adding empty value)
  html = html.replace(/(\s+[a-zA-Z\-_:]+)(\s+|>)/g, '$1=""$2');

  // Replace problematic HTML entities
  html = html.replace(/&nbsp;/g, ' ');
  html = html.replace(/&amp;/g, '&');
  html = html.replace(/&lt;/g, '<');
  html = html.replace(/&gt;/g, '>');

  // Handle other HTML entities
  html = html.replace(/&([a-z0-9#]+);/gi, '&amp;$1;');

  // Fix unclosed or improperly nested tags (basic fix)
  html = html.replace(/<(br|hr|img|input|link|meta)([^>]*)>/gi, '<$1$2/>');

  // Remove script tags and their contents (often contain invalid XML)
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove style tags (can contain problematic content)
  html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Wrap everything in a root element if needed
  if (!/<html/i.test(html)) {
    html = '<html>' + html + '</html>';
  }

  return html;
}
