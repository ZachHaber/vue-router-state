const bsStatus = require("../browserstack-send-status");

module.exports = {
  ...bsStatus(),

  "@tags": ["history"],

  "auth flow": function (browser) {
    browser
      .url("http://localhost:8080/auth-flow/")
      .waitForElementVisible("#app", 1000)
      .assert.textContains("#app p", "You are logged out")

      .click("li:nth-child(3) a")
      .assert.urlEquals("http://localhost:8080/auth-flow/login?redirect=%2Fdashboard")
      .assert.textContains("#app h2", "Login")
      .assert.textContains("#app p", "You need to login first.")

      .click("button")
      .assert.urlEquals("http://localhost:8080/auth-flow/login?redirect=%2Fdashboard")
      .assert.elementPresent(".error")

      .setValue("input[type=password]", "password1")
      .click("button")
      .assert.urlEquals("http://localhost:8080/auth-flow/dashboard")
      .assert.textContains("#app h2", "Dashboard")
      .assert.textContains("#app p", "Yay you made it!")

      // reload
      .url("http://localhost:8080/auth-flow/")
      .waitForElementVisible("#app", 1000)
      .assert.textContains("#app p", "You are logged in")

      // navigate when logged in
      .click("li:nth-child(3) a")
      .assert.urlEquals("http://localhost:8080/auth-flow/dashboard")
      .assert.textContains("#app h2", "Dashboard")
      .assert.textContains("#app p", "Yay you made it!")

      // directly visit dashboard when logged in
      .url("http://localhost:8080/auth-flow/dashboard")
      .waitForElementVisible("#app", 1000)
      .assert.urlEquals("http://localhost:8080/auth-flow/dashboard")
      .assert.textContains("#app h2", "Dashboard")
      .assert.textContains("#app p", "Yay you made it!")

      // log out
      .click("li:nth-child(1) a")
      .assert.urlEquals("http://localhost:8080/auth-flow/")
      .assert.textContains("#app p", "You are logged out")

      // directly visit dashboard when logged out
      .url("http://localhost:8080/auth-flow/dashboard")
      .waitForElementVisible("#app", 1000)
      .assert.urlEquals("http://localhost:8080/auth-flow/login?redirect=%2Fdashboard")
      .assert.textContains("#app h2", "Login")
      .assert.textContains("#app p", "You need to login first.")
      .end();
  },
};
