CREATE DATABASE FurniEcommerce;
GO
USE FurniEcommerce;
GO

-- Users Table
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Phone NVARCHAR(20) NULL
);

-- Furniture Categories Table
CREATE TABLE FurnitureCategories (
    CategoryID INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(100) NOT NULL
);

-- Furniture Items Table
CREATE TABLE FurnitureItems (
    ItemID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    Price DECIMAL(10,2) NOT NULL,
    Stock INT NOT NULL,
    CategoryID INT FOREIGN KEY REFERENCES FurnitureCategories(CategoryID),
    ImageURL NVARCHAR(500) NULL
);

-- Shopping Cart Table
CREATE TABLE Cart (
    CartID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    ItemID INT FOREIGN KEY REFERENCES FurnitureItems(ItemID),
    Quantity INT NOT NULL DEFAULT 1
);

-- Orders Table
CREATE TABLE Orders (
    OrderID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    OrderDate DATETIME DEFAULT GETDATE(),
    TotalAmount DECIMAL(10,2) NOT NULL,
    PaymentStatus NVARCHAR(50) NOT NULL,
    DeliveryStatus NVARCHAR(50) NOT NULL
);

-- Order Details Table
CREATE TABLE OrderDetails (
    OrderDetailID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT FOREIGN KEY REFERENCES Orders(OrderID),
    ItemID INT FOREIGN KEY REFERENCES FurnitureItems(ItemID),
    Quantity INT NOT NULL,
    Price DECIMAL(10,2) NOT NULL
);

-- Payments Table
CREATE TABLE Payments (
    PaymentID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT FOREIGN KEY REFERENCES Orders(OrderID),
    PaymentMethod NVARCHAR(50) NOT NULL,
    PaymentDate DATETIME DEFAULT GETDATE()
);

-- Addresses Table
CREATE TABLE Addresses (
    AddressID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    AddressLine NVARCHAR(255) NOT NULL,
    City NVARCHAR(100) NOT NULL,
    PostalCode NVARCHAR(20) NOT NULL
);

-- Reviews Table
CREATE TABLE Reviews (
    ReviewID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    ItemID INT FOREIGN KEY REFERENCES FurnitureItems(ItemID),
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    ReviewText NVARCHAR(MAX) NULL,
    ReviewDate DATETIME DEFAULT GETDATE()
);

-- Blog Posts Table
CREATE TABLE BlogPosts (
    PostID INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);
