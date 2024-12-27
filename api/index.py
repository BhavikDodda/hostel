from flask import Flask, request, jsonify

from flask import Flask
app = Flask(__name__)

####
# Top trading cycle
def findCycle(allot,prefList,pplcycle):
    cycleList=[]
    leftout=pplcycle

    while leftout:
        startperson=next(iter(leftout))
        iterperson=startperson

        cycle=[iterperson]
        while True:
            
            iterperson=allot[[item for item in prefList if item[0]==iterperson][0][1][0]]
            if(iterperson==startperson):
                leftout=leftout.difference(set(cycle))
                cycleList.append(cycle)
                break
            if iterperson in cycle:
                cycle=cycle[cycle.index(iterperson):]
                leftout=leftout.difference(set(cycle))
                cycleList.append(cycle)
                break
            elif iterperson not in leftout:
                leftout.remove(startperson)
                break
            cycle.append(iterperson)
        
    print("list of ppl that need to cycle", cycleList)
    return cycleList

def shuffleAllot(allot,prefList,cycleList):
    for thecycle in cycleList:
        rooms=[[item for item in prefList if item[0]==i][0][1][0] for i in thecycle]
        for room, person in zip(rooms, thecycle):
            allot[room] = person
        def filter0(item0):
            return item0[0] not in thecycle
        prefList=list(filter(filter0,prefList))
        def filter1(item1):
            return item1 not in rooms
        newprefList=[]
        for personslist in prefList:
            newprefList.append((personslist[0],list(filter(filter1,personslist[1]))))
        prefList=newprefList
        return prefList
        
def cost(allot0,pref0):
    score=0
    for room in allot0:
        person=allot0[room]
        score+=[item for item in pref0 if item[0]==person][0][1].index(room)
    return score

def Result(initialallot,preflist):
    allot=initialallot
    prefList=preflist

    pplleft=(set(allot.values()))
    origpref=prefList
    while len(prefList)>0:
        cycLi=findCycle(allot,prefList,pplleft)
        if len(cycLi)==0:
            break
        pplleft = pplleft.difference({x for y in cycLi for x in y})
        prefList=shuffleAllot(allot,prefList,cycLi)
        print("person, allotment pref")
        print(prefList)
        print("(rooms,people)")
        print(allot)
        print("cost: ",cost(allot,origpref),"\n\n")
        return ({'finalAllot':allot})

####

@app.route('/api/run-ttc', methods=['POST'])
def run_ttc():
    print(request)
    data = request.json
    N = data.get('rooms')
    preferences = data.get('preferences')
    prefList=[(i+1, prefs) for i, prefs in enumerate(preferences)]
    initialallotment = data.get('roomAllot')
    room_assignment = {}
    for person, room in enumerate(initialallotment):
        room_assignment[room]=person+1
    print(N)
    print("person, allotment pref")
    print(prefList)
    print("(rooms,people)")
    print(room_assignment)
    #
    originalAssignment=room_assignment.copy()
    Answer=Result(room_assignment,prefList)
    graph_data = [{"from": i, "to": None} for i in range(len(preferences))]
    detected_cycles = [[i] for i in range(len(preferences))]

    return jsonify({
        "oldcost": cost(originalAssignment,prefList),
        "allocation": Answer['finalAllot'],
        "newcost": cost(Answer['finalAllot'],prefList),
    })

@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"

if __name__ == '__main__':
    app.run(debug=True,port=5328)
