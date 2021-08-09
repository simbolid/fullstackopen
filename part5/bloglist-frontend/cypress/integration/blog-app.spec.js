describe('Blog app', function () {
  beforeEach(function() {
    cy.request("POST", "http://localhost:3003/api/testing/reset");

    const user = {
      name: "user",
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
});
