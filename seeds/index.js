const mongoose = require('mongoose');
const Player = require('../models/player');

//Connect to mongoose
mongoose.connect('mongodb://localhost:27017/fantasy');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:")); //Listens for "Error" event & triggers if found
db.once("open", () => { //Listens for "Open" event, i.e. an established connection with MongoDB & triggers if found
    console.log("Database connected");
});

//Seeding data
const playerNames = [
    "James", "Mary", "John", "Patricia", "Robert", "Jennifer",
    "Michael", "Linda", "William", "Elizabeth", "David", "Barbara",
    "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah",
    "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa",
    "Matthew", "Margaret", "Anthony", "Betty", "Mark", "Sandra",
    "Donald", "Ashley", "Steven", "Kimberly", "Paul", "Emily",
    "Andrew", "Donna", "Joshua", "Michelle", "Kenneth", "Dorothy",
    "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa"
];

//Seed function
const seedPlayers = async () => {
    try {
        await Player.deleteMany({}); // Clears the Player collection before seeding (optional to include)

        for (let name of playerNames) {
            //Seed players w/ a random name & 3 random stat averages 0-30
            const rand1 = Math.floor(Math.random() * 30);
            const rand2 = Math.floor(Math.random() * 30);
            const rand3 = Math.floor(Math.random() * 30);
            const player = new Player({ name: name, averagePoints: rand1, averageAssists: rand2, averageRebounds: rand3 });
            await player.save();
        }

        console.log('Database seeded!');
        mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.disconnect();
    }
};

//Call the seed function
seedPlayers();
