var data = [
  { y: '01', a: 50, b: 90},
  { y: '02', a: 65,  b: 75},
  { y: '03', a: 50,  b: 50},
  { y: '04', a: 75,  b: 60},
  { y: '05', a: 80,  b: 65},
  { y: '06', a: 90,  b: 70},
  { y: '07', a: 100, b: 75},
  { y: '08', a: 115, b: 75},
  { y: '09', a: 120, b: 85},
  { y: '10', a: 145, b: 85},
  { y: '11', a: 160, b: 95},
  { y: '12', a: 180, b: 100}
]

config = {
  data: data,
  xkey: 'y',
  ykeys: ['a', 'b'],
  labels: ['Ganhos', 'Gastos'],
  fillOpacity: 0.6,
  hideHover: 'auto',
  behaveLikeLine: true,
  resize: true,
  pointFillColors:['#ffffff'],
  pointStrokeColors: ['black'],
  lineColors:['green','red']
}

config.element = 'area-chart';
Morris.Area(config);