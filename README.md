# digital-services

## Usage

Scripts and formulas for Google Sheets [Digital Services Price List](https://docs.google.com/spreadsheets/d/1G6HGCfYW6CBAQmf6UC0EVBD6l79EyLWcIvNbkTsXEAo/edit?usp=sharing&hl=en_US).

## Scenario 1. Fetch Data from Product Page

### IMPORTXML

It's straight forward to use Google Sheet's IMPORTXML and XPath to do so, e.g. 

```
=IMPORTXML("https://apps.apple.com/"&A2&"/app/"&$B$1&"/id"&$A$1&"#", "/html/body//span[@class='truncate-single-line truncate-single-line--block']")
```

However while 50~100+ IMPORTXML used in sheets, often times there'll be "Waiting" for data fetching, due to the auto refresh mechanism (1 hour according to [docs](https://support.google.com/docs/answer/58515#zippy=%2Cchoose-how-often-formulas-calculate)), and throttle of the URL fetch requests.

### Apps Script

An improved approach is to utilize Apps Script. Traditional way to parse HTML page with XPath will be using XML Service, e.g. [get_page_xpath.js](scripts/get_page_xpath.js).

The problem is, as described in StackOverflow [What is the best way to parse html in google apps script](https://stackoverflow.com/questions/19455158/what-is-the-best-way-to-parse-html-in-google-apps-script), HTML pages are (usually) not valid XML objects. Thus either we need to clean up HTML, or use tricks like using Xml.parse - but it's already deprecated.

The most effective method appears to be using extensions like Cheerio for Google Apps Script: https://github.com/asciian/cheeriogs.

1. Click + next to Library
2. Enter `1ReeQ6WO8kKNxoaA_O0XEQ589cIrRvEBA9qcWpNqdOP17i47u6N9M5Xh0`
3. Click "Look up"
4. Click Add

Meanwhile, CSS selectors will be used instead of XPath.

Detailed script in [get_page_selector.js](scripts/get_page_selector.js).


# Scenario 2. Set Custom Refresh Interval

Apps Script will not be automatically refreshed. One possible approach is to utilize triggers.

While we expect daily refresh of data according to the data's App Store region:

1. Setup trigger - runs hourly.
2. The Apps Script [refresh.js](scripts/refresh.js) will set current time in UTC in cell `Config!$D$1`.
3. The date per region will be calculated: with `B2="US"` local date is `=TEXT(TO_DATE(VALUE(LEFT($D$1+B2, 10))),"yyyy-mm-dd")`.
4. Date per region is included into URL of fetch requests as "useless" query parameter or anchor to trigger re-run of the fetch script in [get_page_selector.js](scripts/get_page_selector.js).


## References

### Country / Region Codes

App Store region codes follow ISO 3166. Regional currency codes follow ISO 4217. Region names lookup using formal English names.

Data source: https://datahub.io/core/country-codes
