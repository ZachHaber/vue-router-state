const bsStatus = require("../browserstack-send-status");

module.exports = {
  ...bsStatus(),

  "@tags": ["history"],

  basic: function (browser) {
    browser
      .url("http://localhost:8080/restart-app/")
      .waitForElementVisible("#mount", 1000)
      .assert.textContains("#beforeEach", "0")
      .assert.textContains("#beforeResolve", "0")
      .assert.textContains("#afterEach", "0")

      // Mounting will trigger hooks
      .click("#mount")
      .waitForElementVisible("#app > *", 1000)
      .assert.textContains("#beforeEach", "1")
      .assert.textContains("#beforeResolve", "1")
      .assert.textContains("#afterEach", "1")
      .assert.textContains("#view", "home")

      // Navigate to foo route will trigger hooks
      .click("#app li:nth-child(2) a")
      .assert.textContains("#beforeEach", "2")
      .assert.textContains("#beforeResolve", "2")
      .assert.textContains("#afterEach", "2")
      .assert.textContains("#view", "foo")

      // Unmount
      .click("#unmount")
      .assert.textContains("#app", "")

      // Second mounting will trigger hooks
      .click("#mount")
      .waitForElementVisible("#app > *", 1000)
      .assert.textContains("#beforeEach", "3")
      .assert.textContains("#beforeResolve", "3")
      .assert.textContains("#afterEach", "3")
      .assert.textContains("#view", "foo")

      .end();
  },
};
