const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';


class Field {
    constructor(field = [[]]) {
        this._field = field;
        this._locationX = 0;
        this._locationY = 0;
        // home position fixed

        this._field[0][0] = pathCharacter;

        //home position random
        
        /* const randomLocation = Math.floor(Math.random * field.length);
        this._field[0][randomLocation] = pathCharacter */
    }

// Home screen and prompt logic

    print() {
        // generate a 'map'(as a string) that jumps to the next line after each row (\n)
        const displayString = this._field.map(row => {
            return row.join('')
        }).join('\n');

        console.log(displayString)
    }

    askQuestion() {
        //save the prompt answer - make it uppercase for the switch logic
        const answer = prompt('Wich way?').toUpperCase();
        // logic response for each answer
        switch (answer) {
            case 'U':
                this._locationY -= 1;
                break;
            case 'R':
                this._locationX += 1;
                break;
            case 'D':
                this._locationY += 1;
                break;
            case 'L':
                this._locationX -= 1;
                break;
            default:
                console.log('You should insert \n U to go up \n D to go down \n R to go right \n or L to fo left')
                this.askQuestion();
                break;
        }
    }

//game pre set-Up

    //let computer know if hat was found
    foundHat() {
        return this._field[this._locationY][this._locationX] === hat;
    }

    //let computer know if a hole was found
    foundHole() {
        return this._field[this._locationY][this._locationX] === hole;
    }

    //let computer know if player is inbound
    isInBounds() {
        return (
            this._locationY >= 0 &&
            this._locationX >= 0 &&
            this._locationY < this._field.length &&
            this._locationX < this._field[0].length
        );
    }


//game logic

    runGame() {
        let isPlaying = true;

        while (isPlaying) {
            this.print();
            this.askQuestion();
            
            if (!this.isInBounds()) {
                console.log('You went to far into nowhere')
                isPlaying = false;
                break;
            } else if (this.foundHole()) {
                console.log('You fell, and by now you are porbably dead!')
                isPlaying = false;
                break;
            } else if (this.foundHat()) {
                console.log('You got it, you got hatted!')
                isPlaying = false;
                break;
            }
            //Current location of the player
            this._field[this._locationY][this._locationX] = pathCharacter
        }
    }

    // static generation of the field
    static generateField(height, width, percentage = 0.1) {
        const field = new Array(height).fill(0).map(el => new Array(width));

        for (let y = 0; y < height; y++) {
            for( let x = 0; x < width; x++) {
                const prob = Math.random();
                field[y][x] = prob > percentage ? fieldCharacter : hole;
            }
        }
        
        //hat location
        const hatLocation = {
            x: Math.floor(Math.random() * width),
            y: Math.floor(Math.random() * height)
        }


        //Make sure hat is not at starting point - Isso deve atrasar o código REFRACT
        while(hatLocation.x === 0 && hatLocation.y === 0) {
            hatLocation.x = Math.floor(Math.random() * width);
            hatLocation.y = Math.floor(Math.random() * height);
        }

        
        
        field[hatLocation.y][hatLocation.x] = hat;
        return field;
    }
}

const myfield = new Field(Field.generateField(10, 10, 0.2));
myfield.runGame();