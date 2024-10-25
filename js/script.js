// Business Logic

let Bank = {
  users: [],

  addUser: function (phone, password) {
    const userId = phone.substring(1);
    this.users.push({
      phone: phone,
      password: password,
      userId: userId,
      profileName: null,
      balanceAmount: 0,
    });
    alert(`Sign-up successful! Your User ID is: ${userId}`);
  },

  checkUser: function (phone, password) {
    return this.users.find(
      (user) => user.phone === phone && user.password === password
    );
  },

  handleSignup: function (e) {
    e.preventDefault();

    let newPhone = $("#newPhone").val();
    let newPassword = $("#newPassword").val();
    let confirmPassword = $("#confirmPassword").val();

    if (newPhone.length !== 11) {
      alert("Phone number is not complete!");
      return;
    }

    if (newPassword.length !== 6) {
      alert("Password must be exactly 6 digits!");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    this.addUser(newPhone, newPassword);
    $("#signupForm").hide();
    $("#loginForm").show();

    $("#newPhone").val("");
    $("#newPassword").val("");
    $("#confirmPassword").val("");
  },

  handleLogin: function (e) {
    e.preventDefault();

    let phone = $("#phone").val();
    let password = $("#password").val();

    let user = this.checkUser(phone, password);

    if (user) {
      if (!user.profileName) {
        let profileName = prompt("What would you like to be called?");
        if (profileName) {
          user.profileName = profileName;
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

      $("#profileName").text(user.profileName || "Guest");
      $("#userId").text(user.userId);
      $(".balance-amount").text(user.balanceAmount.toFixed(0));
      $("#newUserId").text(user.userId);
      $("#newestPhone").text(user.phone);
      $("#newProfileName").text(user.profileName || "Guest");

      $("#div2").removeClass().addClass("d-none");

      $(".secondBody").show();

      $("#div1").addClass("d-none");
    } else {
      alert("Invalid phone number or password!");
    }

    $("#phone").val("");
    $("#password").val("");
  },

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

  handleFundAccount: function (e) {
    e.preventDefault();
    let fundAmount = parseFloat($("#fundAmount").val());
    if (fundAmount && fundAmount > 0) {
      let newBalance = this.updateBalance(fundAmount, "add");
      if (newBalance !== false) {
        $(".balance-amount").text(newBalance.toFixed(2));
        alert(`Your account has been funded with ₦${fundAmount}`);
        this.clearModalForms();
        this.closeModal("#fundAccountModal");
      }
    } else {
      alert("Please enter a valid amount.");
    }
  },

  handleTransfer: function (e) {
    e.preventDefault();
    let transferAmount = parseFloat($("#transferAmount").val());
    let recipientId = $("#recipientId").val();
    let sender = this.users.find((user) => user.userId === $("#userId").text());

    if (recipientId === sender.userId) {
      alert("You cannot transfer to yourself!");
      return;
    }

    let recipient = this.users.find((user) => user.userId === recipientId);

    if (transferAmount && transferAmount > 0) {
      if (recipient) {
        let newBalance = this.updateBalance(transferAmount, "subtract");
        if (newBalance !== false) {
          sender.balanceAmount = newBalance;
          recipient.balanceAmount += transferAmount;
          $(".balance-amount").text(sender.balanceAmount.toFixed(2));
          alert(
            `You have successfully transferred ₦${transferAmount} to User ID: ${recipientId}`
          );
          this.clearModalForms();
          this.closeModal("#transferModal");

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

  handleAirtime: function (e) {
    e.preventDefault();
    let airtimeAmount = parseFloat($("#airtimeAmount").val());
    if (airtimeAmount && airtimeAmount > 0) {
      let newBalance = this.updateBalance(airtimeAmount, "subtract");
      if (newBalance !== false) {
        $(".balance-amount").text(newBalance.toFixed(2));
        alert(`You have successfully bought ₦${airtimeAmount} airtime`);
        this.clearModalForms();
        this.closeModal("#airtimeModal");

        $("#airtimeAmount").val("");
      }
    } else {
      alert("Please enter a valid amount.");
    }
  },

  handleData: function (e) {
    e.preventDefault();
    let dataAmount = parseFloat($("#dataAmount").val());
    if (dataAmount && dataAmount > 0) {
      let newBalance = this.updateBalance(dataAmount, "subtract");
      if (newBalance !== false) {
        $(".balance-amount").text(newBalance.toFixed(2));
        alert(`You have successfully bought ₦${dataAmount} data`);
        this.clearModalForms();
        this.closeModal("#dataModal");

        $("#dataAmount").val("");
      }
    } else {
      alert("Please enter a valid amount.");
    }
  },

  clearModalForms: function () {
    $("input[type=text], input[type=number]").val("");
  },

  saveBalanceBeforeLogout: function () {
    let userId = $("#userId").text();
    let user = this.users.find((user) => user.userId === userId);
    if (user) {
      user.balanceAmount = parseFloat($(".balance-amount").text());
    }
  },

  closeModal: function (modalId) {
    $(modalId).hide();
  },
};

// User Interface

$(document).ready(function () {
  $(".secondBody").hide();

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

  setTimeout(function () {
    $("#div1").fadeOut(1000, function () {
      $("#div2").removeClass();

      $("#div2").addClass(
        "fade-box container-fluid d-flex align-items-center justify-content-center vh-100 position-relative bg"
      );

      $("#div2").fadeIn(500);
    });
  }, 8000);

  $("#showSignup, #showLogin").click(function () {
    $("#loginForm").toggle();
    $("#signupForm").toggle();
  });

  $("#signupForm #authSubmitButton").click(function (e) {
    Bank.handleSignup(e);
  });
  $("#loginForm #authSubmitButton").click(function (e) {
    Bank.handleLogin(e);
  });

  $("#fundAccount").click(function () {
    $("#fundAccountModal").show();
  });
  $("#transfer #upTransfer").click(function () {
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
  $("#location").click(function () {
    $("#comingSoonModal").show();
  });
  $("#fxSales").click(function () {
    $("#comingSoonModal").show();
  });
  $("#finances").click(function () {
    $("#comingSoonModal").show();
  });
  $("#payments").click(function () {
    $("#comingSoonModal").show();
  });
  $("#products").click(function () {
    $("#comingSoonModal").show();
  });
  $("#see-more").click(function () {
    $("#comingSoonModal").show();
  });

  $(".modal-close").click(function () {
    Bank.closeModal($(this).closest(".modal"));
  });

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

  $("#logout").click(function () {
    Bank.saveBalanceBeforeLogout();
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
    $("#comingSoonModal").hide();
  });

  $("#copy").click(function () {
    const number = $("#userId").text();

    navigator.clipboard.writeText(number).then(
      function () {
        alert("Copy successful!");

        confetti();
      },
      function (err) {
        alert("Failed to copy: ", err);
      }
    );
  });
});
