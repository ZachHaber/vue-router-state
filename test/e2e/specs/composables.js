const bsStatus = require("../browserstack-send-status");

module.exports = {
  ...bsStatus(),

  "@tags": ["history"],

  /** @type {import('nightwatch').NightwatchTest} */
  "useRoute() + useRouter()": function (browser) {
    browser
      .url("http://localhost:8080/composables/")
      .waitForElementVisible("#app", 1000)
      .assert.elementsCount("li", 4)
      .assert.elementsCount("li a", 4)
      .assert.textContains(".view", "Home")

      .click("li:nth-child(2) a")
      .assert.textContains(".view", "About")
      .click("li:nth-child(1) a")
      .assert.textContains(".view", "Home")
      .assert.textContains("#start-route", "/")
      .assert.textContains("#fullpath", "/")

      .click("button#nav")
      .assert.textContains("#fullpath", "/?n=1")

      .end();
  },

  "useLink()": function (browser) {
    browser
      .url("http://localhost:8080/composables/")
      .waitForElementVisible("#app", 1000)

      .assert.textContains(".view", "Home")
      .assert.textContains("#nested-active", "/composables/nested: false, false")
      .click("li:nth-child(3) a")
      .assert.textContains(".view", "NestedEmpty")
      .assert.textContains("#nested-active", "/composables/nested: true, true")
      .click("li:nth-child(4) a")
      .assert.textContains(".view", "NestedA")
      .assert.textContains("#nested-active", "/composables/nested: true, false")
      .click("#nested-active")
      .assert.textContains(".view", "NestedEmpty")
      .assert.textContains("#nested-active", "/composables/nested: true, true")

      .end();
  },
};
