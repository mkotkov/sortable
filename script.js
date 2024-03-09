document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("searchInput");
    const pageSizeSelect = document.getElementById("pageSizeSelect");
    const heroesTableBody = document.querySelector("#heroesTable tbody");
    let heroesData = [];
  
    // Fetch data
    fetch('https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json')
      .then(response => response.json())
      .then(data => {
        heroesData = data;
        displayData(heroesData);
      })
      .catch(error => console.error('Error fetching data:', error));
  
    // Display data
    function displayData(data) {
      heroesTableBody.innerHTML = '';
      data.forEach(hero => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><img src="${hero.images.xs}" alt="${hero.name}" style="width: 50px; height: 50px;"></td>
          <td>${hero.name}</td>
          <td>${hero.biography.fullName}</td>
          <td>${Object.values(hero.powerstats).join(', ')}</td>
          <td>${hero.appearance.race}</td>
          <td>${hero.appearance.gender}</td>
          <td>${hero.appearance.height.join(', ')}</td>
          <td>${hero.appearance.weight.join(', ')}</td>
          <td>${hero.biography.placeOfBirth}</td>
          <td>${hero.biography.alignment}</td>
        `;
        heroesTableBody.appendChild(row);
      });
    }
  
    // Search functionality
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.trim().toLowerCase();
      const filteredData = heroesData.filter(hero => hero.name.toLowerCase().includes(searchTerm));
      displayData(filteredData);
    });
  
    // Pagination
    pageSizeSelect.addEventListener('change', function() {
      const pageSize = parseInt(this.value);
      if (pageSize === 'all') {
        displayData(heroesData);
      } else {
        const currentPageData = heroesData.slice(0, pageSize);
        displayData(currentPageData);
      }
    });
  });
  