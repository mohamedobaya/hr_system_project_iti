export const paginationEnable = (paginationID, tableID, rowsPerPage = 4) => {
    const table = document.querySelector(`#${tableID}`);
    if (!table) return console.error(`Table with id "${tableID}" not found.`);

    const rows = table.querySelectorAll("tbody tr, tr"); // supports both tbody or direct tr
    const totalRows = rows.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    let currentPage = 1;

    // displaying rows per page number
    const displayRows = (page) => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        rows.forEach((row, index) => {
            row.style.display = (index >= start && index < end) ? "" : "none";
        });
    };

    // catching pagination container by id
    const setupPagination = () => {
        const pagination = document.getElementById(`${paginationID}`);
        if (!pagination) return console.error(`Pagination container "${paginationID}" not found.`);
        pagination.innerHTML = "";

        // Prev button
        const prevBtn = document.createElement("button");
        prevBtn.innerHTML = `<i class="fa-solid fa-angles-left"></i>`;
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => goToPage(currentPage - 1);
        pagination.appendChild(prevBtn);

        // Smarter page numbers with ellipsis
        const maxVisible = 3;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = startPage + maxVisible - 1;
        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        if (startPage > 1) {
            addPageButton(1, pagination);
            if (startPage > 2) addEllipsis(pagination);
        }

        for (let i = startPage; i <= endPage; i++) {
            addPageButton(i, pagination);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) addEllipsis(pagination);
            addPageButton(totalPages, pagination);
        }

        // Next button
        const nextBtn = document.createElement("button");
        nextBtn.innerHTML = `<i class="fa-solid fa-angles-right"></i>`;
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = () => goToPage(currentPage + 1);
        pagination.appendChild(nextBtn);
    };

    // function to go to the target page
    const goToPage = (page) => {
        currentPage = page;
        displayRows(currentPage);
        setupPagination();
    };

    // helper to add a page button
    const addPageButton = (page, pagination) => {
        const btn = document.createElement("button");
        btn.textContent = page;
        if (page === currentPage) btn.classList.add("active");
        btn.onclick = () => goToPage(page);
        pagination.appendChild(btn);
    };

    // helper to add ellipsis (...)
    const addEllipsis = (pagination) => {
        const span = document.createElement("span");
        span.classList += "m-auto"
        span.innerHTML = `<i class="fa-solid fa-ellipsis"></i>`;
        pagination.appendChild(span);
    };

    // initialize
    displayRows(currentPage);
    setupPagination();
};
