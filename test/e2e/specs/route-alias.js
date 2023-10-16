const bsStatus = require("../browserstack-send-status");

module.exports = {
  ...bsStatus(),

  "@tags": ["history"],

  /** @type {import('nightwatch').NightwatchTest} */
  "route alias": function (browser) {
    browser
      .url("http://localhost:8080/route-alias/")
      .waitForElementVisible("#app", 1000)
      .assert.elementsCount("li a", 7)
      // assert correct href with base
      .assert.attributeContains("li:nth-child(1) a", "href", "/root-alias")
      .assert.attributeContains("li:nth-child(2) a", "href", "/route-alias/foo")
      .assert.attributeContains("li:nth-child(3) a", "href", "/route-alias/home/bar-alias")
      .assert.attributeContains("li:nth-child(4) a", "href", "/route-alias/baz")
      .assert.attributeContains("li:nth-child(5) a", "href", "/route-alias/home/baz-alias")
      .assert.attributeEquals("li:nth-child(6) a", "href", "http://localhost:8080/route-alias/home")
      .assert.attributeContains("li:nth-child(7) a", "href", "/route-alias/home/nested-alias/foo")

      .click("li:nth-child(1) a")
      .assert.urlEquals("http://localhost:8080/route-alias/root-alias")
      .assert.textContains(".view", "root")

      .click("li:nth-child(2) a")
      .assert.urlEquals("http://localhost:8080/route-alias/foo")
      .assert.textContains(".view", "Home")
      .assert.textContains(".view", "foo")

      .click("li:nth-child(3) a")
      .assert.urlEquals("http://localhost:8080/route-alias/home/bar-alias")
      .assert.textContains(".view", "Home")
      .assert.textContains(".view", "bar")

      .click("li:nth-child(4) a")
      .assert.urlEquals("http://localhost:8080/route-alias/baz")
      .assert.textContains(".view", "Home")
      .assert.textContains(".view", "baz")

      .click("li:nth-child(5) a")
      .assert.urlEquals("http://localhost:8080/route-alias/home/baz-alias")
      .assert.textContains(".view", "Home")
      .assert.textContains(".view", "baz")

      .click("li:nth-child(6) a")
      .assert.urlEquals("http://localhost:8080/route-alias/home")
      .assert.textContains(".view", "Home")
      .assert.textContains(".view", "default")

      .click("li:nth-child(7) a")
      .assert.urlEquals("http://localhost:8080/route-alias/home/nested-alias/foo")
      .assert.textContains(".view", "Home")
      .assert.textContains(".view", "nested foo")

      // check initial visit
      .url("http://localhost:8080/route-alias/foo")
      .waitForElementVisible("#app", 1000)
      .assert.urlEquals("http://localhost:8080/route-alias/foo")
      .assert.textContains(".view", "Home")
      .assert.textContains(".view", "foo")

      .url("http://localhost:8080/route-alias/home/bar-alias")
      .waitForElementVisible("#app", 1000)
      .assert.urlEquals("http://localhost:8080/route-alias/home/bar-alias")
      .assert.textContains(".view", "Home")
      .assert.textContains(".view", "bar")

      .url("http://localhost:8080/route-alias/baz")
      .waitForElementVisible("#app", 1000)
      .assert.urlEquals("http://localhost:8080/route-alias/baz")
      .assert.textContains(".view", "Home")
      .assert.textContains(".view", "baz")

      .url("http://localhost:8080/route-alias/home/baz-alias")
      .waitForElementVisible("#app", 1000)
      .assert.urlEquals("http://localhost:8080/route-alias/home/baz-alias")
      .assert.textContains(".view", "Home")
      .assert.textContains(".view", "baz")

      .url("http://localhost:8080/route-alias/home")
      .waitForElementVisible("#app", 1000)
      .assert.urlEquals("http://localhost:8080/route-alias/home")
      .assert.textContains(".view", "Home")
      .assert.textContains(".view", "default")

      .url("http://localhost:8080/route-alias/home/nested-alias/foo")
      .waitForElementVisible("#app", 1000)
      .assert.urlEquals("http://localhost:8080/route-alias/home/nested-alias/foo")
      .assert.textContains(".view", "Home")
      .assert.textContains(".view", "nested foo")
      .end();
  },
};
