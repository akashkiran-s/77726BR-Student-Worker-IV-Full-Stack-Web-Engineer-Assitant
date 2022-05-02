var ServerAPI = (function () {
    return {
        serverURL: "",
        suggestURL: function (name) {
            return ServerAPI.serverURL + "/suggest?q=" + name;
        },
        getSymbolDataURL: function (urlSearchParams) {
            return ServerAPI.serverURL + "/chartdata?" + urlSearchParams;
        }
    }
})();

var SearchController = (function () {
    return {
        suggest: async function (stockName) {
            let url = ServerAPI.suggestURL(stockName);
            return fetch(url)
                .then(response => response.json())
                .then(obj => {
                    console.log(obj);
                    return obj;
                })
        },
        init: function () {
            let stockNameEl = document.querySelector("#stockName");
            autocomplete(stockNameEl, async () => {
                let stockName = stockNameEl.value;
                return await SearchController.suggest(stockName)
            });
        }
    }
})();

SearchController.init();