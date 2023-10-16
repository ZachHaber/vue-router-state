const bsStatus = require("../browserstack-send-status");

module.exports = {
  ...bsStatus(),

  "@tags": ["history"],

  /** @type {import('nightwatch').NightwatchTest} */
  "named routes": function (browser) {
    browser
      .url("http://localhost:8080/named-routes/")
      .waitForElementVisible("#app", 1000)
      .assert.elementsCount("li a", 3)
      // assert correct href with base
      .assert.attributeContains("li:nth-child(1) a", "href", "/named-routes/")
      .assert.attributeContains("li:nth-child(2) a", "href", "/named-routes/foo")
      .assert.attributeContains("li:nth-child(3) a", "href", "/named-routes/bar")
      .assert.textContains("p", "Current route name: home")
      .assert.textContains(".view", "Home")

      .click("li:nth-child(2) a")
      .assert.urlEquals("http://localhost:8080/named-routes/foo")
      .assert.textContains("p", "Current route name: foo")
      .assert.textContains(".view", "Foo")

      .click("li:nth-child(3) a")
      .assert.urlEquals("http://localhost:8080/named-routes/bar/123")
      .assert.textContains("p", "Current route name: bar")
      .assert.textContains(".view", "Bar 123")

      .click("li:nth-child(1) a")
      .assert.urlEquals("http://localhost:8080/named-routes/")
      .assert.textContains("p", "Current route name: home")
      .assert.textContains(".view", "Home")

      // check initial visit
      .url("http://localhost:8080/named-routes/foo")
      .waitForElementVisible("#app", 1000)
      .assert.textContains("p", "Current route name: foo")
      .assert.textContains(".view", "Foo")
      .end();
  },
};
