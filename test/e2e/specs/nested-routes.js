const bsStatus = require("../browserstack-send-status");

module.exports = {
  ...bsStatus(),

  "@tags": ["history"],

  /** @type {import('nightwatch').NightwatchTest} */
  "nested routes": function (browser) {
    browser
      .url("http://localhost:8080/nested-routes/")
      .waitForElementVisible("#app", 1000)
      .assert.elementsCount("li a", 11)
      .assert.urlEquals("http://localhost:8080/nested-routes/parent")
      .assert.textContains(".view", "Parent")
      .assert.textContains(".view", "default")

      .click("li:nth-child(2) a")
      .assert.urlEquals("http://localhost:8080/nested-routes/parent/foo")
      .assert.textContains(".view", "Parent")
      .assert.textContains(".view", "foo")

      .click("li:nth-child(3) a")
      .assert.urlEquals("http://localhost:8080/nested-routes/parent/bar")
      .assert.textContains(".view", "Parent")
      .assert.textContains(".view", "bar")

      .click("li:nth-child(4) a")
      .assert.urlEquals("http://localhost:8080/nested-routes/baz")
      .assert.textContains(".view", "Parent")
      .assert.textContains(".view", "baz")

      .click("li:nth-child(5) a")
      .assert.urlEquals("http://localhost:8080/nested-routes/parent/qux/123")
      .assert.textContains(".view", "Parent")
      .assert.textContains(".view", "qux")

      .click(".nested-parent a")
      .assert.urlEquals("http://localhost:8080/nested-routes/parent/qux/123/quux")
      .assert.textContains(".view", "Parent")
      .assert.textContains(".view", "qux")
      .assert.textContains(".view", "quux")

      .click("li:nth-child(6) a")
      .assert.urlEquals("http://localhost:8080/nested-routes/parent/quy/123")
      .assert.textContains(".view", "Parent")
      .assert.textContains(".view", "quy")
      .assert.evaluate(
        function () {
          var params = JSON.parse(document.querySelector("pre").textContent);
          return JSON.stringify(params) === JSON.stringify(["quyId"]);
        },
        null,
        "quyId",
      )

      .click("li:nth-child(8) a")
      .assert.urlEquals("http://localhost:8080/nested-routes/parent/zap/1")
      .assert.textContains(".view", "Parent")
      .assert.textContains(".view", "zap")
      .assert.evaluate(
        function () {
          var zapId = document.querySelector("pre").textContent;
          return zapId === "1";
        },
        null,
        "zapId",
      )

      .click("li:nth-child(7) a")
      .assert.urlEquals("http://localhost:8080/nested-routes/parent/zap")
      .assert.textContains(".view", "Parent")
      .assert.textContains(".view", "zap")
      .assert.evaluate(
        function () {
          var zapId = document.querySelector("pre").textContent;
          return zapId === "";
        },
        null,
        "optional zapId",
      )

      // test relative params
      .click("li:nth-child(9) a")
      .assert.evaluate(
        function () {
          var zapId = document.querySelector("pre").textContent;
          return zapId === "2";
        },
        null,
        "relative params",
      )

      .click("li:nth-child(10) a")
      .assert.urlEquals("http://localhost:8080/nested-routes/parent/qux/1/quux")
      .click("li:nth-child(11) a")
      .assert.urlEquals("http://localhost:8080/nested-routes/parent/qux/2/quux")
      .click(".nested-child a")
      .assert.urlEquals("http://localhost:8080/nested-routes/parent/qux/2/quuy")

      // check initial visit
      .url("http://localhost:8080/nested-routes/parent/foo")
      .waitForElementVisible("#app", 1000)
      .assert.textContains(".view", "Parent")
      .assert.textContains(".view", "foo")
      .url("http://localhost:8080/nested-routes/baz")
      .waitForElementVisible("#app", 1000)
      .assert.textContains(".view", "Parent")
      .assert.textContains(".view", "baz")
      .end();
  },
};
