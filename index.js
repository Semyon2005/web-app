

let users = document.querySelector("#users");
let regions = document.querySelector("#regions");
let cities = document.querySelector("#cities");
const body = document.querySelector("body");

function closeFrom(){
    const form = document.querySelector("#form-wrapper");
    body.backgroundColor = "white";
}


async function insertForm(point){
    let formWrapper = document.createElement("div");
    let form = await fetch(`forms/${point}-form.html`).then(response=>response.text());
    formWrapper.id = "form-wrapper";
    formWrapper.innerHTML = form;
    body.appendChild(formWrapper);
    body.style.backgroundColor = "rosybrown";
    body.style.position = "relative";
    closeHandler = document.querySelector("#close-handler");
    closeHandler.addEventListener('click', closeFrom);

} 




async function getTable(point) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const container = document.querySelector("#table-wrapper")


    table.id = "table";


    const existingTable = document.querySelector('#table');
    const existingButton = document.querySelector('button');
    if (existingButton){
        existingButton.remove();
    }
    if (existingTable){
        existingTable.remove();
    }
    

    
    try{
        let response = await fetch(`http://127.0.0.1:8000/${point}`);
        if (!response.ok){
            throw new Error(`Ошибка статуса`);
        }
        let response_obj = await response.json();
        let table_headers = Object.keys(response_obj);
        let table_rows = Object.values(response_obj);
        for (let i = 0; i < table_headers.length; i++){
            let header = document.createElement('th');
            header.className = "header-cell";
            header.textContent = table_headers[i];
            thead.appendChild(header);
            
        }
        for (let i = 0; i < table_rows[0].length; i++){
            let row = document.createElement('tr');
            row.className = "table-row";
            for (let j = 0; j < table_rows.length; j++){
                let cell = document.createElement('td');
                cell.className = "row-cell";
                cell.textContent = table_rows[j][i];
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        }

        
    
        
        button = document.createElement("button");
        button.id = "create-button";
        button.textContent = "Создать запись";
        button.addEventListener('click', ()=>{insertForm(point)})

        body.appendChild(container);
        body.appendChild(button);
        container.appendChild(table);
        table.appendChild(thead);
        table.appendChild(tbody);
    } catch(error){

    }

}





users.addEventListener('click', ()=>{getTable("users")});
regions.addEventListener('click', ()=>{getTable("regions")});
cities.addEventListener('click',()=>{getTable("cities")});