document.addEventListener("DOMContentLoaded", function() {
    fetch('https://www.freetogame.com/api/games')
        .then(response => response.json())
        .then(data => {
            const releaseDateData = {};

            data.forEach(game => {
                const releaseYear = new Date(game.release_date).getFullYear();
                if (releaseDateData[releaseYear]) {
                    releaseDateData[releaseYear]++;
                } else {
                    releaseDateData[releaseYear] = 1;
                }
            });

            const releaseDateArray = Object.keys(releaseDateData).map(year => ({
                year: new Date(year, 0, 1),
                count: releaseDateData[year]
            }));

            createLineChart(releaseDateArray);
        })
        .catch(error => console.error('Erreur lors de la récupération des données :', error));
});

function createLineChart(data) {
    const margin = { top: 20, right: 30, bottom: 40, left: 40 },
          width = 800 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#chart-line")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.year))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .nice()
        .range([height, 0]);

    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.count));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
}
