mapboxgl.accessToken = 'pk.eyJ1Ijoibm9ycnJpc3MiLCJhIjoiY203ZjAxYzR0MGs0ZjJycHFqcGN4bmllaCJ9.HoBz0Fn22Gi5wH-vWRyoWA';

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
});