// Importing External Packages

const express = require("express")
require('dotenv').config()

// Importing Model

const { Employee } = require("../Models/EmployeeModel.js")

// ...............................................................
const EmployeeRoute = express.Router()

// POST request to add a new employee
EmployeeRoute.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email, department, salary } = req.body;

        const employee = new Employee({
            firstName,
            lastName,
            email,
            department,
            salary
        });

        const savedEmployee = await employee.save();

        res.status(201).send({ msg: "Employee Added" });
    } catch (err) {
        res.status(400).send({ msg: err.message });
    }
});

// GET request to fetch the employees with Pagination

EmployeeRoute.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    try {
        const totalEmployees = await Employee.countDocuments();
        const totalPages = Math.ceil(totalEmployees / limit);

        const employees = await Employee.find()
            .skip(skip)
            .limit(limit);

        res.status(200).send({
            page,
            totalPages,
            employees,
        });
    } catch (err) {
        res.status(500).send({ msg: err.message });
    }
});





// PUT request to edit an employee
EmployeeRoute.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, department, salary } = req.body;

        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            {
                firstName,
                lastName,
                email,
                department,
                salary
            },
            { new: true }
        );

        if (!updatedEmployee) {
            return res.status(404).send({ msg: 'Employee not found' });
        }
        res.status(201).send({ msg: "Employee Details Edited" });


    } catch (err) {
        res.status(400).send({ msg: err.message });
    }
});

// DELETE request to delete an employee
EmployeeRoute.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedEmployee = await Employee.findByIdAndRemove(id);

        if (!deletedEmployee) {
            return res.status(404).send({ msg: 'Employee not found' });
        }
        res.status(201).send({ msg: "Employee Deleted Sucessfully" });
    } catch (err) {
        res.status(500).send({ msg: err.message });
    }
});

module.exports={
    EmployeeRoute
}