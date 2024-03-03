const canvas = document.getElementById("uncropped-canvas");
const c = canvas.getContext("2d");
canvas.width = 550;
canvas.height = 800;

// Since we're using a vanishing point effect, we need to crop the canvas to match guitar hero
const croppedCanvas = document.getElementById("cropped-canvas")
const croppedC = croppedCanvas.getContext('2d');
croppedCanvas.width = 550
croppedCanvas.height = 400

const keys = {
	a: {
		pressed: false
	},
	s: {
		pressed: false
	},
	d: {
		pressed: false
	},
	f: {
		pressed: false
	},
	g: {
		pressed: false
	},
	space: {
		pressed: false
	}
}

const colors = ['rgb(106,168,79)', 'rgb(204,0,0)', 'rgb(241,194,50)', 'rgb(61,133,198)', 'rgb(230,145,56)']

const channelY = 520
var channel0 = new Channel({y: 720, lane: 0})
var channel1 = new Channel({y: 720, lane: 1})
var channel2 = new Channel({y: 720, lane: 2})
var channel3 = new Channel({y: 720, lane: 3})
var channel4 = new Channel({y: 720, lane: 4})

function drawFretboard() {
	let perspectiveOffset = canvas.width / 2

	c.fillStyle = 'rgb(100,100,100)'
	c.beginPath()
	c.moveTo(0 + perspectiveOffset, 0)
	c.lineTo(0, canvas.height)
	c.lineTo(canvas.width, canvas.height)
	c.closePath()
	c.fill()
}



const halfFretSize = 50;
var lane0Notes = []
var lane1Notes = []
var lane2Notes = []
var lane3Notes = []
var lane4Notes = []

function generateNotes({laneNotes, laneMap, laneNum, speed}) {
	let offset = 1620
	// offset = 0

	laneNotes.length = 0
	for (let i = laneMap.length; i >= 0; i--) {
		if (laneMap[i] === 1) {
			laneNotes.push(new Note({lane: laneNum, y: i * -halfFretSize - offset, speed: speed}))
		} else if (laneMap[i] === 2) {
			for (let j = 0; j < 7; j++) {
				laneNotes.push(new Note({lane: laneNum, y: i * -halfFretSize - 30 + j * halfFretSize / 7 - offset, speed: speed, isLong: true}))
			}
		}
	}
}

currentSong = setlist[0]
generateNotes({laneMap: currentSong.lane0Map, laneNotes: lane0Notes, laneNum: 0, speed: currentSong.speed})
generateNotes({laneMap: currentSong.lane1Map, laneNotes: lane1Notes, laneNum: 1, speed: currentSong.speed})
generateNotes({laneMap: currentSong.lane2Map, laneNotes: lane2Notes, laneNum: 2, speed: currentSong.speed})
generateNotes({laneMap: currentSong.lane3Map, laneNotes: lane3Notes, laneNum: 3, speed: currentSong.speed})
generateNotes({laneMap: currentSong.lane4Map, laneNotes: lane4Notes, laneNum: 4, speed: currentSong.speed})

// Score
var MISS = 0;
var HIT = 0;
var combo = 0;
var score;

// If the first note in the array (the note closest to the channel) is out of bounds, remove it
function checkMiss({laneNotes}) {
	if (laneNotes.length > 0) {
		if (laneNotes[laneNotes.length - 1].isOutOfBounds()) {
			laneNotes.pop()
			MISS++
			combo = 0
		}
	}
}

function inRange(x, min, max) {
    return ((x - min) * (x - max) <= 0);
}

let lastMissTime = 0
function checkHit({spacePressed, keyPressed, laneNotes}) {
	let hitThreshold = 730
	let tolerance = 30
	let currentTime = performance.now()

	if (laneNotes.length > 0) {
		if (spacePressed && keyPressed) {
			if (inRange(laneNotes[laneNotes.length - 1].position.y, hitThreshold - tolerance, hitThreshold + tolerance)) {
				// console.log("HIT")
				HIT++
				laneNotes.pop()
			} else if (currentTime - lastMissTime > 200) { // Prevent repeated misses
				MISS += 1
				lastMissTime = currentTime
			}
		}
	}
}

function animate() {
    window.requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

	drawFretboard()

	// lane0Notes[lane0Notes.length - 1].color = 'rgb(255,0,0)'
	// lane1Notes[lane1Notes.length - 1].color = 'rgb(255,0,0)'
	// lane2Notes[lane2Notes.length - 1].color = 'rgb(255,0,0)'
	// lane3Notes[lane3Notes.length - 1].color = 'rgb(255,0,0)'
	// lane4Notes[lane4Notes.length - 1].color = 'rgb(255,0,0)'

	// Update each channel
	channel0.update({keyPressed: keys.a.pressed})
	channel1.update({keyPressed: keys.s.pressed})
	channel2.update({keyPressed: keys.d.pressed})
	channel3.update({keyPressed: keys.f.pressed})
	channel4.update({keyPressed: keys.g.pressed})

	// Render each note
    lane0Notes.forEach(note => { note.update() });
    lane1Notes.forEach(note => { note.update() });
    lane2Notes.forEach(note => { note.update() });
    lane3Notes.forEach(note => { note.update() });
    lane4Notes.forEach(note => { note.update() });
	
	checkMiss({laneNotes: lane0Notes})
	checkMiss({laneNotes: lane1Notes})
	checkMiss({laneNotes: lane2Notes})
	checkMiss({laneNotes: lane3Notes})
	checkMiss({laneNotes: lane4Notes})

	checkHit({spacePressed: keys.space.pressed, keyPressed: keys.a.pressed, laneNotes: lane0Notes})
	checkHit({spacePressed: keys.space.pressed, keyPressed: keys.s.pressed, laneNotes: lane1Notes})
	checkHit({spacePressed: keys.space.pressed, keyPressed: keys.d.pressed, laneNotes: lane2Notes})
	checkHit({spacePressed: keys.space.pressed, keyPressed: keys.f.pressed, laneNotes: lane3Notes})
	checkHit({spacePressed: keys.space.pressed, keyPressed: keys.g.pressed, laneNotes: lane4Notes})

	// Crop canvas to finish the parallax effect
	croppedC.clearRect(0, 0, canvas.width, canvas.height)
	croppedC.drawImage(canvas, canvas.width-croppedCanvas.width, canvas.height-croppedCanvas.height, croppedCanvas.width, croppedCanvas.height, 0, 0, croppedCanvas.width, croppedCanvas.height)
    c.restore()
	console.log(lane0Notes.length)

	document.getElementById('score').innerHTML = "Score: " + (HIT * 100 + MISS * -5)
}

window.addEventListener('keydown', (event) => {
	switch (event.key) {
		case 'a':
			keys.a.pressed = true;
			break
		case 's':
			keys.s.pressed = true;
			break
		case 'd':
			keys.d.pressed = true;
			break
		case 'f':
			keys.f.pressed = true;
			break
		case 'g':
			keys.g.pressed = true;
			break
		case ' ':
			keys.space.pressed = true;
			break		
	}
})

window.addEventListener('keyup', (event) => {
	switch (event.key) {
		case 'a':
			keys.a.pressed = false;
			break
		case 's':
			keys.s.pressed = false;
			break
		case 'd':
			keys.d.pressed = false;
			break
		case 'f':
			keys.f.pressed = false;
			break
		case 'g':
			keys.g.pressed = false;
			break
		case ' ':
			keys.space.pressed = false;
			break	
	}
})

document.body.addEventListener("keydown", () => {
	document.getElementById('thumbnail').style.opacity = '0';

	var elements = document.getElementsByClassName('display-on-start')
	for (let i = 0; i < elements.length; i++) {
		elements[i].style.display = 'block'
	}

	currentSong.song.playbackRate = 1
	currentSong.song.play()
	animate() //!!!
}, {once: true})

