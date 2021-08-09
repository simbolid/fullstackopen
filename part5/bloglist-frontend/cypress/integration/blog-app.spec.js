describe('Blog app', function () {
  beforeEach(function() {
    cy.request("POST", "http://localhost:3003/api/testing/reset");

    const user = {
      name: "User",
      username: "username",
      password: "password",
    };

    cy.request("POST", "http://localhost:3003/api/users", user);

    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function() {
    cy.get("#loginForm").as("login");
    cy.get("@login").find("input").should("have.length", 2);
  });

  describe("Login", function () {
    it("succeeds with right credentials", function () {
      cy.get("#usernameInput").type("username");
      cy.get("#passwordInput").type("password");
      cy.get("#loginForm").find("button").click();

      cy.contains("User logged in");
    });

    it("fails with invalid credentials", function () {
      cy.get("#usernameInput").type("dne");
      cy.get("#passwordInput").type("dne");
      cy.get("#loginForm").find("button").click();

      cy.get("html").should("not.contain", "logged in");
      cy.contains("Invalid credentials");
    });
  });
});
