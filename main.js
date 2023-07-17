//tonic, mode, numnotes

CHROMATICS = {
    'SHARPS': ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"],
    'FLATS': ["c", "db", "d", "eb", "e", "f", "gb", "g", "ab", "a", "bb", "b"]
}

INTERVALS = [
    "u", 
    "min2", 
    "maj2", 
    "min3", 
    "maj3", 
    "p4", 
    "trit", 
    "p5", 
    "min6", 
    "maj6", 
    "min7", 
    "maj7", 
    "oct",
    "min9",
    "maj9",
    "min10",
    "maj10",
    "p11",
    "aug11",
    "p12",
    "min13",
    "maj13",
    "min14",
    "maj14",
    "p15",
    "aug15"]


KEYSTRUCTURES = {
    "MAJOR": [2, 2, 1, 2, 2, 2, 1],
    "MINOR": [2, 1, 2, 2, 1, 2, 1],
}

function repeat(list, times){
    let l = list
    for (let i = 0; i < times - 1; i++){
        list = list.concat(l)
    }

    return list
}

function batch(arr, size){
  if(arr.length > size){
        return [arr.slice(0, size), ...batch(arr.slice(size), size)]
    } else {
        return [arr];
    }
}

function fEven(start, n){
    out = []
    for (i = 0; i < n; i++){
        out.push(start + i * 2)
    }

    return out
}

function getChromaticFromNote(tonic, octaves){
    if (octaves == undefined){
        octaves = 1
    }

    let chromscale = eval(`CHROMATICS.${accidents}`)
    let index = chromscale.indexOf(tonic)
    let out = chromscale.slice(index).concat(chromscale.slice(0, index))

    return repeat(out, octaves)
}

function getKeyNotes(chromscale, struct){
    if (struct == undefined){
        struct = "MAJOR"
    }

    let ind = 0
    let notes = []
    let st = eval(`KEYSTRUCTURES.${struct}`)

    for(dif in st){
        let val = st[Number(dif)]
        notes.push(chromscale[ind])
        ind = ind + Number(val)
        
    }

    return notes
}

function getKeyChords(key, notenum){
    if (notenum == undefined){
        notenum = 3
    }

    let rng = fEven(0, notenum)
    key = repeat(key, 16)
    outlist = []

    for(let i = 0; i < 7; i++){
        for (j in rng){
            outlist.push(key[i + rng[j]])
        }
    }

    return batch(outlist, notenum)
}


function getIntervalsBetweenNotes(notelist){
    let chromscale = getChromaticFromNote(notelist[0], 4)
    let chrom = batch(chromscale, 12)
    let flag = notelist.length
    let outlist = []

    for(let octindex = 0; i < chrom.length; i++){
        let notecount = 0;
        let octave = chrom[octindex]
        for (octnote in octave){
            if (outlist.length == flag) {
                break
            }
            if (octave[octnote] == notelist[notecount]){
                if (octindex == 0){
                    outlist.push(chromscale.indexOf(octave[octnote]))
                } else {
                    outlist.push(chromscale.indexOf(octave[octnote]) + 7 * (octindex + 1))
                }
                octave.pop()
                notecount ++
            }
        }
    }

    for(let i = 0; i < outlist.length; i++){
        outlist[i] = INTERVALS[outlist[i]]
    }

    return outlist
}

console.log("A#".slice(-1))
var accidents;

tonic = document.querySelector("#tonic")
mode = document.querySelector("#mode")
numnotes = document.querySelector("#numnotes")
genbutton = document.querySelector("#generate")

function updateValues() {

    if (tonic.value.length == 2){
        accidents = tonic.value.slice(-1)
        if (accidents == "#"){
            accidents = "SHARPS"
        } else if (accidents == "b"){
            accidents = "FLATS"
        }
    } else {
        accidents = "SHARPS"
    }

    let chromscale = getChromaticFromNote(tonic.value, 4)
    let key = getKeyNotes(chromscale, mode.value.toUpperCase())
    console.log(getKeyChords(key, numnotes.value))

}

genbutton.onclick = () =>{
    updateValues()
}

