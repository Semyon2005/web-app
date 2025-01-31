async function insertForm(){
    let formWrapper = document.querySelector("#form-wrapper");
    let form = await fetch("cities-form.html");
    formWrapper.appendChild(form);
}