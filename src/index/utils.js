module.exports.default
= module.exports
= {
  // judge the development if is browser
  inBrowser () {
    return typeof window !== 'undefined' && global === window
  },
  // judge the web page if runs in a http/https web server
  inHttpServer () {
    return /^https?$/.test(window.location.protocol)
  }
}