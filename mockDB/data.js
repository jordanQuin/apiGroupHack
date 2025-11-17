// Données stockées en mémoire - Base de données des voitures
let mockCarDB = [
  { id: 1, brand: "Toyota", model: "Camry", year: 2020, price: 25000, ownerId: 1 },
  { id: 2, brand: "Honda", model: "Civic", year: 2021, price: 22000, ownerId: 1 },
  { id: 3, brand: "BMW", model: "X5", year: 2022, price: 65000, ownerId: 2 },
  { id: 4, brand: "Mercedes", model: "C-Class", year: 2023, price: 45000, ownerId: 2 },
  { id: 5, brand: "Ford", model: "Mustang", year: 2021, price: 35000, ownerId: 3 },
  { id: 6, brand: "Audi", model: "A4", year: 2022, price: 42000, ownerId: 3 },
  { id: 7, brand: "Volkswagen", model: "Golf", year: 2020, price: 24000, ownerId: 1 },
  { id: 8, brand: "Tesla", model: "Model 3", year: 2023, price: 50000, ownerId: 2 },
  { id: 9, brand: "Nissan", model: "Altima", year: 2021, price: 26000, ownerId: 3 },
  { id: 10, brand: "Hyundai", model: "Elantra", year: 2022, price: 23000, ownerId: 1 }
];

// Mock users database
let mockUsersDB = [
  { id: 1, email: "user1@example.com", password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", role: "user" }, // password: password
  { id: 2, email: "user2@example.com", password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", role: "user" }, // password: password
  { id: 3, email: "admin@example.com", password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", role: "admin" } // password: password
];

module.exports = { 
  cars: mockCarDB, 
  users: mockUsersDB 
};