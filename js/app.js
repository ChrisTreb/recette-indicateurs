// LocalStorage
var storage = localStorage;

// Données JSON utilisées pour le stockage
var jsonData = [];

// Mettre à jour le LocalStorage
function setLocalStorage(data) {
    localStorage.setItem('data', JSON.stringify(data));
}

// Chargement des données au chargement de la page
// Depuis le localstorage
window.onload = function() {
    var retrievedData = localStorage.getItem("data");
    if (localStorage.getItem("data") != null) {
        var json = JSON.parse(retrievedData);
        console.log(json);
        for (let i = 0; i < json.length; i++) {
            displayDataOnLoad(json[i]);
        }
    } else {
        json = [];
    }
    jsonData = json;
    if (jsonData.length > 0) {
        popupSuccesDisplay("Indicateurs chargés avec succès")
    }
};

// Effacer le formulaire
function resetForm() {
    try {
        document.getElementById("indicateur").value = "";
        document.getElementById("opcdate").value = "";
        document.getElementById("table").value = "";
        document.getElementById("keyfield1").value = "";
        document.getElementById("keyfield2").value = "";
        document.getElementById("keyfield3").value = "";
        document.getElementById("form-select").value = "";
    } catch (e) {
        console.log(e);
    } finally {
        popupSuccesDisplay("Formulaire vidé avec succès");
    }
}

// Récupération de la requête
function getRequest() {
    var id;
    if (jsonData.length > 0) {
        let lastElId = jsonData[jsonData.length - 1].id;
        id = lastElId + 1;
    } else if (jsonData.length === 0) {
        id = 0;
    }

    console.log(jsonData);

    // Get form data
    var idc = document.getElementById("indicateur").value;
    var opcdate = document.getElementById("opcdate").value;
    var table = document.getElementById("table").value;
    var key_1 = document.getElementById("keyfield1").value;
    var key_2 = document.getElementById("keyfield2").value;
    var key_3 = document.getElementById("keyfield3").value;
    var selectForm = document.getElementById("form-select").value;
    var database = "Hive";

    var data = [];

    if (idc != "" && opcdate != "" && table != "" && key_1 != "" && key_2 != "") {

        switch (selectForm) {
            case "1":
                setHiveRequest(data, id, idc, database, table, opcdate);
                if (key_3 === "") {
                    data.push("SELECT " + key_1 + "," + key_2 + "," + idc + " FROM " + table + " WHERE opcdate ='" + opcdate + "' LIMIT 5;");
                } else {
                    data.push("SELECT " + key_1 + "," + key_2 + "," + key_3 + "," + idc + " FROM " + table + " WHERE opcdate ='" + opcdate + "' LIMIT 5;");
                }
                break;
            case "2":
                setHiveRequest(data, id, idc, database, table, opcdate);
                data.push("SELECT COUNT(*) FROM " + table + " WHERE opcdate ='" + opcdate + " AND " + idc + " > 0;");
                break;
            case "3":
                setHiveRequest(data, id, idc, database, table, opcdate);
                data.push("SELECT COUNT(*) FROM " + table + " WHERE opcdate ='" + opcdate + " AND " + idc + " < 0;");
                break;
            case "4":
                setHiveRequest(data, id, idc, database, table, opcdate);
                data.push("SELECT COUNT(*) FROM " + table + " WHERE opcdate ='" + opcdate + " AND " + idc + " is null;");
                break;
            case "5":
                setHiveRequest(data, id, idc, database, table, opcdate);
                data.push("SELECT " + key_1 + "," + key_2 + ",COUNT(DISTINCT " + idc + ") FROM " + table + " WHERE opcdate ='" + opcdate + "' GROUP BY " + key_1 + "," + key_2 + "," + idc + ";");
                break;
            default:
                console.log("Not a good choice...");
        }
        console.log(data);

        return data;
    } else {
        popupDisplayError("Les champs nécessaires ne sont pas renseignés !");
        data = null;
        return data;
    }
}

// Formattage de la requete hive
function setHiveRequest(data, id, idc, database, table, opcdate) {
    // use this for getRequest function
    data.push(id);
    data.push(idc);
    data.push(opcdate);
    data.push(database);
    data.push(table);
}

// Ajout d'un indicateur dans le tableau JSON
function createIdc() {
    var data = getRequest();
    try {
        // Vérification des données idc
        if (data != undefined || data != null || data != "") {
            let idc = {
                id: data[0],
                indicateur: data[1],
                date: data[2],
                base: data[3],
                table: data[4],
                request: data[5],
                result: ""
            }
            jsonData.push(idc);
            displayData(jsonData);

            // Popup
            popupSuccesDisplay("Indicateur ajouté avec succès");
        }
    } catch (e) {
        console.log(e);
    } finally {
        // Ajout au localstorage
        setLocalStorage(jsonData);
    }
}

// Affichage des données dans la page
function displayData(data) {
    let container = document.getElementById("data-container");
    let div = document.createElement('div');
    div.classList.add("indicateur");
    div.id = "indicateur-" + data[data.length - 1].id;
    div.innerHTML = "<h3>Nom de l'indicateur</h3><p>" + data[data.length - 1].indicateur + "</p><h4>Base de donnée</h4><p>" + data[data.length - 1].base + "</p><h4>Table</h4><p>" + data[data.length - 1].table + "</p>" + "<h4>Date</h4><p>" + data[data.length - 1].date + "</p>" + "<h4>Requête</h4><p>" + data[data.length - 1].request + "</p><label class='form-label result-label'>Résultat</label><textarea class='form-control' id='textarea-" + data[data.length - 1].id + "' placeholder='Collez le résultat de la requête ici'></textarea><button class='btn' onclick='setResult(" + data[data.length - 1].id + ")'>Ajouter</button><button id='delete-" + data[data.length - 1].id + "' class='btn btn-delete delete-btn' onclick='deleteIdc(" + data[data.length - 1].id + ")'>Supprimer</button>";

    container.appendChild(div);
}

// Affichage des données au chargement
function displayDataOnLoad(data) {
    let container = document.getElementById("data-container");
    let div = document.createElement('div');
    div.classList.add("indicateur");
    div.id = "indicateur-" + data.id;
    div.innerHTML = "<h3>Nom de l'indicateur</h3><p>" + data.indicateur + "</p><h4>Base de donnée</h4><p>" + data.base + "</p><h4>Table</h4><p>" + data.table + "</p>" + "<h4>Date</h4><p>" + data.date + "</p>" + "<h4>Requête</h4><p>" + data.request + "</p><label class='form-label result-label'>Résultat</label><textarea class='form-control' id='textarea-" + data.id + "' placeholder='Collez le résultat de la requête ici'></textarea><button class='btn' onclick='setResult(" + data.id + ")'>Ajouter</button><button id='delete-" + data.id + "' class='btn delete-btn btn-delete' onclick='deleteIdc(" + data.id + ")'>Supprimer</button>";

    container.appendChild(div);
}

// Supprimer un indicateur
function deleteIdc(id) {
    try {
        for (let i = 0; i < jsonData.length; i++) {
            if (jsonData[i].id === id) {
                jsonData.splice(jsonData[i], 1);
            }
        }

        let elId = "indicateur-" + id;
        let idcElement = document.getElementById(elId);
        idcElement.remove();
        console.log(jsonData);
    } catch (e) {
        console.log(e);
    } finally {
        setLocalStorage(jsonData);
        // Show pop up
        popupSuccesDisplay("Indicateur supprimé avec succès")
    }
}

// Générer les requêtes Oracle à partir de celles Hive
function generateOracleRequests() {
    if (jsonData.length > 0) {
        for (let i = 0; i < jsonData.length; i++) {
            if (jsonData[i].base === "Hive" && jsonData[i].result != "") {
                console.log("Génération des requêtes Oracle...");
                console.log(jsonData[i]);
            }
        }
        popupSuccesDisplay("Requêtes Oracle : Chargées")
    } else {
        popupDisplayError("Pas de données disponibles")
        console.log("No data available...");
    }
}

// Ajouter le résultat d'une requête
function setResult(id) {
    try {
        let val = document.getElementById("textarea-" + id).value.replace(/(\r\n|\n|\r)/gm, " ");
        if (val != "") {
            for (let i = 0; i < jsonData.length; i++) {
                if (jsonData[i].id === id) {
                    jsonData[i].result = val;
                    popupSuccesDisplay("Résultat ajouté avec succès");
                }
            }
            console.log(jsonData[id]);
        } else {
            // Popup error
            popupDisplayError("Le champ résultat est vide !");
        }
    } catch (e) {
        console.log(e);
    }
}

// Fonction de téléchargement du fichier JSON
function download(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

// Télécharger le fichier Json
function getJsonFile() {
    if (jsonData.length > 0) {
        download(JSON.stringify(jsonData), "recette.json", "json/plain");
    } else {
        popupDisplayError("Pas de données JSON")
        console.log("jsonData is empty");
    }
}

// Télécharger le fichier CSV
function getCsvFile() {
    if (jsonData.length > 0) {
        var csv = "";

        for (let i = 0; i < jsonData.length; i++) {
            csv += "Indicateur," + jsonData[i].indicateur + "\r\n";
            csv += "Base de données," + jsonData[i].base + "\r\n";
            csv += "Table," + jsonData[i].table + "\r\n";
            csv += "Requête," + jsonData[i].request + "\r\n";
            csv += "Résultat," + jsonData[i].result + "\r\n";
            csv += "\r\n";
        }

        download(csv, "recette.csv", "text/csv;encoding:utf-8");
    } else {
        popupDisplayError("Pas de donnée enregistrée")
        console.log("jsonData is empty");
    }
}

// PopUps behaviour
function popupSuccesDisplay(message) {
    $("#popup-message").html(message)
    $("#popup").fadeIn("slow").delay(1000).fadeOut('fast');
}

function popupDisplayError(message) {
    $("#popup-error-message").html(message)
    $("#popup-error").fadeIn("slow").delay(1000).fadeOut('fast');
}