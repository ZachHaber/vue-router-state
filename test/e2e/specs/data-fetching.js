const bsStatus = require("../browserstack-send-status");

module.exports = {
  ...bsStatus(),

  "@tags": [],

  /** @type {import('nightwatch').NightwatchTest} */
  "data fetching": function (browser) {
    browser
      .url("http://localhost:8080/data-fetching/")
      .waitForElementVisible("#app", 1000)
      .assert.elementsCount("li a", 4)
      .assert.textContains(".view", "home")

      .click("li:nth-child(2) a")
      .waitForElementNotPresent(".loading", 500)
      .assert.textContains(".post h2", "sunt aut facere")
      .assert.textContains(".post p", "quia et suscipit")

      .click("li:nth-child(3) a")
      .waitForElementNotPresent(".loading", 500)
      .assert.textContains(".post h2", "qui est esse")
      .assert.textContains(".post p", "est rerum tempore")

      .click("li:nth-child(4) a")
      .waitForElementNotPresent(".loading", 500)
      .assert.not.elementPresent(".content")
      .assert.textContains(".error", "Post not found")

      .click("li:nth-child(1) a")
      .assert.not.elementPresent(".post")
      .assert.textContains(".view", "home")
      .end();
  },
};
