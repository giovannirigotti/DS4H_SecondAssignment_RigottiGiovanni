// -----------------
// GENERAL SECTION
// -----------------

// GLOBAL Json variable
var jsonLibrary;

// On init section
window.onload = init;

function init() {
  console.log(". . . PAGE READY . . .");
  let emptyJson = '{ "mediaLibrary" : []}';
  jsonLibrary = JSON.parse(emptyJson);
}

// Load library from json file (triggered by button)
function loadTable(){
  console.log("--> LOAD TABLE");

  const jsonDataUrl = './data/library.json';

  return fetch(jsonDataUrl)
    .then(response => response.json())
    .then(data => {
      // Now 'data' contains the parsed JSON
      console.log("--> JSON LIBRARY LOADED");
      // Update jsonLibrary
      jsonLibrary = data;
      renderTable(jsonLibrary, document.querySelector("#elementsXpage").value);
      return;
    })
    .catch(error => {
      console.error(' --> ERROR FETCHING JSON:', error);
      return; // Re-throw the error to propagate it
    });
}

function renderTable(_library, _rows){
  console.log("--> RENDER TABLE");

  // variables
  let render_section = document.querySelector("#render_section");
  let rows = _rows;
  let library = _library;
  let pages = 1;

  if(library == null || library == undefined){
    render_section.innerHTML = "LOADING ERROR";
    return;
  }
  
  console.log(JSON.stringify(library));
  let library_length = library["mediaLibrary"].length;

  if(rows == null || rows == undefined){
    rows = library_length;
  }
  else{
    if(rows > library_length){
      rows = library_length;
    }
    else{
      let mod = library_length % rows;
      if(mod == 0){
        pages = library_length / rows;
      }
      else{
        pages = Math.floor(library_length / rows) + 1;
      }
    }
  }

  paginateTable(library["mediaLibrary"], rows, pages);
}

function paginateTable(_libraryArray, _rows, _pages){
  console.log("--> PAGINATE TABLE");

  let render_section = document.querySelector("#render_section");
  let table_nav = document.querySelector("#table_nav");

  render_section.innerHTML = "";
  table_nav.innerHTML = "";

  let element = 0;
  let page_num = 0;
  
  for(let p = 0; p < _pages; p++){
    page_num = p + 1;

    let tmp_btn = document.createElement("button");
    tmp_btn.setAttribute("onclick", "showPages(" + page_num + ")");
    tmp_btn.textContent = page_num;
    $('#table_nav').append(tmp_btn);
    
    // Create div
    let tmp_div = document.createElement('div');
    let page_id = "page_" + page_num;
    tmp_div.setAttribute("id", page_id);
    tmp_div.setAttribute("class", "div_page");

    // Create table to append later
    let tmp_table = document.createElement('table');
    let table_id = "table_" + page_num;
    tmp_div.setAttribute("id", table_id);

    // Create table columns title
    let tmp_tr = document.createElement('tr');

    let tmp_th_type = document.createElement('th');
    tmp_th_type.textContent = "TYPE";
    tmp_th_type.setAttribute("onclick","sort('type')");
    let tmp_th_name = document.createElement('th');
    tmp_th_name.textContent = "NAME";
    tmp_th_name.setAttribute("onclick","sort('name')");
    let tmp_th_plat = document.createElement('th');
    tmp_th_plat.textContent = "PLATFORMS";
    let tmp_th_acto = document.createElement('th');
    tmp_th_acto.textContent = "ACTORS";
    let tmp_th_dire = document.createElement('th');
    tmp_th_dire.textContent = "DIRECTOR";
    tmp_th_dire.setAttribute("onclick","sort('director')");
    let tmp_th_year = document.createElement('th');
    tmp_th_year.textContent = "YEAR";
    tmp_th_year.setAttribute("onclick","sort('year')");
    let tmp_th_imag = document.createElement('th');
    tmp_th_imag.textContent = "IMAGE";
    let tmp_th_delete = document.createElement('th');
    tmp_th_delete.textContent = "DELETE";

    tmp_tr.append(tmp_th_type);
    tmp_tr.append(tmp_th_name);
    tmp_tr.append(tmp_th_plat);
    tmp_tr.append(tmp_th_acto);
    tmp_tr.append(tmp_th_dire);
    tmp_tr.append(tmp_th_year);
    tmp_tr.append(tmp_th_imag);
    tmp_tr.append(tmp_th_delete);

    tmp_table.append(tmp_tr);

    for(let r = 0; r < _rows; r++)
    {
      if(element >= _libraryArray.length){ break; }

      let tmp_row = document.createElement('tr');

      let tmp_td_type = document.createElement('td');
      tmp_td_type.textContent = _libraryArray[element].type;
      let tmp_td_name = document.createElement('td');
      tmp_td_name.textContent = _libraryArray[element].name;

      let tmp_td_plat = document.createElement('td');
      _libraryArray[element].platforms.forEach(platform => {
        tmp_td_plat.textContent += (platform + "\n");
      });
      
      let tmp_td_acto = document.createElement('td');
      _libraryArray[element].actors.forEach(actor => {
        tmp_td_acto.textContent += (actor + "\n");
      });

      let tmp_td_dire = document.createElement('td');
      tmp_td_dire.textContent = _libraryArray[element].director;
      let tmp_td_year = document.createElement('td');
      tmp_td_year.textContent = _libraryArray[element].year;

      let tmp_td_imag = document.createElement('td');
      let tmp_image = document.createElement('img');
      tmp_image.setAttribute("src", _libraryArray[element].posterURL);
      tmp_td_imag.append(tmp_image);

      let tmp_td_delete = document.createElement('td');
      let tmp_btn = document.createElement('button');
      tmp_btn.setAttribute("onclick", "deleteRow("+ element +")");
      let tmp_icon = document.createElement("i");
      tmp_icon.setAttribute("class", "fa fa-trash");
      tmp_btn.append(tmp_icon);
      tmp_td_delete.append(tmp_btn);

      tmp_row.append(tmp_td_type);
      tmp_row.append(tmp_td_name);
      tmp_row.append(tmp_td_plat);
      tmp_row.append(tmp_td_acto);
      tmp_row.append(tmp_td_dire);
      tmp_row.append(tmp_td_year);
      tmp_row.append(tmp_td_imag);
      tmp_row.append(tmp_td_delete);

      tmp_table.append(tmp_row);

      element++;
    }

    tmp_div.append(tmp_table);
    render_section.append(tmp_div);
  }

  showPages(1);
}

function showPages(_page){
  console.log("--> SHOW PAGES")

  let page_id = "table_" + _page;
  let tmp_div = document.getElementById(page_id);

  // HIDE ALL
  var divs = document.querySelectorAll(".div_page");
  divs.forEach(d => {
    d.setAttribute("hidden", "hidden");
  });

  // SHOW SLECTED
  tmp_div.removeAttribute("hidden");
}

function deleteRow(_row){

  let jsonArray = jsonLibrary["mediaLibrary"];
  jsonArray.splice(_row, 1);
  jsonLibrary["mediaLibrary"] = jsonArray;

  console.log("--> DELETE ROW: " + _row);

  renderTable(jsonLibrary, document.querySelector("#elementsXpage").value);
}

function updateTable(){
  console.log("--> UPDATE TABLE");
  renderTable(jsonLibrary, document.querySelector("#elementsXpage").value);
}

function handleFormSubmission() {
  console.log("--> SUBMIT FORM");

  const form = document.getElementById('mediaForm');

  // Check form validity
  if (form.checkValidity()) {
    // If the form is valid, call your custom function
    addMedia();
  } else {
    // If the form is not valid, you can choose to show an error message or take other actions
    console.log("Form is not valid. Please fill in all required fields.");
    
    alert("Use all the fields...");
  }

  form.reset();
}

function addMedia() {
  console.log("--> ADD MEDIA");

  // TO ADD:
  // CHECK FORMATS
  // CHECK DOUBLE FILMS

  const form = document.getElementById('mediaForm');
  const formData = new FormData(form);

  // Convert the selected options to an array
  const selectedOptions = Array.from(formData.getAll('platforms'));

  // Convert the comma-separated actors to an array
  const actorsArray = formData.get('actors').split(',').map(actor => actor.trim());

  const mediaObject = {
    type: "Movie", // Assuming default type is Movie, you can modify this based on your needs
    name: formData.get('name'),
    platforms: selectedOptions,
    actors: actorsArray,
    director: formData.get('director'),
    year: formData.get('year'),
    posterURL: formData.get('posterURL'),
    notes: "", // You can add a textarea in the form for additional notes
  };

  console.log(jsonLibrary);
  console.log(JSON.stringify(jsonLibrary));
  jsonLibrary["mediaLibrary"].push(mediaObject);

  renderTable(jsonLibrary, document.querySelector("#elementsXpage").value);
}

function search(){
  console.log("--> SEARCH")
  // Convert movieName to lowercase for case-insensitive search
  let name = document.querySelector("#search").value.toLowerCase();

  // Filter the array based on the movie name
  const searchResults = jsonLibrary["mediaLibrary"].filter(media => {
    return media.name.toLowerCase().includes(name);
  });

  let tmp = { "mediaLibrary" : searchResults };

  renderTable(tmp, document.querySelector("#elementsXpage").value);
}

function sort(sortType){
  var sortResult;

  switch (sortType) {
    case 'type':
      sortResult = jsonLibrary["mediaLibrary"].sort((a, b) => a.type.localeCompare(b.type));
      break;
    case 'name':      
      sortResult = jsonLibrary["mediaLibrary"].sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'director':      
      sortResult = jsonLibrary["mediaLibrary"].sort((a, b) => a.director.localeCompare(b.director));
      break;
    case 'year':
      sortResult = jsonLibrary["mediaLibrary"].sort((a, b) => a.year - b.year);
      break;
    default:
      console.log(`Sorry, sort ${sortType} not handled.`);
  }

  jsonLibrary["mediaLibrary"] = sortResult;

  renderTable(jsonLibrary, document.querySelector("#elementsXpage").value);
}