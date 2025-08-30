import { lightColorTheme, darkColorTheme, themeStyle, dangerStyle, primaryStyle } from "./themes.js";

export const getNavbar = (empRole, empName, empTheme) => {
    const navbarTheme = empTheme == 'light' ? lightColorTheme: darkColorTheme;
    

    return `
    <nav class="navbar navbar-expand-lg" ${themeStyle(navbarTheme)}">
        <div class="container d-flex" ${themeStyle(navbarTheme)}>
            <a class="navbar-brand" href="#" ${themeStyle(navbarTheme)}>
                ${empRole || 'Not found'} / ${empName || 'Not found'}
            </a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav ms-auto me-md-0 me-auto mb-2 mb-lg-0">
                    <li class="nav-item me-md-1 me-auto mx-auto my-1">
                        <a class="btn btn-primary" ${primaryStyle(navbarTheme)} href="../index.html">
                            <i class="fa-solid fa-circle-half-stroke"></i>
                        </a>
                    </li>
                    <li class="nav-item mx-auto my-1">
                        <a class="btn btn-danger" ${dangerStyle(navbarTheme)} href="../index.html">Logout</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    `
}; 