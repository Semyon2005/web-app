let users = document.querySelector("#users");
let regions = document.querySelector("#regions");
let cities = document.querySelector("#cities");
let body = document.querySelector("body");

async function getTable(event) {
    let table = document.createElement('table');
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    
    let response = await fetch(`http://127.0.0.1:8000/${event.target.id}`);
    let response_obj = await response.json();
    
    let table_headers = Object.keys(response_obj);
    let table_rows = Object.values(response_obj);

    const existingTable = document.querySelector('table');
    if (existingTable) {
        existingTable.remove();  // Удаляет найденную таблицу
    }

    for (let i = 0; i < table_headers.length; i++){
        let header = document.createElement('th');
        header.textContent = table_headers[i];
        thead.appendChild(header);
    }

    for (let i = 0; i < table_rows[0].length; i++){
        let row = document.createElement('tr');
        for (let j = 0; j < table_rows.length; j++){
            let cell = document.createElement('td');
            cell.textContent = table_rows[j][i];
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }
    body.append(table);
    table.appendChild(thead);
    table.appendChild(tbody);

}



users.addEventListener('click', getTable);
regions.addEventListener('click', getTable);
cities.addEventListener('click',getTable);