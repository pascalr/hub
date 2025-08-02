Hub.registerPlugin({
  init(app) {
    app.addMenu("🌤️ Météo", menu => {
      menu.addLink("🖥️ Tableau de bord", "", 0)
      menu.addHeader("Environment Canada", 0)
      menu.addLink("🌤️ Prévisions", "https://meteo.gc.ca/fr/location/index.html?coords=45.403,-71.901", 1)
      menu.addLink("🌤️ 24 heures", "https://meteo.gc.ca/fr/forecast/hourly/index.html?coords=45.403,-71.901", 1)
      menu.addLink("📡 Radar", "https://meteo.gc.ca/index_f.html?layers=radar&center=46.47341971,-68.61403321&zoom=6", 1)
      menu.addHeader("AccuWeather", 0)
      menu.addLink("📡 Radar", "https://www.accuweather.com/en/ca/sherbrooke/j1h/weather-radar/50017", 1)
    })
  },
});