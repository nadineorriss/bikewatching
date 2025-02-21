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
  
    Promise.all([
        d3.json('https://dsc106.com/labs/lab07/data/bluebikes-stations.json'),
        d3.csv('https://dsc106.com/labs/lab07/data/bluebikes-traffic-2024-03.csv')
      ]).then(([stationData, tripData]) => {
        stations = stationData.data.stations;
        const trips = tripData;
    
        // Calculate departures and arrivals
        const departures = d3.rollup(
          trips,
          v => v.length,
          d => d.start_station_id
        );
    
        const arrivals = d3.rollup(
          trips,
          v => v.length,
          d => d.end_station_id
        );
    
        // Add traffic properties to stations
        stations = stations.map((station) => {
          let id = station.short_name;
          station.arrivals = arrivals.get(id) ?? 0;
          station.departures = departures.get(id) ?? 0;
          station.totalTraffic = station.arrivals + station.departures;
          return station;
        });
    
        // Create square root scale for circle sizes
        const radiusScale = d3
          .scaleSqrt()
          .domain([0, d3.max(stations, d => d.totalTraffic)])
          .range([0, 25]);
    
        // Update circles with scaled sizes
        const circles = svg.selectAll('circle')
          .data(stations)
          .enter()
          .append('circle')
          .attr('r', d => radiusScale(d.totalTraffic))
          .attr('fill', 'steelblue')
          .attr('fill-opacity', 0.6)
          .attr('stroke', 'white')
          .attr('stroke-width', 1);
    
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