document.addEventListener("DOMContentLoaded", function() {
    fetch('https://www.freetogame.com/api/games')
        .then(response => response.json())
        .then(data => {
            const genreData = {};

            data.forEach(game => {
                if (genreData[game.genre]) {
                    genreData[game.genre]++;
                } else {
                    genreData[game.genre] = 1;
                }
            });

            const genreArray = Object.keys(genreData).map(genre => ({
                genre: genre,
                count: genreData[genre]
            }));

            createDonutChart(genreArray);
        })
        .catch(error => console.error('Erreur lors de la récupération des données :', error));
});

function createDonutChart(data) {
    const width = 800,
          height = 400,
          radius = Math.min(width, height) / 2;

    const svg = d3.select("#chart-donut")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.genre))
        .range(d3.schemeCategory10);

    const pie = d3.pie()
        .value(d => d.count);

    const arc = d3.arc()
        .innerRadius(radius * 0.5)
        .outerRadius(radius);

    const arcs = svg.selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.genre));

    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .text(d => d.data.genre)
        .style("fill", "#fff")
        .style("font-size", "12px");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-1.5em")
        .text("Games by Genre")
        .style("font-size", "20px")
        .style("font-weight", "bold");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.5em")
        .text(data.reduce((acc, d) => acc + d.count, 0) + " Games")
        .style("font-size", "14px");
}
