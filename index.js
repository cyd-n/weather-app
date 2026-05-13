function Weather(){
        return{ //Dynamic background — sunny/rainy/cloudy based on condition
            charts: [],  // FIX: track all chart instances
            alone:true,
            forecast:[],
            days:2,
            c:"", 
            dewC:"",
            feelC:"",
            heatC:"",
            reg:"",
            city:"",
            country:"",
            time:"",
            cloud:"",
            windchill:"",
            windKmU:"",
            windDir:"",
            windDegree:"",
            druk:"",
            precipMm:"",
            pressureMb:"",
            humidity:"",
            gustKph:"",
            conTxt:"",
            conIcon:"", // Need to give it a gif
            airCo:"",
            airGb:"",
            airNo:"",
            airO:"",
            airPmTen:"",
            airSo:"",
            uv:"",
            visKm:"",
            bgColor: "min-h-screen bg-gradient-to-br from-sky-600 to-blue-900 flex items-center justify-center p-6",

            GetBackground(condition) {
                const c = (condition || "").toLowerCase();
                if (c.includes("thunder") || c.includes("lightning") || c.includes("storm"))
                    return "min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-slate-800 flex items-center justify-center p-6";
                if (c.includes("blizzard"))
                    return "min-h-screen bg-gradient-to-br from-slate-300 via-blue-100 to-white flex items-center justify-center p-6";
                if (c.includes("snow") || c.includes("sleet") || c.includes("ice") || c.includes("freezing") || c.includes("blowing snow"))
                    return "min-h-screen bg-gradient-to-br from-blue-100 via-slate-200 to-indigo-200 flex items-center justify-center p-6";
                if (c.includes("heavy rain") || c.includes("torrential"))
                    return "min-h-screen bg-gradient-to-br from-slate-700 via-blue-900 to-gray-900 flex items-center justify-center p-6";
                if (c.includes("drizzle") || c.includes("light rain") || c.includes("patchy rain"))
                    return "min-h-screen bg-gradient-to-br from-slate-500 via-blue-700 to-slate-600 flex items-center justify-center p-6";
                if (c.includes("rain"))
                    return "min-h-screen bg-gradient-to-br from-slate-600 via-blue-800 to-slate-700 flex items-center justify-center p-6";
                if (c.includes("fog") || c.includes("mist") || c.includes("haze") || c.includes("freezing fog"))
                    return "min-h-screen bg-gradient-to-br from-gray-400 via-gray-300 to-slate-400 flex items-center justify-center p-6";
                if (c.includes("overcast"))
                    return "min-h-screen bg-gradient-to-br from-gray-600 via-gray-500 to-slate-600 flex items-center justify-center p-6";
                if (c.includes("cloudy") || c.includes("cloud"))
                    return "min-h-screen bg-gradient-to-br from-slate-400 via-blue-400 to-gray-500 flex items-center justify-center p-6";
                if (c.includes("partly"))
                    return "min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-slate-400 flex items-center justify-center p-6";
                if (c.includes("sunny") || c.includes("clear"))
                    return "min-h-screen bg-gradient-to-br from-amber-400 via-sky-400 to-blue-500 flex items-center justify-center p-6";
                if (c.includes("wind") || c.includes("breezy") || c.includes("gale"))
                    return "min-h-screen bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-700 flex items-center justify-center p-6";
                if (c.includes("sand") || c.includes("dust"))
                    return "min-h-screen bg-gradient-to-br from-yellow-700 via-amber-600 to-orange-800 flex items-center justify-center p-6";
                if (c.includes("hail"))
                    return "min-h-screen bg-gradient-to-br from-slate-700 via-indigo-800 to-gray-900 flex items-center justify-center p-6";
                if (c.includes("smoke") || c.includes("ash") || c.includes("volcanic"))
                    return "min-h-screen bg-gradient-to-br from-gray-800 via-stone-700 to-gray-900 flex items-center justify-center p-6";
                return "min-h-screen bg-gradient-to-br from-sky-600 to-blue-900 flex items-center justify-center p-6";
            },

            // FIX: destroy all tracked chart instances and clear the array
            DestroyCharts(){
                this.charts.forEach(c => c.destroy());
                this.charts = [];
            },
            
            GetWeather(){
                // FIX: destroy old charts before fetching new data
                this.DestroyCharts();

                fetch("https://api.weatherapi.com/v1/forecast.json?key=ea2e7c3147e248bf91e145718252102&q=&q=" + this.city + "&days=3&aqi=yes")
                    .then(response => response.json())
                    .then(data => {
                        this.dewC = data.current.dewpoint_c;
                        this.feelC = data.current.feelslike_c;
                        this.gustKph = data.current.gust_kph;
                        this.heatC = data.current.heatindex_c;
                        this.humidity = data.current.humidity;
                        this.precipMm = data.current.precip_mm;
                        this.pressureMb = data.current.pressure_mb;
                        this.c = data.current.temp_c;
                        this.humidity = data.current.humidity;
                        this.uv = data.current.uv;
                        this.visKm = data.current.vis_km;
                        this.windDegree = data.current.wind_degree;
                        this.windDir = data.current.wind_dir;
                        this.windKmU = data.current.wind_kph;
                        this.windchill = data.current.windchill_c;
                        this.airCo = data.current.air_quality.co;
                        this.airNo = data.current.air_quality.no2;
                        this.airO = data.current.air_quality.o3;
                        this.airPmTen = data.current.air_quality.pm10;
                        this.airSo = data.current.air_quality.so2;
                        this.cloud = data.current.cloud;
                        this.conTxt = data.current.condition.text;
                        this.conIcon = data.current.condition.icon;
                        this.reg = data.location.region;
                        this.country = data.location.country;
                        this.time = data.location.localtime;
                        this.forecast = data.forecast.forecastday;
                        this.bgColor = this.GetBackground(this.conTxt);

                        this.$nextTick(() => {
                            this.forecast.forEach((day, i) => {

                                // hourly temperatures for the graph
                                const hours = day.hour.map(h => h.time.split(" ")[1]);
                                const temps = day.hour.map(h => h.temp_c);
                                const dewpoints = day.hour.map(h => h.dewpoint_c);
                                const feels = day.hour.map(h => h.feelslike_c);
                                const precip = day.hour.map(h => h.precip_mm);
                                const snow = day.hour.map(h => h.snow_cm / 10);

                                // FIX: store each new chart instance in this.charts
                                this.charts.push(new Chart(document.getElementById("chart_" + i), {
                                    type: "line",
                                    data: {
                                        labels: hours,
                                        datasets: [{
                                            label: "Temperature (°C)",
                                            data: temps,
                                            borderColor: "rgba(255,255,255,0.8)",
                                            backgroundColor: "rgba(255,255,255,0.2)",
                                            fill: true,
                                            lineTension: 0.2
                                        },{
                                            label: "Dewpoints (°C)",
                                            data: dewpoints,
                                            borderColor: "rgba(0,85,160,0.8)",
                                            backgroundColor: "rgba(0,85,160,0.2)",
                                            fill: true,
                                            lineTension: 0.2
                                        },{
                                            label: "Feels Like (°C)",
                                            data: feels,
                                            borderColor: "rgba(255,120,0,0.8)",
                                            backgroundColor: "rgba(255,120,0,0.2)",
                                            fill: true,
                                            lineTension: 0.2
                                        }]
                                    },
                                    options: {
                                        legend: { display: true },
                                        title: {
                                            display: true,
                                            text: "Temperature",
                                            color: "black", 
                                            fontSize: 16
                                        },
                                        scales: {
                                            yAxes: [{ ticks: { fontColor: "white" } }],
                                            xAxes: [{ ticks: { fontColor: "white" } }]
                                        }
                                    }
                                }));

                                // FIX: store each new chart instance in this.charts
                                this.charts.push(new Chart(document.getElementById("chartR_" + i), {
                                    type: "line",
                                    data: {
                                        labels: hours,
                                        datasets: [{
                                            label: "Rain mm",
                                            data: precip,
                                            borderColor: "rgba(0,85,160,0.8)",
                                            backgroundColor: "rgba(0,85,160,0.2)",
                                            fill: true,
                                            lineTension: 0.2
                                        },{
                                            label: "Snow mm",
                                            data: snow,
                                            borderColor: "rgba(255,255,255,0.8)",
                                            backgroundColor: "rgba(255,255,255,0.2)",
                                            fill: true,
                                            lineTension: 0.2
                                        }]
                                    },
                                    options: {
                                        legend: { display: true },
                                        title: {
                                            display: true,
                                            text: "Rain and Snow",
                                            color: "black", 
                                            fontSize: 16
                                        },
                                        scales: {
                                            yAxes: [{ ticks: { fontColor: "white" } }],
                                            xAxes: [{ ticks: { fontColor: "white" } }]
                                        }
                                    }
                                }));
 
                            });

                        console.log(this.forecast);
                    });
                })
            }
        }
    }