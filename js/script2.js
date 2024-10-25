// Simplified Bank Object with Debugging
let Bank = {
    users: [],


    // Save transaction history to localStorage
    addTransactionHistory: function (userId, amount, type) {
        let user = this.users.find(user => user.userId === userId);
        if (user) {
            const transaction = {
                date: new Date().toLocaleString(),
                type: type,
                amount: amount
            };
            user.transactionHistory.unshift(transaction);
            localStorage.setItem(`transactionHistory_user_${userId}`, JSON.stringify(user.transactionHistory));
            console.log(`Transaction added:`, transaction); // Debugging line
            this.displayTransactionHistory(userId);
        } else {
            console.error("User not found.");
        }
    },


    // Simplified handleFundAccount function to test transaction history
    handleFundAccount: function (e) {
        e.preventDefault();
        let fundAmount = parseFloat($("#fundAmount").val());
        let userId = $("#userId").text();
        if (fundAmount && fundAmount > 0) {
            let newBalance = this.updateBalance(fundAmount, "add");
            if (newBalance !== false) {
                $(".balance-amount").text(newBalance.toFixed(2));
                alert(`Your account has been funded with ₦${fundAmount}`);
                this.addTransactionHistory(userId, fundAmount, "credit");
            }
        } else {
            alert("Please enter a valid amount.");
        }
    },





    // Additional helper functions go here...
};

$(document).ready(function () {
    // Bind UI elements to functions here, e.g., form submissions
});
