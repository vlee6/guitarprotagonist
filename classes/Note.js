class Note {
    constructor({y, lane, speed, isLong = false}) {
        this.width = 55;
        this.height = 16;
        this.position = {
            y: y,
            x: lane * this.width * 2 + this.width
        } 
        this.lane = lane
        this.speed = speed
        this.color = colors[lane]
        this.isLong = isLong
    }

    draw() {
        var scaleFactor
        if (this.position.y > 0) {
            scaleFactor = this.position.y / canvas.height
        } else {
            scaleFactor = 1
        }

        this.scaled = {
            width: this.width * scaleFactor,
            height: this.height * scaleFactor
        }

        // Math which creates the vanishing point effect
        this.position.x = ((canvas.width / 2.5) * (1 - scaleFactor)) + this.lane * this.scaled.width * 2 + this.width

        if (this.isLong) {
            c.fillStyle = this.color
            c.beginPath()
            c.ellipse(this.position.x, this.position.y, this.scaled.width / 2, this.scaled.height / 2, 0, 0, 2*Math.PI)
            c.fill()
            return    
        }

        c.fillStyle = 'rgb(0,0,0)'
        c.beginPath()
        c.ellipse(this.position.x, this.position.y, this.scaled.width, this.scaled.height, 0, 0, 2*Math.PI)
        c.fill()

        for (let i = 0; i < 2; i++) {
            c.fillStyle = this.color
            c.beginPath()
            c.ellipse(this.position.x, this.position.y - (5*i*scaleFactor) - (7*scaleFactor), this.scaled.width - (i*5*scaleFactor), this.scaled.height, 0, 0, 2*Math.PI)
            c.fill()
        }

        c.fillStyle = 'rgb(0,0,0)'
        c.beginPath()
        c.ellipse(this.position.x, this.position.y - (21*scaleFactor), this.scaled.width / 1.7, this.scaled.height / 2, 0, 0, 2*Math.PI)
        c.fill()

        c.fillStyle = 'rgb(255,255,255)'
        c.beginPath()
        c.ellipse(this.position.x, this.position.y - (25*scaleFactor), this.scaled.width / 2.2, this.scaled.height / 2, 0, 0, 2*Math.PI)
        c.fill()
    }

    update() {
        this.draw()

        this.position.y += this.speed
    }

    isOutOfBounds() {
        return this.position.y > 760 + halfFretSize - 1
    }
}