export const getNavbar = (empRole, empName) => {
    return `
    <nav class="navbar bg-body-tertiary">
        <div class="container">
            <a class="navbar-brand" href="#">
                ${empRole} / ${empName}
            </a>
            </div>
    </nav>
    `
}; 