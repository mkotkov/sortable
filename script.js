const searchInput = document.getElementById("searchInput"); //get the search bar
const pageSizeSelect = document.getElementById("pageSizeSelect"); //get the selector
const heroesTableBody = document.querySelector("#heroesTable tbody"); //get the table body
let heroesData = []; //empty data variable

//execute a function when the page loads
document.addEventListener("DOMContentLoaded", function() {
 
//Fetch data. Performing an asynchronous HTTP GET request.
fetch('https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json')

//Returns a Promise object
.then(response => response.json())

//When the data is successfully parsed from the JSON format, it will be assigned to a variable
.then(data => {
  heroesData = data;
  displayData(heroesData);
})

//If an error occurs while executing the request
.catch(error => console.error('Error fetching data:', error));

// Search. This is a method that adds an event listener to an element to listen for a text input event. 
// When the user enters text into the field, this handler will be called.
searchInput.addEventListener('input', function() { 

  //removes spaces from the beginning and end of a string and converts to lowercase
  const searchTerm = this.value.trim().toLowerCase();

  const filteredData = heroesData.filter(hero => hero.name.toLowerCase().includes(searchTerm));
  displayData(filteredData);
});

// Pagination
  pageSizeSelect.addEventListener('change', function() {
    const value = this.value
    const pageSize = parseInt(value);
    
    if (value === 'all') {
      displayData(heroesData);
    } else {
      const currentPageData = heroesData.slice(0, pageSize);
      displayData(currentPageData);
    }
  });

});


// Display data. Function takes an array of data and displays it as a table on a web page
function displayData(data) {
  heroesTableBody.innerHTML = ''; //Element clears the contents of the table body (<tbody>) before adding new data

  //iterates over each element of the array
  data.forEach(hero => {
    
  //create a table row element
  const row = document.createElement('tr');

    //take both the key and the value
  const powerstatsHtml = Object.entries(hero.powerstats)
    .map(([key, value]) => `<b>${key}:</b> ${value}`)
    .join('<br>');

    //adding HTML-code for columns to a row
  row.innerHTML = `
    <td><img src="${hero.images.md}" alt="${hero.name}" style="width: 150px; height: 150px;"></td>
    <td style="width: 100px;">${hero.name}</td>
    <td>${hero.biography.fullName}</td>
    <td>${powerstatsHtml}</td>
    <td>${hero.appearance.race}</td>
    <td>${hero.appearance.gender}</td>
    <td>${hero.appearance.height.join('</br>')}</td>
    <td>${hero.appearance.weight.join('</br>')}</td>
    <td style="width: 80px;">${hero.biography.placeOfBirth}</td>
    <td>${hero.biography.alignment}</td>
    `;
    heroesTableBody.appendChild(row);//adds an element to the end of child elements
  });
}

