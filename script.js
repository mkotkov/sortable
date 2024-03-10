const searchInput = document.getElementById("searchInput"); //get the search bar
const pageSizeSelect = document.getElementById("pageSizeSelect"); //get the selector
const heroesTableBody = document.querySelector("#heroesTable tbody"); //get the table body
const heroesTableHeader = document.querySelectorAll('#heroesTable th')//get the table header
let heroesData = []; //empty data variable

// Define a state object to keep track of sorting order for each column
const sortState = {};

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

heroesTableHeader.forEach((header, index) => {
    header.addEventListener('click', () => {
        sortData(index); // Call sortData function when header is clicked
    });
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

function sortData(columnIndex) {
  // Create a copy of the data array to avoid modifying the original data
  const sortedData = [...heroesData];
  
  // Define sorting function based on the column index
  let sortingFunction;

    // Check if the current column has been sorted before
  if (sortState[columnIndex] === 'asc') {
      // If previously sorted in ascending order, sort in descending order
      sortingFunction = (a, b) => compareValues(b, a); // Reverse sorting order
      sortState[columnIndex] = 'desc'; // Update sorting state to descending
  } else {
      // If not sorted before or sorted in descending order, sort in ascending order
      sortState[columnIndex] = 'asc'; // Update sorting state to ascending
  }


  switch (columnIndex) {
      case 1: // Sort by hero name
          sortingFunction = (a, b) => compareStrings(a.name, b.name);
          break;
      case 2: // Sort by hero full name
          sortingFunction = (a, b) => compareStrings(a.biography.fullName, b.biography.fullName);
          break;
      case 4: // Sort by race
          sortingFunction = (a, b) => compareStrings(a.appearance.race, b.appearance.race);
          break;
      case 5: // Sort by gender
          sortingFunction = (a, b) => compareStrings(a.appearance.gender, b.appearance.gender);
          break;
      default:
          return; // If invalid column index, just exit the function
  }
  

  
  // Sort the data using the defined sorting function
  sortedData.sort(sortingFunction);
  
  // Display the sorted data
  displayData(sortedData);
}

// Function to compare two strings, handling null values by placing them at the bottom
function compareStrings(a, b) {
  // Handle null values
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  // Compare strings
  return a.localeCompare(b);
}

// Function to compare two values, handling null values by placing them at the bottom
function compareValues(a, b) {
  // Handle null values
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  // Compare values
  return a - b;
}