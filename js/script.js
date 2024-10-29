// Business Logic
// -------------------
let Bank = {
    users: [],
  
    // Function to add a new user
    addUser: function (phone, password) {
      const userId = phone.substring(1); // Remove the first digit from the phone number
      this.users.push({
        phone: phone,
        password: password,
        userId: userId,
        profileName: null,
        balanceAmount: 0,
      });
      alert(`Sign-up successful! Your User ID is: ${userId}`);
    },
  
    // Function to check if a user exists
    checkUser: function (phone, password) {
      return this.users.find(
        (user) => user.phone === phone && user.password === password
      );
    },
  
    // Function to handle user signup
    handleSignup: function (e) {
      e.preventDefault(); // Prevent form submission
  
      // Get user input
      let newPhone = $("#newPhone").val();
      let newPassword = $("#newPassword").val();
      let confirmPassword = $("#confirmPassword").val();
  
      // Validate phone number length
      if (newPhone.length !== 11) {
        alert("Phone number is not complete!");
        return;
      }
  
      // Validate password length
      if (newPassword.length !== 6) {
        alert("Password must be exactly 6 digits!");
        return;
      }
  
      // Validate password match
      if (newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
  
      // Add user to the Bank object
      this.addUser(newPhone, newPassword);
      $("#signupForm").hide(); // Hide signup form after successful sign-up
      $("#loginForm").show(); // Show login form for immediate login
  
      // Clear the signup form
      $("#newPhone").val("");
      $("#newPassword").val("");
      $("#confirmPassword").val("");
  
    },
  
    // Function to handle user login
    handleLogin: function (e) {
      e.preventDefault(); // Prevent form submission
  
      // Get user input
      let phone = $("#phone").val();
      let password = $("#password").val();
  
      // Check if user exists in the Bank object
      let user = this.checkUser(phone, password);
  
      if (user) {
        // Check if the profile name is set
        if (!user.profileName) {
          // Prompt for the profile name during the first login
          let profileName = prompt("What would you like to be called?");
          if (profileName) {
            user.profileName = profileName; // Set the profile name
            alert(`Welcome, ${profileName}! Your User ID is: ${user.userId}.`);
          } else {
            alert(
              "Profile name is required! You will be logged in without a profile name."
            );
          }
        } else {
          alert(
            `Login successful! Your User ID is: ${user.userId}. Welcome back, ${user.profileName}!`
          );
        }
  
        // Display user info
        $("#profileName").text(user.profileName || "Guest");
        $("#userId").text(user.userId);
        $(".balance-amount").text(user.balanceAmount.toFixed(0)); // Change to class
        $("#newUserId").text(user.userId);
        $("#newestPhone").text(user.phone);
        $("#newProfileName").text(user.profileName || "Guest");
  
        // Set #div2 to only have the class d-none
        $("#div2").removeClass().addClass("d-none");
  
        // Show the secondBody div
        $(".secondBody").show();
  
        $("#div1").addClass("d-none"); // Hide the first div
      } else {
        alert("Invalid phone number or password!");
      }
  
      // Clear the login form
      $("#phone").val("");
      $("#password").val("");
    },
  
    // Function to handle balance update
    updateBalance: function (amount, operation) {
      let currentBalance = parseFloat($(".balance-amount").text());
      if (operation === "add") {
        return currentBalance + amount;
      } else if (operation === "subtract") {
        if (currentBalance >= amount) {
          return currentBalance - amount;
        } else {
          alert("Insufficient balance.");
          return false;
        }
      }
      return currentBalance;
    },
  
    // Handle fund account form submission
    handleFundAccount: function (e) {
      e.preventDefault();
      let fundAmount = parseFloat($("#fundAmount").val());
      if (fundAmount && fundAmount > 0) {
        let newBalance = this.updateBalance(fundAmount, "add");
        if (newBalance !== false) {
          $(".balance-amount").text(newBalance.toFixed(2));
          alert(`Your account has been funded with ₦${fundAmount}`);
          this.clearModalForms(); // Clear the modal form
          this.closeModal("#fundAccountModal"); // Close modal
        }
      } else {
        alert("Please enter a valid amount.");
      }
    },
  
    // Updated transfer function
    handleTransfer: function (e) {
      e.preventDefault();
      let transferAmount = parseFloat($("#transferAmount").val());
      let recipientId = $("#recipientId").val(); // Assuming you want to transfer to a specific user by ID
      let sender = this.users.find((user) => user.userId === $("#userId").text()); // Fetch logged-in user
  
      if (recipientId === sender.userId) {
        alert("You cannot transfer to yourself!");
        return;
      }
  
      let recipient = this.users.find((user) => user.userId === recipientId); // Find recipient by userId
  
      if (transferAmount && transferAmount > 0) {
        if (recipient) {
          let newBalance = this.updateBalance(transferAmount, "subtract");
          if (newBalance !== false) {
            sender.balanceAmount = newBalance; // Update sender's balance
            recipient.balanceAmount += transferAmount; // Add the transfer amount to the recipient's balance
            $(".balance-amount").text(sender.balanceAmount.toFixed(2));
            alert(
              `You have successfully transferred ₦${transferAmount} to User ID: ${recipientId}`
            );
            this.clearModalForms(); // Clear the modal form
            this.closeModal("#transferModal"); // Close modal
  
            // Clear the transfer form
            $("#transferAmount").val("");
            $("#recipientId").val("");
  
          }
        } else {
          alert("Recipient not found! Please check the User ID and try again.");
        }
      } else {
        alert("Please enter a valid amount.");
      }
    },
  
    // Handle airtime purchase form submission
    handleAirtime: function (e) {
      e.preventDefault();
      let airtimeAmount = parseFloat($("#airtimeAmount").val());
      if (airtimeAmount && airtimeAmount > 0) {
        let newBalance = this.updateBalance(airtimeAmount, "subtract");
        if (newBalance !== false) {
          $(".balance-amount").text(newBalance.toFixed(2));
          alert(`You have successfully bought ₦${airtimeAmount} airtime`);
          this.clearModalForms(); // Clear the modal form
          this.closeModal("#airtimeModal"); // Close modal
  
          // Clear the airtime form
          $("#airtimeAmount").val("");
        }
      } else {
        alert("Please enter a valid amount.");
      }
    },
  
    // Handle data purchase form submission
    handleData: function (e) {
      e.preventDefault();
      let dataAmount = parseFloat($("#dataAmount").val());
      if (dataAmount && dataAmount > 0) {
        let newBalance = this.updateBalance(dataAmount, "subtract");
        if (newBalance !== false) {
          $(".balance-amount").text(newBalance.toFixed(2));
          alert(`You have successfully bought ₦${dataAmount} data`);
          this.clearModalForms(); // Clear the modal form
          this.closeModal("#dataModal"); // Close modal
  
          // Clear the data form
          $("#dataAmount").val("");
        }
      } else {
        alert("Please enter a valid amount.");
      }
    },
  
    // Function to clear modal forms
    clearModalForms: function () {
      $("input[type=text], input[type=number]").val("");
    },
  
    // Function to save balance before logging out
    saveBalanceBeforeLogout: function () {
      let userId = $("#userId").text();
      let user = this.users.find((user) => user.userId === userId);
      if (user) {
        user.balanceAmount = parseFloat($(".balance-amount").text());
      }
    },
  
    // User Interface
    closeModal: function (modalId) {
      $(modalId).hide();
    },
  };
  
  // User Interface
  // -------------------
  $(document).ready(function () {
    // Initially hide the secondBody div
    $(".secondBody").hide();
  
    // Animation for logo and text
    $(".animate-logo").css({
      opacity: 0,
      position: "relative",
      left: "-700px",
    });
  
    $(".animate-logo").animate(
      {
        opacity: 1,
        left: "0",
      },
      2500,
      "easeInOutCubic",
      function () {
        let text = "BANK".split("");
        let delay = 0;
  
        text.forEach(function (letter) {
          delay += 250;
          $("<span>" + letter + "</span>")
            .css({ opacity: 0 })
            .appendTo(".animate-text")
            .delay(delay)
            .animate(
              {
                opacity: 1,
              },
              800,
              "easeInOutCubic"
            );
        });
      }
    );
  
    // Wait for 10 seconds before starting the fade-out
    setTimeout(function () {
      // Fade out div1 over 2 seconds
      $("#div1").fadeOut(1000, function () {
        // Once div1 has faded out, remove all classes from div2
        $("#div2").removeClass();
  
        // Add the new class to div2
        $("#div2").addClass(
          "fade-box container-fluid d-flex align-items-center justify-content-center vh-100 position-relative bg"
        );
  
        // Fade in div2 over 2 seconds
        $("#div2").fadeIn(500);
      });
    }, 8000); // 10-second delay before fading out
  
    // Show signup or login form toggle
    $("#showSignup, #showLogin").click(function () {
      $("#loginForm").toggle();
      $("#signupForm").toggle();
    });
  
    // Attach event listeners for login and signup buttons
    $("#signupForm #authSubmitButton").click(function (e) {
      Bank.handleSignup(e);
    });
    $("#loginForm #authSubmitButton").click(function (e) {
      Bank.handleLogin(e);
    });
  
    // Attach event listeners for modals
    $("#fundAccount").click(function () {
      $("#fundAccountModal").show();
    });
    $("#transfer").click(function () {
      $("#transferModal").show();
    });
    $("#airtime").click(function () {
      $("#airtimeModal").show();
    });
    $("#data").click(function () {
      $("#dataModal").show();
    });
    $("#accountDetails").click(function () {
      $("#accountDetailsModal").show();
    });

  
    // Attach event listeners for modal close buttons
    $(".modal-close").click(function () {
      Bank.closeModal($(this).closest(".modal")); // Close the closest modal
    });
  
    // Attach event listeners for popup forms
    $("#fundAccountForm").submit(function (e) {
      Bank.handleFundAccount(e);
    });
    $("#transferForm").submit(function (e) {
      Bank.handleTransfer(e);
    });
    $("#airtimeForm").submit(function (e) {
      Bank.handleAirtime(e);
    });
    $("#dataForm").submit(function (e) {
      Bank.handleData(e);
    });
  
    // Attach event listener for logout button
    $("#logout").click(function () {
      Bank.saveBalanceBeforeLogout(); // Save the balance before logout
      $(".secondBody").hide();
      $("#div2").removeClass();
      $("#div2").addClass(
        "fade-box container-fluid d-flex align-items-center justify-content-center vh-100 position-relative bg"
      );
    });
  
    $(".btn-close").click(function () {
      $("#fundAccountModal").hide();
      $("#dataModal").hide();
      $("#transferModal").hide();
      $("#airtimeModal").hide();
      $("#accountDetailsModal").hide();
    });
  
    $("#copy").click(function () {
      // Get the number from the paragraph
      const number = $("#userId").text();
  
      // Copy to clipboard
      navigator.clipboard.writeText(number).then(
        function () {
          // Show alert
          alert("Copy successful!");
  
          // Trigger confetti
          confetti();
        },
        function (err) {
          alert("Failed to copy: ", err);
        }
      );
    });
  });
  
