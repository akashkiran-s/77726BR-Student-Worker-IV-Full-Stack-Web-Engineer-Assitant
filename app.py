import json
import os
from flask import Flask
from flask import request
from flask import send_from_directory
from datetime import datetime
# from multiprocessing import Pool
import finnhub

app = Flask(__name__)
finnhub_client = finnhub.Client(api_key="c9me93iad3i9qg80t8lg")

# https://stackoverflow.com/questions/31171941/should-i-create-a-new-pool-object-every-time-or-reuse-a-single-one
# pool = Pool()


@app.route('/')
def hello_world():  # put application's code here
    directory = os.getcwd() + "/static/webapp/"
    return send_from_directory(directory, "index.html")
    # return 'Hello World!'


@app.route('/suggest')
def suggest():
    q = request.args.get('q')
    lookup = finnhub_client.symbol_lookup(q)
    print(lookup)
    print(type(lookup))
    result = lookup["result"]
    companies = [x["displaySymbol"] for x in result]
    json_object = json.dumps(companies)
    return json_object


@app.route('/chartdata')
def chart():
    arr = request.args.get('arr')
    arr = json.loads(arr)
    # responses = pool.map(lambda x: finnhub_client.quote(x), arr)
    results = []
    t = 0
    for i, symbol in enumerate(arr):
        response = finnhub_client.quote(symbol)
        # {
        #     "c": 157.65,
        #     "d": -5.99,
        #     "dp": -3.6605,
        #     "h": 166.2,
        #     "l": 157.25,
        #     "o": 161.84,
        #     "pc": 163.64,
        #     "t": 1651262404
        # }

        result = [
            symbol,
            response["l"],
            response["o"],
            response["c"],
            response["h"],
        ]

        t = max(t, response["t"])

        results.append(result)
    wrapper = {
        "data": results,
        "time": str(datetime.utcfromtimestamp(t))
    }

    s = json.dumps(wrapper)
    return s




if __name__ == '__main__':
    app.run()
