const { cars, users } = require('../mockDB/data');

module.exports = {
    // Cars operations
    getAllCars: async () => {
        return cars;
    },
    getCarById: async (id) => {
        return cars.find(car => car.id === id);
    },
    createCar: async (carData) => {
        const newCar = {
            id: cars.length ? cars[cars.length - 1].id + 1 : 1,
            ...carData
        };
        cars.push(newCar);
        return newCar;
    },
    updateCarById: async (id, carData) => {
        const index = cars.findIndex(car => car.id === id);
        if (index === -1) {
            throw new Error("Car not found");
        }
        cars[index] = { id, ...carData };
        return cars[index];
    },
    deleteCarById: async (id) => {
        const index = cars.findIndex(car => car.id === id);
        if (index === -1) {
            throw new Error("Car not found");
        }
        const deletedCar = cars.splice(index, 1);
        return deletedCar[0];
    },

    // Users operations
    getAllUsers: async () => {
        return users;
    },
    getUserById: async (id) => {
        return users.find(user => user.id === id);
    },
    getUserByEmail: async (email) => {
        return users.find(user => user.email === email);
    },
    createUser: async (userData) => {
        const newUser = {
            id: users.length ? users[users.length - 1].id + 1 : 1,
            ...userData
        };
        users.push(newUser);
        return newUser;
    }
};