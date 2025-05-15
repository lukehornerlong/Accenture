from flask import Flask, jsonify, request, render_template
from Scraping import getflightdata  
app = Flask(__name__)
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/getbestflights', methods=['GET'])
def getbestflights():
    # Get the home airport from the query parameters
    hairport = request.args.get('hairport')
    loption = request.args.get('loption')
    # Check if the hAirport parameter is provided
    if not hairport:
        return jsonify({"error": "Please provide a hairport parameter"}), 400

    if not loption:
        return jsonify({"error": "Please provide a loption parameter"}), 400
    # Call scraping function with the provided home_airport
    data = getflightdata(hairport,loption)
    return render_template('displaydata.html', data=data)

if __name__ == '__main__':
    app.run(debug=True)