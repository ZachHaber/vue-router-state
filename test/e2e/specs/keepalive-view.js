const bsStatus = require("../browserstack-send-status");

module.exports = {
  ...bsStatus(),

  "@tags": [],

  /** @type {import('nightwatch').NightwatchTest} */
  "keepalive view": function (browser) {
    browser
      .url("http://localhost:8080/keepalive-view/")
      .waitForElementVisible("#app", 1000)
      .assert.elementsCount("li a", 10)

      .click("li:nth-child(1) a")
      .assert.textContains(".view", "index child1")

      .click("li:nth-child(2) a")
      .assert.textContains(".view", "index child2")

      .click("li:nth-child(3) a")
      .assert.textContains(".view", "home")

      // back to index child1 and check it
      .click("li:nth-child(1) a")
      .assert.textContains(".view", "index child1")

      // beforeRouteEnter guard with keep alive
      // https://github.com/vuejs/vue-router/issues/2561
      .click("li:nth-child(4) a")
      .assert.textContains(".view", "with-guard1: 1")
      .click("li:nth-child(3) a")
      .assert.textContains(".view", "home")
      .click("li:nth-child(5) a")
      .assert.textContains(".view", "with-guard2: 2")
      .click("li:nth-child(4) a")
      .assert.textContains(".view", "with-guard1: 3")

      // keep-alive deeply nested router-views
      // https://github.com/vuejs/vue-router/issues/2923
      .click("li:nth-child(6) a")
      .assert.textContains(".view", "index child1")
      .click("li:nth-child(3) a")
      .assert.textContains(".view", "home")
      .click("li:nth-child(7) a")
      .assert.textContains(".view", "index child2")

      // missing props in nested routes with keep alive
      // https://github.com/vuejs/vue-router/issues/2301
      .click("li:nth-child(8) a")
      .assert.textContains(".view", "msg: from parent")
      .click("li:nth-child(9) a")
      .assert.textContains(".view", "msg: from parent\nprops from route config is: from child")
      .click("li:nth-child(10) a")
      .assert.textContains(".view", "no missing prop warn")
      .click("li:nth-child(9) a")
      .assert.textContains(".view", "msg: from parent\nprops from route config is: from child")

      .end();
  },
};
