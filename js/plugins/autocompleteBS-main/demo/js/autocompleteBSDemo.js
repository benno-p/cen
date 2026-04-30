const autoCompleteConfig = [{
    name: 'Countries by Capital',
    debounceMS: 250,
    minLength: 1,
    maxResults: 3,
    inputSource: document.getElementById('inputText1'),
    targetID: document.getElementById('inputID1'),
    fetchURL: 'https://restcountries.eu/rest/v2/capital/{term}',
    fetchMap: {id: "id",
               name: "name",
               },
    ajax: false,
    ajaxurl : '../../../../php/ajax/autocompleteBS.ajax.js.php',
    bold: true
  },
  {
    name: 'Countries by Name',
    debounceMS: 300,
    minLength: 3,
    maxResults: 10,
    inputSource: document.getElementById('inputText2'),
    targetID: document.getElementById('inputID2'),
    fetchURL: 'https://restcountries.eu/rest/v2/name/{term}',
    fetchMap: {id: "alpha2Code",
               name: "name"},
    bold: true
  }
];

//console.log(autoCompleteConfig);

// Initiate Autocomplete to Create Listeners
autocompleteBS(autoCompleteConfig);

function resultHandlerBS(inputName, selectedData) {
  //console.log(inputName);
  //console.log(selectedData);
}
