let userEmail = localStorage.getItem("userEmail");
let prodID = localStorage.getItem("prodID");
let productInfo = undefined;
let commentsArray = []; 
let currentCommentsArray = [];
let PRODUCTS_INFO_ID_URL = `${PRODUCT_INFO_URL}${prodID}${EXT_TYPE}`;
let PRODUCT_COMMENTS_ID_URL = `${PRODUCT_INFO_COMMENTS_URL}${prodID}${EXT_TYPE}`;

function setNewProductID(id){
    localStorage.setItem("prodID", id);
    window.location = "product-info.html"
};

function addStarRating(rate){
    let htmlContentToAppend = "";
    for(let i = 0; i < rate; i++){
        htmlContentToAppend += `
        <span class="fa fa-star checked"></span>
        `
    };
    for(let j = 0; j < 5-rate; j++){
        htmlContentToAppend += `
        <span class="fa fa-star"></span>
        `
    };
    return htmlContentToAppend;
};

function addNewComment(score,desc,date){
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let newComment = {
        "product": parseInt(prodID),
        "score": parseInt(score),
        "description": desc,
        "user": userEmail,
        "dateTime": `${year}-${month}-${day} ${date.toLocaleTimeString()}`
    };
    currentCommentsArray = commentsArray;
    currentCommentsArray.push(newComment);
    showComments(currentCommentsArray);
};

function showComments(array){
    let htmlContentToAppend = "";
    let addComments = "";
    if (array.length != 0){
        for(let i = 0; i < array.length; i++){
            addComments += `
            <li class="list-group-item">
                <p class="m-0"><b>${array[i].user}</b> - ${array[i].dateTime} - ${addStarRating(array[i].score)}</p>
                <p class="m-0">${array[i].description}</p>
            </li>
            `
        };
    } else {
        addComments += `
        <p class="m-0">Todavía no hay comentarios.</p>
        `
    };
    htmlContentToAppend += `
    <div class="row">
        <h4 class="my-4">Comentarios</h4>
        <div>
            <ul class="list-group">${addComments}</ul>
        </div>
    </div>
    `
    document.getElementById("product-comments").innerHTML = htmlContentToAppend;
};

function showProduct(prod){
    let productInfo = "";
    let addImages = "";
    let imgArray = prod.images;
    let relatedProducts = "";
    let relatedProdImg = "";
    for(let i = 0; i < imgArray.length; i++){
        addImages += `
        <div class="col-3">
            <img src="${imgArray[i]}" class="img-thumbnail">
        </div>
        `
    };
    for(let j = 0; j < prod.relatedProducts.length; j++){
        relatedProdImg += `
        
        <div onclick="setNewProductID(${prod.relatedProducts[j].id})" class="col-3 card-group cursor-active">
            <div class="card">
                <img src="${prod.relatedProducts[j].image}" class="card-img-top">
                <h5 class="card-title my-4 mx-2">${prod.relatedProducts[j].name}</h5>
            </div>
        </div>
        `
    };
    relatedProducts += `
    <div class="container">
        <div class="row">
            <h4 class="my-4">Productos relacionados</h4>
            ${relatedProdImg}
        </div>
    </div>
    `
    productInfo += `
        <div class="row">
            <h3 class="my-4">${prod.name}</h3><hr>
            <b>Precio</b>
            <p>${prod.currency} ${prod.cost}</p>
            <b>Descripción</b>
            <p>${prod.description}</p>
            <b>Categoría</b>
            <p>${prod.category}</p>
            <b>Cantidad de vendidos</b>
            <p>${prod.soldCount}</p>
            <b>Imágenes ilustrativas</b>
            ${addImages}
        </div>
        `
    document.getElementById("product-info").innerHTML = productInfo;
    document.getElementById("related-products").innerHTML = relatedProducts;
};

document.addEventListener("DOMContentLoaded",function(){

    getJSONData(PRODUCT_COMMENTS_ID_URL).then(objProdComments => { 
        if (objProdComments.status === "ok") {
            commentsArray = objProdComments.data;
            showComments(commentsArray);
        };
    });

    getJSONData(PRODUCTS_INFO_ID_URL).then(objProductInfo => { 
        if (objProductInfo.status === "ok") {
            productInfo = objProductInfo.data;
            showProduct(productInfo);
        };
    });

    document.getElementById("profile").innerHTML = `${userEmail}`;

    document.getElementById("logout").addEventListener("click", function(){
        localStorage.removeItem("userEmail");
    });

    document.getElementById("add-comment").addEventListener("submit",function(event){
        event.preventDefault();

        let comment = document.getElementById("textArea").value;
        let date = new Date();
        let score = document.getElementById("select-score").value;
        if(comment != "" && score != 0){
            addNewComment(score,comment,date);
            document.getElementById("textArea").value = "";
            document.getElementById("select-score").value = 0;
        } else {
            alert("Debe ingresar un comentario y un puntaje antes de enviar.")
        };
    });
});