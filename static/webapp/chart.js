var Chart = (function () {
    this.chartObj = null;
    this.el = null;
    const self = this;
    return {
        create: async function () {
            let chartContainerEl = document.getElementById('chart');
            self.chartObj = new google.visualization.CandlestickChart(chartContainerEl);
            // self.chartObj = new google.visualization.ChartWrapper({
            //     containerId: "chart",
            //     // "dataSourceUrl": this.,
            //     dataTable: data,
            //     refreshInterval: 5,
            //     chartType: "CandlestickChart",
            //     options: {
            //         alternatingRowStyle: true,
            //         showRowNumber: true
            //     }
            // });
            google.visualization.events.addListener(self.chartObj, 'error', function (e) {
                console.log(e);
                google.visualization.errors.removeError(e.id)
            });

            // let data = await Chart.data();
            // self.chartObj.draw(data,);
            await Chart.drawChart();
            setInterval(Chart.drawChart, 5000);
        },
        drawChart: async function () {
            let data = await Chart.data();
            console.log(data);
            const chartEl = document.getElementById("chart");
            if (data.data && data.data.length === 0) {
                if(chartEl) {
                    chartEl.parentElement.removeChild(chartEl);
                    self.el = chartEl;
                }
                return;
            }

            if (!chartEl) {
                const parentNode = document.getElementById("chart_div");
                parentNode.appendChild(self.el);
                self.el = null;
            }
            const time = data.time;
            let options = {
                'title': 'Fetched Data - ' + time
            };
            let dataTable = google.visualization.arrayToDataTable(data.data, true);

            self.chartObj.draw(dataTable, options);
        },
        getChartDataURL: function () {
            const stockList = document.getElementById("stockList");
            const els = stockList.getElementsByTagName("li");
            const arr = [];
            for (let i = 0; i < els.length; i++) {
                const el = els[i];
                const symbol = el.dataset.symbol;
                arr.push(symbol);
            }
            const params = new URLSearchParams({
                "arr": JSON.stringify(arr)
            });
            let url = ServerAPI.getSymbolDataURL(params);
            return url;
        }, data: async function () {
            let url = this.getChartDataURL();
            const result = await fetch(url)
                .then(response => response.json());
            return result;
        },
        getChartObj: function () {
            return self.chartObj;
        }
    }
})();

// google.charts.load('current');   // Don't need to specify chart libraries!
google.charts.load('current', {'packages':['corechart']});

google.charts.setOnLoadCallback(Chart.create);
