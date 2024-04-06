import csv
import json

data = []
with open('pixels.csv', 'r') as f:
    csv_reader = csv.reader(f)
    next(csv_reader)
    for row in csv_reader:
        action = json.loads(row[3])
        data.append({"email":row[1], "time":row[2], "x":action["x"], "y":action["y"], "color":action["color"]})
with open('data2.json', 'w') as f:
    json.dump(data, f)