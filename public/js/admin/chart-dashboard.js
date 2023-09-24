var data = [
    { y: '2014', a: 50 },
    { y: '2015', a: 65 },
    { y: '2016', a: 50 },
    { y: '2017', a: 75 },
    { y: '2018', a: 80 },
    { y: '2019', a: 90 },
    { y: '2020', a: 100 },
    { y: '2021', a: 115 },
    { y: '2022', a: 120 },
    { y: '2023', a: 145 },
    { y: '2024', a: 160 }
]

config = {
    data: data,
    xkey: 'y',
    ykeys: 'a',
    labels: ['Total de chamados'],
    fillOpacity: 0.6,
    hideHover: 'auto',
    behaveLikeLine: true,
    resize: true,
    pointFillColors: ['#ffffff'],
    pointStrokeColors: ['black'],
    lineColors: ['blue']
}

config.element = 'line-chart';
Morris.Line(config);

Morris.Donut({
  element: 'pie-chart',
  data: [
    {label: "Manhã", value: 30},
    {label: "Tarde", value: 15},
    {label: "Noite", value: 45},
  ]
});