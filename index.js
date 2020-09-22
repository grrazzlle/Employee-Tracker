const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: 'root',
  database: 'c_m_s',
});

// show whole data table

// connection.connect(function(err) {
//   if (err) throw err;
//   connection.query('SELECT * FROM c_m_s.employee;', function(error, results) {
//     console.table(results);
//     connection.end();
//   });
// });

// Add a department

function addDepartmentPrompt() {
  inquirer.prompt([
    {
      type: 'input',
      message: 'Name of Department?',
      name: 'departmentName',
    },
  ]).then((response) => {
    addDepartmentQuery(response.departmentName);
  });
}

function addDepartmentQuery(departmentName) {
  connection.query(`INSERT INTO department (name) VALUES (?);`, [departmentName], function(error, results) {
    if (error) {
      console.log(error);
      connection.end();
    } else {
      console.log(`Department added successfully.`);
      promptUser();
    }
  });
}

// Add a role

function addRolePrompt() {
  connection.query(`SELECT * FROM department`, (error, departmentList) => {
    const departmentArray = departmentList.map((department) => {
      return {
        name: department.name,
        value: department.id,
      };
    });
    inquirer.prompt([
      {
        type: 'input',
        message: 'Name of Role?',
        name: 'roleName',
      },
      {
        type: 'input',
        message: 'Salary of Role?',
        name: 'salary',
      },
      {
        type: 'list',
        message: 'What department does it belong to?',
        choices: departmentArray,
        name: 'departmentID',
      }]).then((response) => {
      const {roleName, salary, departmentID} = response;
      addRoleQuery(roleName, salary, departmentID);
    });
  });
}

function addRoleQuery(roleName, salary, departmentID) {
  connection.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);`, [roleName, salary, departmentID], function(error, results) {
    if (error) {
      console.log(error);
      connection.end();
    } else {
      console.log(`Role added successfully.`);
      promptUser();
    }
  });
}

// Add an employee

function addEmployeePrompt() {
  connection.query(`SELECT * FROM role`, (error, roleList) => {
    const roleArray = roleList.map((role) => {
      return {
        name: role.title,
        value: role.id,
      };
    });
    connection.query(`SELECT * FROM employee`, (error, managerList) => {
      const managerArray = [{
        name: 'None',
        value: null,
      }, ...managerList.map((employee) => {
        return {
          name: employee.first_name + ' ' + employee.last_name,
          value: employee.id,
        };
      })];
      inquirer.prompt([
        {
          type: 'input',
          message: 'Employees first name?',
          name: 'firstName',
        },
        {
          type: 'input',
          message: 'Employees last name?',
          name: 'lastName',
        },
        {
          type: 'list',
          message: 'Employees role?',
          choices: roleArray,
          name: 'roleID',
        },
        {
          type: 'list',
          message: 'Employees manager?',
          choices: managerArray,
          name: 'managerID',
        }]).then((response) => {
        const {firstName, lastName, roleID, managerID} = response;
        addEmployeeQuery(firstName, lastName, roleID, managerID);
      });
    });
  });
}

function addEmployeeQuery(firstName, lastName, roleID, managerID) {
  connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`, [firstName, lastName, roleID, managerID], function(error, results) {
    if (error) {
      console.log(error);
      connection.end();
    } else {
      console.log(`Employee added successfully.`);
      promptUser();
    }
  });
}

// View departments

function viewDepartmentsQuery() {
  connection.query(`SELECT * FROM department;`, function(error, results) {
    if (error) {
      console.log(error);
      connection.end();
    } else {
      console.table(results);
      promptUser();
    }
  });
}

// View roles

function viewRolesQuery() {
  connection.query(`SELECT * FROM role;`, function(error, results) {
    if (error) {
      console.log(error);
      connection.end();
    } else {
      console.table(results);
      promptUser();
    }
  });
}

// View employees

function viewEmployeesQuery() {
  connection.query(`SELECT * FROM employee;`, function(error, results) {
    if (error) {
      console.log(error);
      connection.end();
    } else {
      console.table(results);
      promptUser();
    }
  });
}

// Update an employees role

function updateEmployeesRolePrompt() {
  connection.query(`SELECT * FROM role`, (error, roleList) => {
    const roleArray = roleList.map((role) => {
      return {
        name: role.title,
        value: role.id,
      };
    });
    connection.query(`SELECT * FROM employee`, (error, employeeList) => {
      const employeeArray = employeeList.map((employee) => {
        return {
          name: employee.first_name + ' ' + employee.last_name,
          value: employee.id,
        };
      });
      inquirer.prompt([
        {
          type: 'list',
          message: 'Which employee would you like to update the role for?',
          choices: employeeArray,
          name: 'employeeID',
        },
        {
          type: 'list',
          message: 'Employees new role?',
          choices: roleArray,
          name: 'roleID',
        }]).then((response) => {
        const {employeeID, roleID} = response;
        updateEmployeesRoleQuery(employeeID, roleID);
      });
    });
  });
}

function updateEmployeesRoleQuery(employeeID, roleID) {
  connection.query(`UPDATE employee SET role_id = ? WHERE id = ?;`, [roleID, employeeID], function(error, results) {
    if (error) {
      console.log(error);
      connection.end();
    } else {
      console.log(`Employee role updated successfully.`);
      promptUser();
    }
  });
}

// Update an employees manager

function updateEmployeesManagerPrompt() {
  connection.query(`SELECT * FROM employee`, (error, employeeList) => {
    const managerArray = [{
      name: 'None',
      value: null,
    }, ...employeeList.map((employee) => {
      return {
        name: employee.first_name + ' ' + employee.last_name,
        value: employee.id,
      };
    })];
    const employeeArray = employeeList.map((employee) => {
      return {
        name: employee.first_name + ' ' + employee.last_name,
        value: employee.id,
      };
    });
    inquirer.prompt([
      {
        type: 'list',
        message: 'Which employee would you like to update the manager for?',
        choices: employeeArray,
        name: 'employeeID',
      },
      {
        type: 'list',
        message: 'Employees new manager?',
        choices: managerArray,
        name: 'managerID',
      }]).then((response) => {
      const {employeeID, managerID} = response;
      updateEmployeesmanagerQuery(employeeID, managerID);
    });
  });
}

function updateEmployeesmanagerQuery(employeeID, managerID) {
  connection.query(`UPDATE employee SET manager_id = ? WHERE id = ?;`, [managerID, employeeID], function(error, results) {
    if (error) {
      console.log(error);
      connection.end();
    } else {
      console.log(`Employees manager updated successfully.`);
      promptUser();
    }
  });
}

// View employees by manager

function viewEmployeesByManagerPrompt() {
  connection.query(`SELECT * FROM employee m
    WHERE (SELECT COUNT(*) FROM employee e
    WHERE e.manager_id = m.id) > 0;`, (error, employeeList) => {
    const employeeArray = employeeList.map((employee) => {
      return {
        name: employee.first_name + ' ' + employee.last_name,
        value: employee.id,
      };
    });
    inquirer.prompt([
      {
        type: 'list',
        message: 'Choose a manager to view the employees of?',
        choices: employeeArray,
        name: 'employeeID',
      }]).then((response) => {
      const {employeeID} = response;
      viewEmployeesByManagerQuery(employeeID);
    });
  });
}

function viewEmployeesByManagerQuery(employeeID) {
  connection.query(`SELECT * FROM employee WHERE manager_id = ?;`, [employeeID], function(error, results) {
    if (error) {
      console.log(error);
      connection.end();
    } else {
      console.table(results);
      promptUser();
    }
  });
}

// Delete a Department

function deleteDepartmentPrompt() {
  connection.query(`SELECT * FROM department`, (error, departmentList) => {
    const departmentArray = departmentList.map((department) => {
      return {
        name: department.name,
        value: department.id,
      };
    });
    inquirer.prompt([
      {
        type: 'list',
        message: 'Which department would you like to delete?',
        choices: departmentArray,
        name: 'departmentID',
      },
    ]).then((response) => {
      deleteDepartmentQuery(response.departmentID);
    });
  });
}

function deleteDepartmentQuery(departmentID) {
  connection.query(`DELETE FROM department WHERE id = ?;`, [departmentID], function(error, results) {
    if (error) {
      console.log(error);
      connection.end();
    } else {
      console.log(`Department deleted successfully.`);
      promptUser();
    }
  });
}

// Delete a Role

function deleteRolePrompt() {
  connection.query(`SELECT * FROM role`, (error, roleList) => {
    const roleArray = roleList.map((role) => {
      return {
        name: role.title,
        value: role.id,
      };
    });
    inquirer.prompt([
      {
        type: 'list',
        message: 'Which role would you like to delete?',
        choices: roleArray,
        name: 'roleID',
      },
    ]).then((response) => {
      deleteRoleQuery(response.roleID);
    });
  });
}

function deleteRoleQuery(roleID) {
  connection.query(`DELETE FROM role WHERE id = ?;`, [roleID], function(error, results) {
    if (error) {
      console.log(error);
      connection.end();
    } else {
      console.log(`Role deleted successfully.`);
      promptUser();
    }
  });
}

// Delete an employee

function deleteEmployeePrompt() {
  connection.query(`SELECT * FROM employee`, (error, employeeList) => {
    const employeeArray = employeeList.map((employee) => {
      return {
        name: employee.first_name + ' ' + employee.last_name,
        value: employee.id,
      };
    });
    inquirer.prompt([
      {
        type: 'list',
        message: 'Which employee would you like to delete?',
        choices: employeeArray,
        name: 'employeeID',
      },
    ]).then((response) => {
      deleteEmployeeQuery(response.employeeID);
    });
  });
}

function deleteEmployeeQuery(employeeID) {
  connection.query(`DELETE FROM employee WHERE id = ?;`, [employeeID], function(error, results) {
    if (error) {
      console.log(error);
      connection.end();
    } else {
      console.log(`Employee deleted successfully.`);
      promptUser();
    }
  });
}

// View utilized budget of a department

function budgetPrompt() {
  connection.query(`SELECT * FROM department`, (error, departmentList) => {
    const departmentArray = departmentList.map((department) => {
      return {
        name: department.name,
        value: department.id,
      };
    });
    inquirer.prompt([
      {
        type: 'list',
        message: 'Which department would you like to view the utilized budget for?',
        choices: departmentArray,
        name: 'departmentID',
      },
    ]).then((response) => {
      budgetQuery(response.departmentID);
    });
  });
}

function budgetQuery(departmentID) {
  connection.query(`SELECT d.id, d.name, SUM(r.salary) budget FROM employee e
  JOIN role r ON e.role_id = r.id
  JOIN department d ON r.department_id = d.id
  WHERE d.id = ?
  GROUP BY d.id`, [departmentID], function(error, results) {
    if (error) {
      console.log(error);
      connection.end();
    } else {
      console.table(results);
      promptUser();
    }
  });
}

// Main Menu

function promptUser() {
  const options = [
    'Add a department',
    'Add a role',
    'Add an employee',
    'View departments',
    'View roles',
    'View employees',
    'Update an employees role',
    'Update an employees manager',
    'View employees by manager',
    'Delete a department',
    'Delete a role',
    'Delete an employee',
    'View utilized budget of a department',
    'exit'];
  inquirer.prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      choices: options,
      name: 'choice',
    },
  ]).then((response) => {
    if (response.choice == options[0]) {
      addDepartmentPrompt();
    } else if (response.choice == options[1]) {
      addRolePrompt();
    } else if (response.choice == options[2]) {
      addEmployeePrompt();
    } else if (response.choice == options[3]) {
      viewDepartmentsQuery();
    } else if (response.choice == options[4]) {
      viewRolesQuery();
    } else if (response.choice == options[5]) {
      viewEmployeesQuery();
    } else if (response.choice == options[6]) {
      updateEmployeesRolePrompt();
    } else if (response.choice == options[7]) {
      updateEmployeesManagerPrompt();
    } else if (response.choice == options[8]) {
      viewEmployeesByManagerPrompt();
    } else if (response.choice == options[9]) {
      deleteDepartmentPrompt();
    } else if (response.choice == options[10]) {
      deleteRolePrompt();
    } else if (response.choice == options[11]) {
      deleteEmployeePrompt();
    } else if (response.choice == options[12]) {
      budgetPrompt();
    } else if (response.choice == options[13]) {
      connection.end();
    }
  });
}
connection.connect(function(err) {
  if (err) throw err;
  promptUser();
});
