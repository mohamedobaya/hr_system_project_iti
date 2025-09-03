export const getProfile = (emp) => {
    return `
        <div class="profile d-flex flex-md-row flex-column  align-items-center">
            <div class="profile-avatar">
                ${getProfileIcon(emp.role)}
            </div>
            <div class="profile-info">
                <h3 class="profile-info-role emp-title">${emp.role}</h3>
                <h5 class="profile-info-name emp-name">${emp.name}</h5>
                <ul>
                    <li class="profile-info-username">
                        <span class="emp-title">User name</span> 
                        <span class="">${emp.username}</span>
                    </li>
                    <li class="profile-info-department">
                        <span class="emp-title">Department</span> 
                        <span class="">${emp.department}</span>
                    </li>
                    <li class="profile-info-salary">
                        <span class="emp-title">Salary</span> 
                        <span class="">${emp.monthlySalary}$</span>
                    </li>
                    <li class="profile-info-vacation">
                        <span class="emp-title">Vacation days left</span> 
                        <span class="">${emp.annualVacationDays}</span>
                    </li>
                </ul>
            </div>
        </div>
    `;
}


const getProfileIcon = (role) => {
    switch (role) {
        case "Manager":
            return `<i class="fa-solid fa-user-tie"></i>`;
        case "Security":
            return `<i class="fa-solid fa-user-shield"></i>`;
        case "HR":
            return `<i class="fa-solid fa-user-pen"></i>`;
        default:
            return `<i class="fa-solid fa-user"></i>`;
    }
}