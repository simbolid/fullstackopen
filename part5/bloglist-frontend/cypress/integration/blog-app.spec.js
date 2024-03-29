describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");

    cy.createUser({
      name: "User",
      username: "username",
      password: "password",
    });

    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
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

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "username", password: "password" });
    });

    it("a user can create a blog", function () {
      cy.contains("Create new blog").click();

      cy.get("#title").type("Test Title");
      cy.get("#author").type("Mary Sue");
      cy.get("#url").type("example.com");
      cy.clock();
      cy.get("#blogForm").find("button").click();

      // test notification
      cy.contains("Test Title by Mary Sue added");
      cy.tick(6000);
      cy.get("html").should("not.contain", "Test Title by Mary Sue added");

      // app should display blog title and author
      cy.contains("Test Title by Mary Sue");
    });

    describe("and blogs exist", function () {
      beforeEach(function () {
        cy.createBlog({
          title: "One",
          author: "Ms. Monday",
          url: "monday.com",
        });
        cy.createBlog({
          title: "Two",
          author: "Ms. Tuesday",
          url: "tuesday.com",
        });
        cy.createBlog({
          title: "Three",
          author: "Ms. Wednesday",
          url: "wednesday.com",
        });
      });

      it("a user can like a blog", function () {
        cy.contains("Two by Ms. Tuesday").as("header").contains("View").click();
        cy.contains("Likes: 0");

        cy.get("@header").siblings(".togglable").find(".likeButton").click();
        cy.contains("Likes: 1");
      });

      it("a user can delete a blog they created", function () {
        cy.contains("Three by Ms. Wednesday")
          .as("header")
          .contains("View")
          .click();
        cy.get("@header").siblings(".togglable").find(".deleteButton").click();

        cy.get("html").should("not.contain", "Three by Ms. Wednesday");
      });

      it("a user cannot delete blogs they do not own", function () {
        cy.createUser({
          name: "User 2",
          username: "username2",
          password: "password2",
        });
        cy.logout();
        cy.login({ username: "username2", password: "password2" });

        cy.get(".deleteButton").should("not.exist");
      });

      it("blogs are ordered so that blogs with more likes appear first", function () {
        cy.createBlog({
          title: "Four",
          author: "Ms. Thursday",
          url: "thursday.com",
          likes: 4,
        });
        cy.createBlog({
          title: "Five",
          author: "Ms. Friday",
          url: "friday.com",
          likes: 5,
        });
        cy.createBlog({
          title: "Seven",
          author: "Ms. All Sunday",
          url: "sunday.com",
          likes: 3,
        });

        cy.get(".blog").then(($blogs) => {
          const likeOrder = $blogs.map(function (idx, el) {
            return parseInt(el.textContent.match(/\d/), 10);
          });

          const isDescending = Array.from(likeOrder).every(
            (el, idx) => idx === 0 || el <= likeOrder[idx - 1]
          );

          expect(isDescending).to.be.true;
        });
      });
    });
  });
});
