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


// KEYSTRUCTURES = {
//     "MAJOR": [2, 2, 1, 2, 2, 2, 1],
//     "MINOR": [2, 1, 2, 2, 1, 2, 1],
// }

SCALES = {
    'ionian pentatonic'     : ['u', 'maj3', 'p4'  , 'p5'  , 'maj7', 'oct'],
    'dorian pentatonic'     : ['u', 'maj2', 'min3', 'p5'  , 'maj6', 'oct'],
    'phrygian pentatonic'   : ['u', 'min2', 'p4'  , 'p5'  , 'min7', 'oct'],
    'lydian pentatonic'     : ['u', 'maj2', 'maj3', 'trit', 'maj6', 'oct'],
    'mixolydian pentatonic' : ['u', 'maj3', 'p4'  , 'p5'  , 'min7', 'oct'],
    'locrian pentatonic'    : ['u', 'min3', 'p4'  , 'trit', 'min7', 'oct'],
    'minor pentatonic'      : ['u', 'min3', 'p4'  , 'p5'  , 'min7', 'oct'],
    'major pentatonic'      : ['u', 'maj2', 'maj3', 'p5'  , 'maj6', 'oct'],
    'major'                 : ['u', 'maj2', 'maj3', 'p4'  , 'p5'  , 'maj6', 'maj7',  'oct'],
    'minor'                 : ['u', 'maj2', 'min3', 'p4'  , 'p5'  , 'min6'  , 'min7',  'oct'],
    'harmonic minor'        : ['u', 'maj2', 'min3', 'p4'  , 'p5'  , 'min6'  , 'maj7',  'oct'],
    'melodic minor'         : ['u', 'maj2', 'min3', 'p4'  , 'p5'  , 'maj6', 'maj7',  'oct'],
    'dorian'                : ['u', 'maj2', 'min3', 'p4'  , 'p5'  , 'maj6', 'min7',  'oct'],
    'phrygian'              : ['u', 'min2', 'min3', 'p4'  , 'p5'  , 'min6'  , 'min7',  'oct'],
    'lydian'                : ['u', 'maj2', 'maj3', 'trit', 'p5'  , 'maj6', 'maj7',  'oct'],
    'mixolydian'            : ['u', 'maj2', 'maj3', 'p4'  , 'p5'  , 'maj6', 'min7',  'oct'],
    'locrian'               : ['u', 'min2', 'min3', 'p4'  , 'trit', 'min6'  , 'min7',  'oct'],
}


function title(str){
    return str[0].toUpperCase() + str.slice(1, str.length)
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

function getChromaticFromNote(tonic, acc, octaves){
    if (octaves == undefined){
        octaves = 1
    }


    if (tonic.length == 1){
        if (acc == "FLATS"){
            tonic = tonic + "b"
        } else if (acc == "SHARPS"){
            tonic = tonic + "#"
        } else {
            acc = "SHARPS"
        }
    }

    let chromscale = eval(`CHROMATICS.${acc}`)
    let index = chromscale.indexOf(tonic)
    let out = chromscale.slice(index).concat(chromscale.slice(0, index))

    console.log(out)
    console.log(tonic)

    return repeat(out, octaves)
}

function getKeyNotes(chromscale, struct){
    if (struct == undefined){
        struct = "major"
    }

    let ind = 0
    let notes = []
    // let st = eval(`KEYSTRUCTURES.${struct}`)
    let st = eval(`SCALES.${struct}`)

    // for(dif in st){
    //     let val = st[Number(dif)]
    //     notes.push(chromscale[ind])
    //     ind = ind + Number(val)
        
    // }

    for(each in st){
        notes.push(chromscale[INTERVALS.indexOf(st[each])])
    }
    return notes
}

function getKeyChords(key, notenum){
    if (notenum == undefined || notenum == 0){
        notenum = 3
    }

    let rng = fEven(0, notenum)
    key = repeat(key, 16)
    outlist = []

    for(let i = 0; i < 7; i++){
        for (j in rng){
            outlist.push(title(key[i + rng[j]]))
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

// function sharporflat(tonic){
//     if (tonic == 2){
//         accidents = tonic.slice(-1)
//         if (accidents == "#"){
//             accidents = "SHARPS"
//         } else if (accidents == "b"){
//             accidents = "FLATS"
//         }
//     } else {
//         accidents = "SHARPS"
//     }

//     return accidents
// }

function sharporflat(str){
    if (str == "FLATS"){
        return "♭"
    }
    else if (str == "SHARPS"){
        return "♯"
    }
    else if (str == "NAT"){
        return "♮"
    }
}

var accidents;
var tonic = document.querySelector("#tonic")
var mode = document.querySelector("#mode")
var numnotes = document.querySelector("#numnotes")
var genbutton = document.querySelector("#generate")
var result = document.querySelector("#resultbox")
var acc = document.querySelector("#accidents")

function updateValues() {

    result.style.display = "inline-block"

    // accidents = sharporflat(tonic.value)
    let accidents = acc.value
    let chromscale = getChromaticFromNote(tonic.value, accidents, 4)
    
    let key = getKeyNotes(chromscale, mode.value) 
    let keyChords = getKeyChords(key, numnotes.value)

    result.innerHTML += `<div style="text-align: center"> ${title(tonic.value)}${sharporflat(acc.value)} ${mode.value} </div>`
    for(let i = 0; i < keyChords.length; i++){
        
        result.innerHTML += `<div style="letter-spacing: 2px" > ${i + 1}º : ${keyChords[i].join(" - ")} <br></div>`
    }
   

}

function clearbox(){
    result.innerText = ""
}

genbutton.onclick = () =>{
    clearbox()
    updateValues()
}

