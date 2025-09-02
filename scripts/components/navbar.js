export const getNavbar = (empRole, empName, empTheme = 'light') => {
    const lightIcon = `<i class="fa-regular fa-sun"></i>`;
    const darkIcon = `<i class="fa-regular fa-moon"></i>`;
    const serverIcon = `<i class="fa-solid fa-server"></i>`;
    const logoutIcon = `<i class="fa-solid fa-power-off"></i>`;

    return `
    <nav class="navbar navbar-expand-lg" ">
        <div class="container d-flex">
            <a class="navbar-brand" href="#">
                <span class="emp-title">${empRole || 'Not found'} /</span> <span class="emp-name">${empName || 'Not found'}</span>
            </a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav ms-auto me-md-0 me-auto mb-2 mb-lg-0">
                    <li class="nav-item me-md-1 me-auto mx-auto my-1">
                        <a class="btn btn-theme" id="btn-theme">
                            ${empTheme == 'light' ? `dark ${darkIcon}`: `light ${lightIcon}`}
                        </a>
                    </li>
                    <li class="nav-item mx-md-2 mx-auto my-1">
                        <a class="btn btn-reset" onclick="{localStorage.clear()}">
                            reset server ${serverIcon}
                        </a>
                    </li>
                    <li class="nav-item mx-auto my-1">
                        <a class="btn logout" href="../index.html">
                            logout ${logoutIcon}
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    `
};

