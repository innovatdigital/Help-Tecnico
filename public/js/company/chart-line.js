google.load("visualization", "1", { packages: ["corechart"] });
google.setOnLoadCallback(drawChart);

function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Semana', 'Manhã', 'Tarde', 'Noite'],
        ['Segunda', 1000, 400, 200],
        ['Terça', 1170, 460, 160],
        ['Quarta', 660, 1120, 223],
        ['Quinta', 1030, 540, 143],
        ['Sexta', 1030, 767, 143],
        ['Sábado', 1030, 435, 213],
    ]);

    var options = {
        title: 'Seus chamados por semana:',
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

$(window).resize(function () {
    drawChart()
});