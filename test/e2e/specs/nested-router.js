const bsStatus = require("../browserstack-send-status");

module.exports = {
  ...bsStatus(),

  "@tags": ["history"],

  /** @type {import('nightwatch').NightwatchTest} */
  basic: function (browser) {
    browser
      .url("http://localhost:8080/nested-router/")
      .waitForElementVisible("#app", 1000)
      .assert.elementsCount("li a", 3)

      .click("li:nth-child(1) a")
      .assert.urlEquals("http://localhost:8080/nested-router/nested-router")
      .assert.textContains(".child", "Child router path: /")
      .assert.elementsCount("li a", 5)

      .click(".child li:nth-child(1) a")
      .assert.textContains(".child", "Child router path: /foo")
      .assert.textContains(".child .foo", "foo")

      .click(".child li:nth-child(2) a")
      .assert.textContains(".child", "Child router path: /bar")
      .assert.textContains(".child .bar", "bar")

      .click("li:nth-child(2) a")
      .assert.urlEquals("http://localhost:8080/nested-router/foo")
      .assert.not.elementPresent(".child")
      .assert.textContains("#app", "foo")
      .assert.elementsCount("li a", 3)
      .end();
  },
};
