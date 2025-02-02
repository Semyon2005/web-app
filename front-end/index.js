import { HtmlTable } from "./html-table.js";

let users = document.querySelector("#users");
let regions = document.querySelector("#regions");
let cities = document.querySelector("#cities");

const users_page = new HtmlTable('http://127.0.0.1:8000/users', 'forms/cities-form.html');
const regions_page = new HtmlTable('http://127.0.0.1:8000/regions', 'forms/cities-form.html');
const cities_page = new HtmlTable('http://127.0.0.1:8000/cities', 'forms/cities-form.html');

users.addEventListener('click', ()=> {
    users_page.buildTable();
});
regions.addEventListener('click', ()=> {
    regions_page.buildTable();
});
cities.addEventListener('click', ()=>{
    cities_page.buildTable();
});