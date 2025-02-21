mapboxgl.accessToken = 'pk.eyJ1Ijoibm9ycnJpc3MiLCJhIjoiY203ZjAxYzR0MGs0ZjJycHFqcGN4bmllaCJ9.HoBz0Fn22Gi5wH-vWRyoWA';

const svg = d3.select('#map').select('svg');
let stations = [];


function getCoords(station) {
    const point = new mapboxgl.LngLat(+station.lon, +station.lat);
    const { x, y } = map.project(point);
    return { cx: x, cy: y };
  }

const bikeLayerStyle = {
  'line-color': '#32D400',
  'line-width': 5,
  'line-opacity': 0.6
};

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [-71.09415, 42.36027],
  zoom: 12,
  minZoom: 5,
  maxZoom: 18
});

map.on('load', () => {
    map.addSource('boston_route', {
      type: 'geojson',
      data: './data/boston-bikes.geojson'
    });
  
    map.addSource('cambridge_route', {
      type: 'geojson',
      data: './data/cambridge-bikes.geojson'
    });
  
    map.addLayer({
      id: 'boston-bike-lanes',
      type: 'line',
      source: 'boston_route',
      paint: bikeLayerStyle
    });
  
    map.addLayer({
      id: 'cambridge-bike-lanes',
      type: 'line',
      source: 'cambridge_route',
      paint: bikeLayerStyle
    });
  
    // Load both stations and traffic data
    Promise.all([
      d3.json('https://dsc106.com/labs/lab07/data/bluebikes-stations.json'),
      d3.csv('https://dsc106.com/labs/lab07/data/bluebikes-traffic-2024-03.csv')
    ]).then(([stationData, tripData]) => {
      stations = stationData.data.stations;
      const trips = tripData;
  
      console.log('First trip:', trips[0]);
      console.log('Number of trips:', trips.length);
  
      const circles = svg.selectAll('circle')
        .data(stations)
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('fill', 'steelblue')
        .attr('stroke', 'white')
        .attr('stroke-width', 1)
        .attr('opacity', 0.8);
  
      function updatePositions() {
        circles
          .attr('cx', d => getCoords(d).cx)
          .attr('cy', d => getCoords(d).cy);
      }
  
      updatePositions();
      map.on('move', updatePositions);
      map.on('zoom', updatePositions);
      map.on('resize', updatePositions);
      map.on('moveend', updatePositions);
  
    }).catch(error => {
      console.error('Error loading data:', error);
    });
  });