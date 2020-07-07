class PlayerDetails {
    constructor(name, startingStack, position) {
        this.handsDealt = 0;
        this.name = name;
        this.startingStack = startingStack;
        this.position = position;
        this.winnings = 0;
    }

    getBBPer100(BB) {
        return ((this.winnings / BB) / this.handsDealt) * 100;
    }

    won(amount) {
        this.winnings += amount;
    }

    lost(amount) {
        this.winnings -= amount;
    }
 
    dealtHand() {
        this.handsDealt++;
    }

    getName() {
        return this.name;
    }

    toString() {
        return this.name;
    }
}