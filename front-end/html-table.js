export class HtmlTable {
    constructor(tableAddr, formAddr){
        this.tableAddr = tableAddr;
        this.formAddr = formAddr;
    }
    async getData(){
        let data = await fetch(this.tableAddr);
        if (data.ok){
            data = await data.json();
            return data;
        }
    }
    async buildTable(){
        let data = await this.getData();
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        const body = document.querySelector('body');
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
        let response_obj = await this.getData();

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

        
    
        let button = document.createElement("button");
        button.id = "create-button";
        button.textContent = "Создать запись";
        try{
            button.addEventListener('click', ()=>{this.insertForm()});
        } catch (error){
            console.log(error.text);
        }
        body.appendChild(container);
        body.appendChild(button);
        container.appendChild(table);
        table.appendChild(thead);
        table.appendChild(tbody);
    } catch(error){
        console.log("((");
        console.log(error);
    }
    }
    async getForm(){
        let data = await fetch(`${this.formAddr}?nocache=${Date.now()}`).then(response=>response.text());
        return data;
    }
    async insertForm(){
        if (!document.querySelector("#form-wrapper")){
            let body = document.querySelector('body');
            let formWrapper = document.createElement("div");
            document.querySelector("#overlay").style.display = "block";
            
        
            let form = await this.getForm();

            formWrapper.id = "form-wrapper";
            formWrapper.innerHTML = form;
            formWrapper.style.zIndex = "1001";
            //loadRegionsSelector();

            function closeForm(){
                const form = document.querySelector("#form-wrapper");
                document.querySelector("#overlay").style.display = "none";
                form.remove();
            }
             // Пробуем найти <script> в форме. Если таковые есть, отрабатываем их
            let script = formWrapper.querySelector('script');
            
            let newScript = document.createElement('script');
            newScript.textContent = script.textContent;

    
            body.appendChild(formWrapper);
            body.style.position = "relative";
            let closeHandler = document.querySelector("#close-handler");
            closeHandler.addEventListener('click', closeForm);
            document.head.appendChild(newScript);
            };
            
           
            
        }
}

