

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
    async delData(id){

        let data = await fetch(`${this.tableAddr}\\${id}`,{
            method: 'DELETE',
            headers: {
                'Content-Type':'application/json'
            }
        
        });
        if (data.ok){
            data = await data.json();

            let all = document.querySelectorAll('#table tr');
            for (let i = 0; i < all.length; i++){
                let cell_id = all[i].firstChild
                if (cell_id.textContent == data[1][0]) {
                    document.querySelector('#table tbody').removeChild(all[i]);
                }

            }
        }       
    }
    

    async buildTable(){
        //
        // Получаем основные элементы страницы и создаем необходимые для построения
        // Таблицы
        //
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        const body = document.querySelector('body');
        const container = document.querySelector("#table-wrapper")

        table.id = "table";
        const existingTable = document.querySelector('#table');
        const existingButton = document.querySelector('#create-button');
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
        let actionsHeader = document.createElement('th');
        actionsHeader.textContent = "Кнопки взаимодействия";
        actionsHeader.setAttribute("colspan", '2');

        
        thead.appendChild(actionsHeader);
        for (let i = 0; i < table_rows[0].length; i++){
            let row = document.createElement('tr');





            let delete_row_button = document.createElement('button');
            delete_row_button.addEventListener('click',()=>{
                let id = table_rows[0][i]; //id 
                console.log('i am boss');
                this.delData(id);
            })



            let change_row_button = document.createElement('button');
            delete_row_button.textContent = "Удалить запись";
            change_row_button.textContent = "Изменить запись";
            row.className = "table-row";
            for (let j = 0; j < table_rows.length; j++){
                let cell = document.createElement('td');
                cell.className = "row-cell";
                cell.textContent = table_rows[j][i];
                row.appendChild(cell);
            }

            let delete_cell = document.createElement('td')
            delete_cell.classList.add("action_button_cell");
            delete_cell.appendChild(delete_row_button);
            
            let change_cell = document.createElement('td')
            change_cell.classList.add("action_button_cell");
            change_cell.appendChild(change_row_button);

            row.appendChild(delete_cell);
            row.appendChild(change_cell);
            
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
                const headerScript = document.head.querySelector('script');
                if (headerScript)
                    headerScript.remove();
                document.querySelector("#overlay").style.display = "none";
                form.remove();
            }
             // Пробуем найти <script> в форме. Если таковые есть, отрабатываем их
            

    
            body.appendChild(formWrapper);
            body.style.position = "relative";
            let closeHandler = document.querySelector("#close-handler");
            closeHandler.addEventListener('click', closeForm);
            

            let script = formWrapper.querySelector('script');
            if (script){
                let newScript = document.createElement('script');
                newScript.textContent = script.textContent;
                document.head.appendChild(newScript);
            }

            document.querySelector('#send-handler').addEventListener('click', async ()=>{
                const result = await this.sendData(this.tableAddr);
                
                if (result && result.ok){
                    const info = await result.json();

                    
                    closeForm();
                }

            });
    

            };
            
           
            
        }
    async sendData(){
        const inputs = document.querySelectorAll('.input-field');
        const data = {};



        for (let i = 0; i < inputs.length; i++){
            let input = inputs[i];
            if (input.value.trim() === '') {

                input.style.border = '2px solid red';
                input.title = 'Поле обязательно для заполнения!';
                input.focus();
                const event = new MouseEvent('mouseover');
                input.dispatchEvent(event);
                return;
            }
            input.title = '';
            const key = input.name;
            data[key] = input.value;
        }
        const jsonData = JSON.stringify(data);
        const request = await fetch(this.tableAddr, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: jsonData,
        })
        if (request.ok){
            console.log('yes');
            return request;
        }

    }
}

