const bsStatus = require("../browserstack-send-status");

module.exports = {
  ...bsStatus(),

  "@tags": ["history"],

  /** @type {import('nightwatch').NightwatchTest} */
  "lazy loading": function (browser) {
    browser
      .url("http://localhost:8080/lazy-loading/")
      .waitForElementVisible("#app", 1000)
      .assert.elementsCount("li a", 5)
      .assert.textContains(".view", "home")

      .click("li:nth-child(2) a")
      .assert.textContains(".view", "This is Foo!")

      .click("li:nth-child(3) a")
      .assert.textContains(".view", "This is Bar!")

      .click("li:nth-child(1) a")
      .assert.textContains(".view", "home")

      .click("li:nth-child(4) a")
      .assert.textContains(".view", "This is Bar!")
      .assert.textContains(".view h3", "Baz")

      // test initial visit
      .url("http://localhost:8080/lazy-loading/foo")
      .waitForElementVisible("#app", 1000)
      .assert.textContains(".view", "This is Foo!")

      .url("http://localhost:8080/lazy-loading/bar/baz")
      .waitForElementVisible("#app", 1000)
      .assert.textContains(".view", "This is Bar!")
      .assert.textContains(".view h3", "Baz")

      // lazy loading with dynamic params: https://github.com/vuejs/vue-router/issues/2719
      // direct visit
      .url("http://localhost:8080/lazy-loading/a/b/c")
      .waitForElementVisible("#app", 1000)
      .assert.textContains(".view", "/a/b/c")
      // coming from another url
      .url("http://localhost:8080/lazy-loading/")
      .waitForElementVisible("#app", 1000)
      .click("li:nth-child(5) a")
      .waitForElementVisible("#tagged-path", 1000)
      .assert.textContains(".view", "/a/b/c")
      .end();
  },
};
