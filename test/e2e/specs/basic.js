const bsStatus = require("../browserstack-send-status");

module.exports = {
  ...bsStatus(),

  "@tags": ["history"],

  /** @type {import('nightwatch').NightwatchTest} */
  basic: function (browser) {
    browser
      .url("http://localhost:8080/basic/")
      .waitForElementVisible("#app", 1000)
      .assert.elementsCount("li", 12)
      .assert.elementsCount("li a", 12)
      // assert correct href with base
      .assert.attributeContains("li:nth-child(1) a", "href", "/basic/")
      .assert.attributeContains("li:nth-child(2) a", "href", "/basic/foo")
      .assert.attributeContains("li:nth-child(3) a", "href", "/basic/bar")
      .assert.attributeContains("li:nth-child(4) a", "href", "/basic/bar")
      .assert.attributeContains("li:nth-child(5) a", "href", "/basic/%C3%A9")
      .assert.attributeContains("li:nth-child(6) a", "href", "/basic/%C3%A9?t=%25%C3%B1")
      .assert.attributeContains("li:nth-child(7) a", "href", "/basic/%C3%A9#%25%C3%B1")
      .assert.attributeContains("li:nth-child(8) a", "href", "/basic/foo")
      .assert.attributeContains("li:nth-child(10) a", "href", "/basic/query/A%")
      .assert.textContains(".view", "home")

      .click("li:nth-child(2) a")
      .assert.urlEquals("http://localhost:8080/basic/foo")
      .assert.textContains(".view", "foo")

      .click("li:nth-child(3) a")
      .assert.urlEquals("http://localhost:8080/basic/bar")
      .assert.textContains(".view", "bar")

      .click("li:nth-child(1) a")
      .assert.urlEquals("http://localhost:8080/basic/")
      .assert.textContains(".view", "home")

      .click("li:nth-child(4) a")
      .assert.urlEquals("http://localhost:8080/basic/bar")
      .assert.textContains(".view", "bar")

      .click("li:nth-child(5) a")
      .assert.urlEquals("http://localhost:8080/basic/%C3%A9")
      .assert.textContains(".view", "unicode")

      // check initial visit
      .url("http://localhost:8080/basic/foo")
      .waitForElementVisible("#app", 1000)
      .assert.textContains(".view", "foo")
      .url("http://localhost:8080/basic/%C3%A9")
      .waitForElementVisible("#app", 1000)
      .assert.textContains(".view", "unicode")

      // regression onComplete
      // https://github.com/vuejs/vue-router/issues/2721
      .assert.textContains("#counter", "0")
      .click("#navigate-btn")
      .assert.textContains("#counter", "1")
      .click("#navigate-btn")
      .assert.textContains("#counter", "2")

      // scoped slot
      .assert.textContains("li:nth-child(8) a", "/foo (with v-slot)")
      .click("li:nth-child(8) a")
      .assert.urlEquals("http://localhost:8080/basic/foo")
      .assert.textContains(".view", "foo")
      .click("li:nth-child(2) a")
      .assert.urlEquals("http://localhost:8080/basic/foo")
      .assert.textContains(".view", "foo")
      .assert.hasClass("li:nth-child(8)", "active")
      .assert.hasClass("li:nth-child(8)", "exact-active")
      .assert.attributeEquals("li:nth-child(8) a", "class", "")

      // encoded percentage as path param
      // https://github.com/vuejs/vue-router/issues/2725
      .url("http://localhost:8080/basic/query/A%25")
      .waitForElementVisible("#app", 1000)
      .assert.textContains(".view", 'query: "A%"')
      .click("li:nth-child(10) a")
      .assert.urlEquals("http://localhost:8080/basic/query/A%25")
      .assert.textContains(".view", 'query: "A%"')

      // Listener cleanup
      .assert.textContains("#popstate-count", "1 popstate listeners")
      .click("#unmount")
      .assert.textContains("#popstate-count", "0 popstate listeners")

      .end();
  },

  /** @type {import('nightwatch').NightwatchTest} */
  "cancelling ongoing navigations": function (browser) {
    browser
      .url("http://localhost:8080/basic/?delay=200")
      .waitForElementVisible("#app", 1000)
      .assert.textContains(".view", "home")
      // go to foo with a delay
      .click("li:nth-child(12) a")
      .click("li:nth-child(11) a")
      .waitFor(300)
      // we should stay at /basic after the delay
      .assert.urlEquals("http://localhost:8080/basic/?delay=200")
      .assert.textContains(".view", "home");
  },
};
