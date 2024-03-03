class Channel {
    constructor ({y, lane}) {
        this.width = 50
        this.height = 16
        this.position = {
            y: y,
            x: lane * this.width * 2 + this.width + 25
        }
        this.lane = lane
        this.color = colors[lane]
    }

    draw() {
        c.fillStyle = this.color
        c.beginPath()
        c.ellipse(this.position.x, this.position.y, this.width, this.height, 0, 0, 2*Math.PI)
        c.fill()

        c.fillStyle = 'rgb(255,255,255)'
        c.beginPath()
        c.ellipse(this.position.x, this.position.y, this.width * 0.8, this.height * 0.8, 0, 0, 2*Math.PI)
        c.fill()

        c.fillStyle = 'rgb(0,0,0)'
        c.beginPath()
        c.ellipse(this.position.x, this.position.y, this.width * 0.6, this.height * 0.6, 0, 0, 2*Math.PI)
        c.fill()
    }

    update({keyPressed}) {
        if (keyPressed) {
            c.fillStyle = this.color
            c.beginPath()
            c.ellipse(this.position.x, this.position.y, this.width, this.height, 0, 0, 2*Math.PI)
            c.fill()
        } else {
            this.draw()
        }
    }

}