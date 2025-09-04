import { getEmployeeByID } from "../components/reusableFunctions.js";
export const calculateIdealEmployee = (data) => {
    let getFirstEmployee = [];

    for (const emp of data.employees) {
        const attendance = data.attendanceRecords.filter(r => r.employeeId === emp.id && r.status === "Present").length
        const completedTasks = data.tasks.filter(t => t.employeeId === emp.id && t.status === "Completed").length
        const requestsMade = data.requests.filter(r => r.employeeId === emp.id).length;

        getFirstEmployee.push({ id: emp.id, attendance, completedTasks, requestsMade });
    }

    let idealEmployee = getFirstEmployee[0];

    for (const emp of getFirstEmployee) {
        if (
            emp.attendance >= idealEmployee.attendance &&
            emp.completedTasks >= idealEmployee.completedTasks &&
            emp.requestsMade <= idealEmployee.requestsMade
        ) {
            idealEmployee = emp;
        }
    }
    console.log(getEmployeeByID(idealEmployee.id));
    return getEmployeeByID(idealEmployee.id);
};



//  taskqueue  (Raneem)
window.onload = function () {

    //     const taskqueue = [
    //     {
    //         "low":5,
    //         "medium":8,
    //         "high":12,
    //         "critical":15
    //     }
    // ]

    const taskQuota = localStorage.getItem("taskQuota")


    function taskQueue() {
        let stored = JSON.parse(localStorage.getItem("taskQuota"));

        let valueRate = stored || taskQuota;

        document.getElementById('settings-low').value = valueRate.low;
        document.getElementById('settings-medium').value = valueRate.medium;
        document.getElementById('settings-high').value = valueRate.high;
        document.getElementById('settings-critical').value = valueRate.critical;
    }


    function saveTaskQueue() {
        let newValuerate = [
            {
                "low": document.getElementById('settings-low').value,
                "medium": document.getElementById('settings-medium').value,
                "high": document.getElementById('settings-high').value,
                "critical": document.getElementById('settings-critical').value

            }
        ];
        localStorage.setItem('taskQueue', JSON.stringify(newValuerate));
    }


    document.querySelectorAll('#settings-low , #settings-medium , #settings-high , #settings-critical')
        .forEach(input => {
            input.addEventListener("input", saveTaskQueue)
        });

    taskQueue();


}