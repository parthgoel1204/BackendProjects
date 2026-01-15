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

console.log(Object.keys(groupingTransactions));
console.log(groupingTransactions["Arjun Mehta"]);
