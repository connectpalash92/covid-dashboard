document.addEventListener('DOMContentLoaded', () => {
    const apiURL = 'https://disease.sh/v3/covid-19/all';
    const countryURL = 'https://disease.sh/v3/covid-19/countries';
    const covidChart = document.getElementById('covidChart').getContext('2d');
    let covidDataChart;

    fetchGlobalData();
    fetchCountryList();

    document.getElementById('country').addEventListener('change', (event) => {
        const country = event.target.value;
        if (country === 'global') {
            fetchGlobalData();
        } else {
            fetchCountryData(country);
        }
    });

    function fetchGlobalData() {
        fetch(apiURL)
            .then(response => response.json())
            .then(data => updateChart(data, 'Global'));
    }

    function fetchCountryList() {
        fetch(countryURL)
            .then(response => response.json())
            .then(data => populateCountrySelect(data));
    }

    function fetchCountryData(country) {
        fetch(`${countryURL}/${country}`)
            .then(response => response.json())
            .then(data => updateChart(data, data.country));
    }

    function populateCountrySelect(countries) {
        const countrySelect = document.getElementById('country');
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.countryInfo.iso2;
            option.textContent = country.country;
            countrySelect.appendChild(option);
        });
    }

    function updateChart(data, label) {
        const chartData = {
            labels: ['Cases', 'Deaths', 'Recovered'],
            datasets: [{
                label: `COVID-19 Statistics (${label})`,
                data: [data.cases, data.deaths, data.recovered],
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 1
            }]
        };

        if (covidDataChart) {
            covidDataChart.destroy();
        }

        covidDataChart = new Chart(covidChart, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});
