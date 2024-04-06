import requests
import json

######## RECUPERATION DES DONNEES ########
#start = [22,68]
#end = [149,149]
#
#for y in range(start[1],end[1]+1):
#    if y > start[1]:
#        s = 0
#    else:
#        s = start[0]
#    line = []
#    for x in range(s, end[0]+1):
#        response = requests.get('https://war.404devinci.fr/api/canvas/history?x='+str(x)+'&y='+str(y))
#        if response.status_code == 200:
#            line.append(response.json())
#            print("✅ ("+str(x)+","+str(y)+")")
#        else:
#            print("❌ ("+str(x)+","+str(y)+"). Erreur :", response.status_code)
#    
#    with open('data.json', 'r') as f:
#        existing_data = json.load(f)
#    existing_data += line
#    with open('data.json', 'w') as f:
#        json.dump(existing_data, f)
#    print("✅✅✅ pour y="+str(y))


######## CORRECTION DES DONNEES ########
with open('data.json', 'r') as f:
    data = json.load(f)
for pixel in data:
    x = int(pixel["x"])
    y = int(pixel["y"])
    n = 0
    hitoryCopie = list(pixel["history"]) #on crée une copie pour pas enlever des elements (ligne 43) dans la liste alors qu'on est en train de la parcourir
    for h in hitoryCopie:
        xh = h["action"]["x"]
        yh = h["action"]["y"]
        if xh != x or yh != y:
            if xh <= 150 and yh <= 150:
                for hh in data[yh*150+xh]["history"]:
                    if hh["devinciEmail"] == h["devinciEmail"] and hh["time"] == h["time"]:
                       data[yh*150+xh]["history"].remove(hh)
                       break
                print(h["devinciEmail"],h["time"],"duplicat supprimé !")
            else:
                pixel["history"].remove(h)
        n += 1
with open('data.json', 'w') as f:
    json.dump(data, f)