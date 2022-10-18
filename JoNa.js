const Deque = require("double-ended-queue");
const process = require('process');


/* NEURACHAIN */

class NEURACHAIN {
    constructor() {
        this.last_block_mined = false;
        this.blocks_history = new Deque();
        this.available_synapses = new Deque();
        this.waiting_UserInputs = new Deque();
    }

    print() {
        console.log("Last block mined:", this.last_block_mined.id, " Available synapses:", this.available_synapses.length, 
        " Waiting inputs:", this.waiting_UserInputs.length, "\n");
    }
}

var __NEURACHAIN__ = new NEURACHAIN();


/* BLOCK */

class Block {
    constructor(synapse) {
        let x = __NEURACHAIN__.last_block_mined;
        if (x == false)
            this.id = 0;
        else 
            this.id = x.id + 1;
            this.creation_date = new Date();
        this.parent_block = synapse.block_start;
        this.wallet_A = synapse.user_input.wallet_A;
        this.wallet_B = synapse.user_input.wallet_B;
        this.DOLLARS = synapse.user_input.DOLLARS;
        this.transfert = money_transfer(this.DOLLARS, this.wallet_A, this.wallet_B);
    }

    create_synapses() {
        if (__NEURACHAIN__.last_block_mined == false || __NEURACHAIN__.available_synapses.length < 3) {
            this.s0 = new Synapse(this.id);
            this.s1 = new Synapse(this.id);
            this.s2 = new Synapse(this.id);
        } else {
            this.s0 = false;
            this.s1 = false;
            this.s2 = false;
        }
    }

    actualization() {
        __NEURACHAIN__.last_block_mined = this;
        __NEURACHAIN__.blocks_history.push(this);
        __NEURACHAIN__.available_synapses.get(0).block_end = this.id;
        __NEURACHAIN__.available_synapses.shift();
        __NEURACHAIN__.waiting_UserInputs.shift();
    }

    print() {
        console.log("\nId:", this.id, "\nCreation date:", this.creation_date, "\nParent block:", 
        this.parent_block, "\nTransfer:", this.transfert, "\nWallet - sender:", this.wallet_A.id, 
        "\nWallet - receiver:", this.wallet_B.id, "\nDOLLARS:", this.DOLLARS / 100);
    }

    print_synapses() {
        console.log("\nId:", this.id, "\nSynapse 0:", this.s0, "\nSynapse 1:", this.s1, "\nSynapse 2:", this.s2);
    }
}


/* SYNAPSE */

class Synapse {
    constructor(b_start) {
        this.block_start = b_start;
        this.user_input = false;
        this.block_end = false;
        __NEURACHAIN__.available_synapses.push(this);
    }

    print() {
        console.log("Starting block:", this.block_start, " Ending block:", this.block_end);
    }
}

var __FIRST__SYNAPSE__ = new Synapse(false);


/* OBJECT USER INPUT */

class UserInput {
    constructor(wA, wB, DOLLARS) {
        this.wallet_A = wA;
        this.wallet_B = wB;
        this.DOLLARS = DOLLARS;
    }

    push_to_N(){
        __NEURACHAIN__.waiting_UserInputs.push(this);
    }

    print() {
        console.log("Wallet A:", this.wallet_A.id, " Wallet B:", this.wallet_B.id,  " Amount:", this.DOLLARS / 100);
    }
}


/* SAFE */

class Safe {
    constructor(DOLLARS) {
        this.DOLLARS = DOLLARS;
        this.creation_date = new Date();
    }

    print() {
        console.log("SAFE: \nDOLLARS:", this.DOLLARS / 100, " Creation date:", this.creation_date);
    }
}

var __SAFE__ = new Safe(0);


/* WALLET */

var wallets_list = new Deque();

class Wallet {
    constructor(DOLLARS) {
        let x = wallets_list.length;
        x < 1 ? this.id = 0: this.id = x;
        this.creation_date = new Date();
        this.DOLLARS = DOLLARS;
    }

    print() {
        console.log("Id:", this.id, " DOLLARS:", this.DOLLARS / 100, " Creation date:", this.creation_date);
    }
}

function has_necessary_money(wal, DOLLARS) {
    if (wal.DOLLARS < DOLLARS)
        return false;
    return true;
}

function create_multiple_wallets(nbWallets) {
    for (i = 0; i < nbWallets; i++) {
        let y = new Wallet(Math.floor(Math.random() * 1234567890))
        __SAFE__.DOLLARS += y.DOLLARS;
        wallets_list.push(y);
    }
}


/* MINE A BLOCK */

function mine_block(user_input) {
    __NEURACHAIN__.available_synapses.get(0).user_input = user_input;
    if (__NEURACHAIN__.available_synapses.get(0).user_input != false) {
        x = new Block(__NEURACHAIN__.available_synapses.get(0));
        x.create_synapses();
        x.actualization();
        Object.freeze(x);
    }
}


/* MINE ALL WAITING INPUTS */

function mine_all() {
    while (__NEURACHAIN__.waiting_UserInputs.length > 0) {
        mine_block(__NEURACHAIN__.waiting_UserInputs.get(0));
    }
}


/* BULK SENDING OF USER INPUTS */

function find_y(x, len_w) {
    let y = Math.floor(Math.random() * len_w);
    return (y != x ? y : find_y(x, len_w));
}

function bulk_sending_UserInputs(nbInputs, len_w) {
    for (i = 0; i < nbInputs; i++){
        let x = Math.floor(Math.random() * len_w);
        let u = new UserInput(wallets_list.get(x), wallets_list.get(find_y(x, len_w)), Math.floor(Math.random() * wallets_list.get(x).DOLLARS));
        Object.freeze(u);
        u.push_to_N();
    }
}


/* MONEY TRANSFER */

function money_transfer(DOLLARS, wallet_A, wallet_B) {
    let x = has_necessary_money(wallet_A, DOLLARS);
    if (x == false)
        return false;
    let save_wA = wallet_A.DOLLARS;
    let save_wB = wallet_B.DOLLARS;
    wallet_A.DOLLARS -= DOLLARS;
    wallet_B.DOLLARS += DOLLARS;
    if ((save_wA + save_wB) == (wallet_A.DOLLARS + wallet_B.DOLLARS))
        return true;
    return 2;
}


/* PRINTING FUNCTIONS */

function print_x_blocks(x, start) {
    console.log("\nBLOCK Y AND X PREVIOUS");
    let y = __NEURACHAIN__.blocks_history.length;
    for (i = 0; i < x; i++) {
        if (start < y && start - i >= 0) {
            console.log(__NEURACHAIN__.blocks_history.get(__NEURACHAIN__.blocks_history.length - i - 1).print());
        }
    }
}

function print_block_and_x_parents(x, start) {
    console.log("\nBLOCK Y AND X PARENTS");
    let y = __NEURACHAIN__.blocks_history.length;
    let p_block = __NEURACHAIN__.blocks_history.get(start);
    for (i = 0; i < x; i++) {
        if (start < y) {
            console.log(p_block.print());
            p_block = __NEURACHAIN__.blocks_history.get(p_block.parent_block);
            if (p_block.parent_block == false){
                return 0;
            }
        }
    }
}

function print_x_wallets(x, start) {
    console.log("\nWALLET Y AND X NEXT\n");
    let y = wallets_list.length;
    for (i = 0; i < x; i++) {
        if (i + start < y) {
            console.log(wallets_list.get(i + start).print());
        }
    }
}


/* MAIN */

function get_argv_UI(x, def) {
    if (process.argv.length >= x && process.argv[x] >= 0) {
        return process.argv[x];
    }
    return def;
}

function main() {
    create_multiple_wallets(500);
    bulk_sending_UserInputs(get_argv_UI(2, 200000), wallets_list.length);
    console.log("\nInputs sent.");
    let time = new Date();
    mine_all();
    time = (new Date() - time) / 1000;
    print_x_blocks(3, __NEURACHAIN__.blocks_history.length - 1);
    print_block_and_x_parents(3, __NEURACHAIN__.blocks_history.length - 1);
    //print_x_wallets(5, 0);
    console.log("\nExecution time:", time, "seconds");
    console.log("Blocks mined per second:", Math.floor(1 / time * __NEURACHAIN__.blocks_history.length));
    console.log(__NEURACHAIN__.print());
}

main();