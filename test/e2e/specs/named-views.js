const bsStatus = require("../browserstack-send-status");

module.exports = {
  ...bsStatus(),

  "@tags": ["history"],

  /** @type {import('nightwatch').NightwatchTest} */
  "named views": function (browser) {
    browser
      .url("http://localhost:8080/named-views/")
      .waitForElementVisible("#app", 1000)
      .assert.elementsCount("li a", 2)
      // assert correct href with base
      .assert.attributeContains("li:nth-child(1) a", "href", "/named-views/")
      .assert.attributeContains("li:nth-child(2) a", "href", "/named-views/other")

      .assert.textContains(".view.one", "foo")
      .assert.textContains(".view.two", "bar")
      .assert.textContains(".view.three", "baz")

      .click("li:nth-child(2) a")
      .assert.urlEquals("http://localhost:8080/named-views/other")
      .assert.textContains(".view.one", "baz")
      .assert.textContains(".view.two", "bar")
      .assert.textContains(".view.three", "foo")

      .click("li:nth-child(1) a")
      .assert.urlEquals("http://localhost:8080/named-views/")
      .assert.textContains(".view.one", "foo")
      .assert.textContains(".view.two", "bar")
      .assert.textContains(".view.three", "baz")

      // check initial visit
      .url("http://localhost:8080/named-views/other")
      .waitForElementVisible("#app", 1000)
      .assert.textContains(".view.one", "baz")
      .assert.textContains(".view.two", "bar")
      .assert.textContains(".view.three", "foo")
      .end();
  },
};
