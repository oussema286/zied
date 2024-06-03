document.addEventListener("DOMContentLoaded", function() {
    fetch('https://www.freetogame.com/api/games')
        .then(response => response.json())
        .then(data => {
            const genrePlatformData = {};

            data.forEach(game => {
                if (!genrePlatformData[game.genre]) {
                    genrePlatformData[game.genre] = {};
                }
                if (genrePlatformData[game.genre][game.platform]) {
                    genrePlatformData[game.genre][game.platform]++;
                } else {
                    genrePlatformData[game.genre][game.platform] = 1;
                }
            });

            const genrePlatformArray = Object.keys(genrePlatformData).map(genre => {
                const platforms = genrePlatformData[genre];
                return { genre, ...platforms };
            });

            createStackedBarChart(genrePlatformArray);
        })
        .catch(error => console.error('Error fetching data:', error));
});

function createStackedBarChart(data) {
    const margin = { top: 20, right: 30, bottom: 40, left: 40 },
          width = 900 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

    const svg = d3.select("#chart-stacked-bar")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const subgroups = Object.keys(data[0]).slice(1);
    const groups = data.map(d => d.genre);

    const x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d3.sum(subgroups.map(key => d[key])))])
        .nice()
        .range([height, 0]);

    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(d3.schemeCategory10);

    svg.append("g")
        .selectAll("g")
        .data(d3.stack().keys(subgroups)(data))
        .enter().append("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .enter().append("rect")
        .attr("x", d => x(d.data.genre))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth());

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");
}
