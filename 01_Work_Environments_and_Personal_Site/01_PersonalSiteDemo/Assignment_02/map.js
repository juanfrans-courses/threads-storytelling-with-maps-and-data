mapboxgl.accessToken =
  "pk.eyJ1IjoianVhbmZyYW5zIiwiYSI6Imdhb2V1S1UifQ._00SXA6yc6U6CJG-JI4fiA";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/juanfrans/cm6jjlhqn00wx01qm0ez1hond",
  zoom: 10,
  center: [-74, 40.725],
  maxZoom: 15,
  minZoom: 8,
  maxBounds: [
    [-74.45, 40.45],
    [-73.55, 41],
  ],
});

map.on("load", function () {
  // This is the function that finds the first symbol layer
  let layers = map.getStyle().layers;
  let firstSymbolId;
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].type === "symbol") {
      firstSymbolId = layers[i].id;
      break;
    }
  }

  map.addLayer(
    {
      id: "turnstileData",
      type: "circle",
      source: {
        type: "geojson",
        data: "data/turnstileData.geojson",
      },
      paint: {
        "circle-color": [
          "interpolate",
          ["linear"],
          ["get", "ENTRIES_DIFF"],
          -1,
          "#ff4400",
          -0.7,
          "#ffba31",
          -0.4,
          "#ffffff",
        ],
        "circle-stroke-color": "#4d4d4d",
        "circle-stroke-width": 0.5,
        "circle-radius": [
          "interpolate",
          ["exponential", 2],
          ["zoom"],
          10,
          ["interpolate", ["linear"], ["get", "ENTRIES_DIFF"], -1, 10, -0.4, 1],
          15,
          [
            "interpolate",
            ["linear"],
            ["get", "ENTRIES_DIFF"],
            -1,
            25,
            -0.4,
            12,
          ],
        ],
      },
    },
    firstSymbolId
  );
  map.addLayer(
    {
      id: "medianIncome",
      type: "fill",
      source: {
        type: "geojson",
        data: "data/medianIncome.geojson",
      },
      paint: {
        "fill-color": [
          "step",
          ["get", "MHHI"],
          "#ffffff",
          20000,
          "#ccedf5",
          50000,
          "#99daea",
          75000,
          "#66c7e0",
          100000,
          "#33b5d5",
          150000,
          "#00a2ca",
        ],
        "fill-opacity": ["case", ["==", ["get", "MHHI"], null], 0, 0.65],
      },
    },
    "water"
  );
});

// Create the popup
map.on("click", "turnstileData", function (e) {
  let entriesDiff = e.features[0].properties.ENTRIES_DIFF;
  let entries_06 = e.features[0].properties.ENTRIES_06;
  let entries_20 = e.features[0].properties.ENTRIES_20;
  let stationName = e.features[0].properties.stationName;
  new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(
      "<h4>" +
        stationName +
        "</h4>" +
        "<p><b>Friday, March 6th:</b> " +
        entries_06 +
        " entries<br>" +
        "<b>Friday, March 20th:</b> " +
        entries_20 +
        " entries<br>" +
        "<b>Change:</b> " +
        Math.round(entriesDiff * 1000) / 10 +
        "%</p>"
    )
    .addTo(map);
});
// Change the cursor to a pointer when the mouse is over the turnstileData layer.
map.on("mouseenter", "turnstileData", function () {
  map.getCanvas().style.cursor = "pointer";
});
// Change it back to a pointer when it leaves.
map.on("mouseleave", "turnstileData", function () {
  map.getCanvas().style.cursor = "";
});
