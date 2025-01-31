

let users = document.querySelector("#users");
let regions = document.querySelector("#regions");
let cities = document.querySelector("#cities");
const body = document.querySelector("body");

function closeForm(){
    const form = document.querySelector("#form-wrapper");
    document.querySelector("#overlay").style.display = "none";
    form.remove();
}

async function loadRegionsSelector(){
    let regions = await fetch('http://127.0.0.1:8000/regions').then(response=>response.json());
    let regions_value = Object.values(regions);
    let selector = document.querySelector("#regions_selector");
        for (let i = 0; i < regions_value[1].length; i++){
            option = document.createElement("option");
            option.textContent = regions_value[1][i];
            selector.appendChild(option);
        }
}




async function insertForm(point){
    if (!document.querySelector("#form-wrapper")){
        let formWrapper = document.createElement("div");
        document.querySelector("#overlay").style.display = "block";
        let form = await fetch(`forms/${point}-form.html`).then(response=>response.text());
        formWrapper.id = "form-wrapper";
        formWrapper.innerHTML = form;
        formWrapper.style.zIndex = "1001";
        body.appendChild(formWrapper);
        body.style.position = "relative";
        closeHandler = document.querySelector("#close-handler");
        closeHandler.addEventListener('click', closeForm);

        loadRegionsSelector();

        document.querySelector("#cities-form").onsubmit = event => {
            event.preventDefault();
            closeForm();
            fetch(event.target.action, {
                method: 'POST',
                body: new FormData(event.target)
            })
            getTable(point);
        };



    }
    

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