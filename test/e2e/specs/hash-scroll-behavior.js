const bsStatus = require("../browserstack-send-status");
module.exports = {
  ...bsStatus(),

  "@tags": ["hash", "ie9-fail"],

  /** @type {import('nightwatch').NightwatchTest} */
  "scroll behavior": function (browser) {
    browser
      .url("http://localhost:8080/hash-scroll-behavior/")
      .waitForElementVisible("#app", 1000)
      .assert.elementsCount("li a", 5)
      .assert.textContains(".view", "home")

      .execute(function () {
        window.scrollTo(0, 100);
      })
      .click("li:nth-child(2) a")
      .assert.textContains(".view", "foo")
      .execute(function () {
        window.scrollTo(0, 200);
        window.history.back();
      })
      .assert.textContains(".view", "home")
      .assert.evaluate(
        function () {
          return window.pageYOffset === 100;
        },
        null,
        "restore scroll position on back",
      )

      // scroll on a popped entry
      .execute(function () {
        window.scrollTo(0, 50);
        window.history.forward();
      })
      .assert.textContains(".view", "foo")
      .assert.evaluate(
        function () {
          return window.pageYOffset === 200;
        },
        null,
        "restore scroll position on forward",
      )

      .execute(function () {
        window.history.back();
      })
      .assert.textContains(".view", "home")
      .assert.evaluate(
        function () {
          return window.pageYOffset === 50;
        },
        null,
        "restore scroll position on back again",
      )

      .click("li:nth-child(3) a")
      .assert.evaluate(
        function () {
          return window.pageYOffset === 0;
        },
        null,
        "scroll to top on new entry",
      )
      .assert.textContains(".view", "bar")

      .click("li:nth-child(4) a")
      .pause(1)
      .assert.evaluate(
        function () {
          console.log(window.location.pathname);
          console.log(document.getElementById("anchor").getBoundingClientRect().top);
          return document.getElementById("anchor").getBoundingClientRect().top < 1;
        },
        null,
        "scroll to anchor",
      )

      // scroll back to top so we can click the butotn
      .execute(function () {
        window.scrollTo(0, 0);
      })
      .click("li:nth-child(5) a")
      .assert.evaluate(
        function () {
          return document.getElementById("anchor2").getBoundingClientRect().top < 101;
        },
        null,
        "scroll to anchor with offset",
      )
      .end();
  },
};
