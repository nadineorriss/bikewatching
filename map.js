mapboxgl.accessToken = 'pk.eyJ1Ijoibm9ycnJpc3MiLCJhIjoiY203ZjAxYzR0MGs0ZjJycHFqcGN4bmllaCJ9.HoBz0Fn22Gi5wH-vWRyoWA';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [-71.09415, 42.36027],  // Boston coordinates
  zoom: 12,
  minZoom: 5,
  maxZoom: 18
});

// Wait for the map to load
map.on('load', () => {
  // Add the bike routes data source
  map.addSource('boston_route', {
    type: 'geojson',
    data: 'https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::existing-bike-network-2022.geojson'
  });

  // Add the layer to visualize the bike routes
  map.addLayer({
    id: 'bike-lanes',
    type: 'line',
    source: 'boston_route',
    paint: {
        'line-color': '#32D400',  // A bright green using hex code
        'line-width': 5,          // Thicker lines
        'line-opacity': 0.6       // Slightly less transparent
      }
  });
});