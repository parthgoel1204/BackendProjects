const { log } = require("console");
const fs = require("fs");

const employees = JSON.parse(fs.readFileSync("./employees.json","utf-8"));

// console.log("EMPLOYEES",employees);

// Used shallow copy that is similar to call by value so that original employees does not get modified by the use of sort function
const sortedEmployees = [...employees].sort(function(e1,e2){
    return e2.salary - e1.salary;
});
console.log("Sorted List of Employees: ",sortedEmployees);
// const experiencedEmployees = [];
// sortedEmployees.filter((e) => {
//     if(e.experience >= 3){
//         experiencedEmployees.push(e);
//     }
// });
// console.log(sortedEmployees.length);


// console.log(experiencedEmployees.length);

const experiencedEmployees = sortedEmployees.filter((e) => {
    return e.experience >= 3;
})

// console.log(experiencedEmployees.length);

const summaryEmployees = [];

experiencedEmployees.forEach((e) => {
    summaryEmployees.push({
        Name: e.name,
        Department: e.department,
        Bonus: e.salary * 0.1 * e.experience
    });
    // summaryEmployees.push(`Department: ${e.department}`);
    // summaryEmployees.push(`Bonus: ${bonus = e.salary * 0.1 * e.experience}`);
})

console.log("Summary List of employees: ",summaryEmployees);

const totalSalary = summaryEmployees.reduce(function (acc,curr){
    acc += curr.Bonus;
    return acc;
},0);

console.log("Total Salary Expenditure: ",totalSalary);
