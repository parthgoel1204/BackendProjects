const fs = require("fs");

const file = fs.readFileSync("./bank_statements.csv","utf-8");

// console.log(file);
// console.log(typeof(file));

// Splitting each row in an array 
const rows = file.split("\n");

// console.log(rows.length);
// console.log(rows);
// console.log(rows[rows.length - 1]);

const columns = rows[0].split(",");
// console.log(columns);

const transactions = [];
for(let i =1; i<rows.length; i++ ){

    if(rows[i] === "") continue;

    const values = rows[i].split(",");
    const myObject = {};
    for(let j=0;j<columns.length; j++){
        myObject[columns[j]] = values[j];
    }
    
    transactions.push(myObject);
}
 
// console.log(transactions);
// console.log(transactions.length);

for (let i = 0; i < transactions.length; i++) {
    transactions[i].Amount = parseInt(transactions[i].Amount, 10);
    transactions[i].Date = new Date(transactions[i].Date);
}

// console.log(transactions);
// console.log(typeof transactions.Amount); 
// console.log(transactions.Date instanceof Date); 

transactions.sort((a, b) => a.Date - b.Date);

// console.log(transactions);
// console.log(transactions[0].Date);
// console.log(transactions[transactions.length - 1].Date);

const groupingTransactions = {};
transactions.forEach( (transaction) => {
    const name  = transaction.AccountHolder;

    if(!groupingTransactions[name]){
        groupingTransactions[name] = [];
    }

    groupingTransactions[name].push(transaction);
});

// console.log(Object.keys(groupingTransactions));
// console.log(groupingTransactions["Arjun Mehta"]);

const userSummary = {};
for(const key in groupingTransactions){
    let totalCredit = groupingTransactions[key].reduce((acc,curr) => {
        if(curr.Type === "Credit"){
            acc += curr.Amount;
        }
        return acc;
    },0);
    let totalDebit = groupingTransactions[key].reduce((acc,curr) => {
        if(curr.Type === "Debit"){
            acc += curr.Amount;
        }
        return acc;
    },0);

    const largestTransaction = groupingTransactions[key].reduce((max, curr) => {
        if (curr.Amount > max.Amount) {
            max = curr;
        }
        return max;
    });

    const salaryTransactions = groupingTransactions[key]
        .filter(txn => txn.Remarks.includes("Salary"))
        .map(txn => txn.TransactionID);
    
    userSummary[key] = {
        TotalCredit: totalCredit,
        TotalDebit: totalDebit,
        LargestTransaction : largestTransaction.Amount,
        SalaryTransactions : salaryTransactions
    };
}

// console.log(userSummary);
// console.log(userSummary["Arjun Mehta"]);

// console.log(userSummary["Arjun Mehta"].LargestTransaction);
// console.log(userSummary["Arjun Mehta"].SalaryTransactions);

const finalSummary = [];

for (const user in userSummary) {
    finalSummary.push({
        AccountHolder: user,
        TotalCredit: userSummary[user].TotalCredit,
        TotalDebit: userSummary[user].TotalDebit,
        LargestTransaction: userSummary[user].LargestTransaction,
        SalaryTransactions: userSummary[user].SalaryTransactions.join("|")
    });
}
const headers = Object.keys(finalSummary[0]).join(",");

const rowsCsv = finalSummary.map(obj =>
    Object.values(obj).join(",")
);

const csvContent = [headers, ...rowsCsv].join("\n");

fs.writeFileSync("bank_summary.csv", csvContent);