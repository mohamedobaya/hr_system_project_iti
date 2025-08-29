export class Employee {

    constructor(id, name, department, role, monthlySalary, annualVacationDays, username, password) {
        this.id = id;
        this.name = name;
        this.department = department;
        this.role = role;
        this.monthlySalary = monthlySalary;
        this.annualVacationDays = annualVacationDays;
        this.preferences = {
            language: 'en',
            theme: 'light',
            dateFormat: 'DD-MM-YYYY'
        }
        this.username = username;
        this.password = password;
    }

    // prefrences-setter methods
    setLanguage(lang) {
        this.preferences.language = lang;
    }
    setTheme(themeMode) {
        if (themeMode == 'light' || themeMode == 'dark')
            this.preferences.theme = themeMode;
        else
            this.preferences.theme = 'light';
    }
    setDateFormat(dFormat) {
        const dateFormats = ['DD-MM-YYYY', 'MM-DD-YYYY', 'YYYY-MM-DD', 'YYYY-DD-MM', 'DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY/MM/DD', 'YYYY/DD/MM']
        if (dateFormats.includes(dFormat))
            this.preferences.dateFormat = dFormat;
        else
            this.preferences.dateFormat = 'DD-MM-YYYY';
    }

    // salary-methods
    getDailyWage() {
        return this.monthlySalary / 30;
    }
    getHourlyRate() {
        return this.getDailyWage() / 8;
    }

    // JSON serialization
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            department: this.department,
            role: this.role,
            monthlySalary: this.monthlySalary,
            annualVacationDays: this.annualVacationDays,
            preferences: this.preferences,
            username: this.username,
            password: this.password
        };
    }

    // raw JSON string
    toJSONString() {
        return JSON.stringify(this.toJSON());
    }
}

export class AttendanceRecord {
    constructor(id, employeeId, date, checkIn, checkOut, status, minutesLate = 0, isWFH = false, isLeave = false, notes = "") {
        this.id = id;
        this.employeeId = employeeId;
        this.date = date;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.status = status; // "Present" | "Late" | "Absent" | "Leave" | "WFH"
        this.minutesLate = minutesLate;
        this.isWFH = isWFH;
        this.isLeave = isLeave;
        this.notes = notes;
    }

    calculateStatus(officialStart = new Date(... '09:00')) {
        // Logic for Present/Late/Absent 
    }
}

export class PermissionRequest {
    constructor(id, employeeId, type, payload, status = "Pending", managerComment = "", createdAt = new Date(), decidedAt = null) {
        this.id = id;
        this.employeeId = employeeId;
        this.type = type; // "Late" | "Absence" | "WFH" | "Overtime" | "DeadlineExtension"
        this.payload = payload; // { requestedDate, minutesExpectedLate, reason, weekIndex, taskId?, overtimeHours? }
        this.status = status; // "Pending" | "Approved" | "Rejected"
        this.managerComment = managerComment;
        this.createdAt = createdAt;
        this.decidedAt = decidedAt;
    }
}

export class Task {
    constructor(taskId, title, description, priority, deadline, assignees = [], status = "Not Started", attachments = [], comments = [], createdBy, createdAt = new Date(), updatedAt = null, dependencyTaskIds = []) {
        this.taskId = taskId;
        this.title = title;
        this.description = description;
        this.priority = priority; // "Low" | "Medium" | "High" | "Critical"
        this.deadline = deadline;
        this.assignees = assignees;
        this.status = status;
        this.attachments = attachments;
        this.comments = comments;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.dependencyTaskIds = dependencyTaskIds;
    }
}

export class MonthlyPayrollImpact {
    constructor(employeeId, month) {
        this.employeeId = employeeId;
        this.month = month;
        this.latePenalty = 0;
        this.absencePenalty = 0;
        this.taskPenalty = 0;
        this.overtimePay = 0;
        this.bonus = 0;
        this.capApplied = false;
    }
}