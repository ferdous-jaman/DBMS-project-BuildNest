-- BuildNest : Where Owners & Workers Meet


-- Database Creation
CREATE DATABASE ConstructionWorkerManagement;
USE ConstructionWorkerManagement;

-- Core Project Management Tables
CREATE TABLE Owners (
    OwnerID INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Phone VARCHAR(15) NOT NULL,
    Email VARCHAR(100),
    ResidentialAddress VARCHAR(255),
    TotalInvestment DECIMAL(15, 2)
);

CREATE TABLE Buildings (
    BuildingID INT AUTO_INCREMENT PRIMARY KEY,
    ProjectName VARCHAR(100) NOT NULL,
    Location VARCHAR(255),
    NumberOfFloors INT,
    NumberOfApartments INT,
    TotalCost DECIMAL(15, 2),
    StartDate DATE,
    ExpectedCompletionDate DATE
);

CREATE TABLE Apartments (
    ApartmentID INT AUTO_INCREMENT PRIMARY KEY,
    BuildingID INT,
    ApartmentNumber VARCHAR(10) NOT NULL,
    FloorNumber INT,
    Size DECIMAL(10, 2),
    Price DECIMAL(15, 2),
    Status ENUM('Sold', 'Available', 'Under Construction'),
    FOREIGN KEY (BuildingID) REFERENCES Buildings(BuildingID)
);

CREATE TABLE Project_Stages (
    StageID INT AUTO_INCREMENT PRIMARY KEY,
    BuildingID INT,
    StageName VARCHAR(50),
    StartDate DATE,
    EndDate DATE,
    Progress DECIMAL(5, 2),
    FOREIGN KEY (BuildingID) REFERENCES Buildings(BuildingID)
);

-- Workforce Management Tables
CREATE TABLE Sector_Heads (
    HeadID INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(100),
    Phone VARCHAR(15),
    Sector VARCHAR(50),
    Email VARCHAR(100),
    BuildingID INT,
    MonthlySalary DECIMAL(15, 2),
    FOREIGN KEY (BuildingID) REFERENCES Buildings(BuildingID)
);

CREATE TABLE Workers (
    WorkerID INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(100),
    Specialization VARCHAR(50),
    Phone VARCHAR(15),
    Address VARCHAR(255),
    HeadID INT,
    DailyWage DECIMAL(10, 2),
    WorkStatus ENUM('Active', 'On Leave'),
    FOREIGN KEY (HeadID) REFERENCES Sector_Heads(HeadID)
);

CREATE TABLE Worker_Attendance (
    AttendanceID INT AUTO_INCREMENT PRIMARY KEY,
    WorkerID INT,
    Date DATE,
    Shift ENUM('Morning', 'Evening'),
    Status ENUM('Present', 'Absent', 'On Leave'),
    FOREIGN KEY (WorkerID) REFERENCES Workers(WorkerID)
);

CREATE TABLE Worker_Payments (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    WorkerID INT,
    AmountPaid DECIMAL(15, 2),
    PaymentDate DATE,
    PaymentMethod ENUM('Cash', 'Bank Transfer'),
    FOREIGN KEY (WorkerID) REFERENCES Workers(WorkerID)
);
ALTER TABLE Worker_Payments MODIFY COLUMN PaymentMethod ENUM('Cash', 'Bank Transfer', 'bKash', 'Nagad');


-- Materials and Resources Tables
CREATE TABLE Materials (
    MaterialID INT AUTO_INCREMENT PRIMARY KEY,
    MaterialName VARCHAR(100),
    Category VARCHAR(50),
    UnitPrice DECIMAL(10, 2),
    StockQuantity INT,
    BuildingID INT,
    FOREIGN KEY (BuildingID) REFERENCES Buildings(BuildingID)
);

CREATE TABLE Material_Usage_Log (
    LogID INT AUTO_INCREMENT PRIMARY KEY,
    MaterialID INT,
    BuildingID INT,
    WorkerID INT,
    DateUsed DATE,
    QuantityUsed INT,
    UsagePurpose VARCHAR(255),
    FOREIGN KEY (MaterialID) REFERENCES Materials(MaterialID),
    FOREIGN KEY (BuildingID) REFERENCES Buildings(BuildingID),
    FOREIGN KEY (WorkerID) REFERENCES Workers(WorkerID)
);

CREATE TABLE Suppliers (
    SupplierID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100),
    ContactNumber VARCHAR(15),
    Address VARCHAR(255),
    Email VARCHAR(100)
);

CREATE TABLE Material_Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    SupplierID INT,
    MaterialID INT,
    OrderDate DATE,
    QuantityOrdered INT,
    TotalCost DECIMAL(15, 2),
    FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID),
    FOREIGN KEY (MaterialID) REFERENCES Materials(MaterialID)
);

CREATE TABLE Equipment (
    EquipmentID INT AUTO_INCREMENT PRIMARY KEY,
    EquipmentName VARCHAR(100),
    Category VARCHAR(50),
    EquipmentCondition ENUM('New', 'Used'),
    AvailabilityStatus ENUM('Available', 'In Use', 'Under Maintenance')
);


CREATE TABLE Equipment_Usage_Log (
    UsageLogID INT AUTO_INCREMENT PRIMARY KEY,
    EquipmentID INT,
    WorkerID INT,
    StartDate DATE,
    EndDate DATE,
    Purpose VARCHAR(255),
    FOREIGN KEY (EquipmentID) REFERENCES Equipment(EquipmentID),
    FOREIGN KEY (WorkerID) REFERENCES Workers(WorkerID)
);

-- Financial and Legal Tables
CREATE TABLE Owner_Payments (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    OwnerID INT,
    Amount DECIMAL(15, 2),
    PaymentDate DATE,
    PaymentMethod ENUM('Cash', 'Bank Transfer'),
    FOREIGN KEY (OwnerID) REFERENCES Owners(OwnerID)
);
ALTER TABLE Owner_Payments 
MODIFY COLUMN PaymentMethod ENUM('Cash', 'Bank Transfer', 'bKash', 'Nagad');



CREATE TABLE Invoices (
    InvoiceID INT AUTO_INCREMENT PRIMARY KEY,
    OwnerID INT,
    Amount DECIMAL(15, 2),
    InvoiceDate DATE,
    DueDate DATE,
    Status ENUM('Paid', 'Unpaid'),
    FOREIGN KEY (OwnerID) REFERENCES Owners(OwnerID)
);

CREATE TABLE Contracts (
    ContractID INT AUTO_INCREMENT PRIMARY KEY,
    BuildingID INT,
    ContractorName VARCHAR(100),
    StartDate DATE,
    EndDate DATE,
    TotalAmount DECIMAL(15, 2),
    Status ENUM('Active', 'Completed', 'Terminated', 'Pending'),
    Terms TEXT,
    FOREIGN KEY (BuildingID) REFERENCES Buildings(BuildingID)
);

-- Safety and Monitoring Tables
CREATE TABLE Safety_Incidents (
    IncidentID INT AUTO_INCREMENT PRIMARY KEY,
    WorkerID INT,
    IncidentDate DATE,
    IncidentType VARCHAR(50),
    ResolutionStatus ENUM('Resolved', 'Unresolved'),
    FOREIGN KEY (WorkerID) REFERENCES Workers(WorkerID)
);

CREATE TABLE Daily_Work_Log (
    LogID INT AUTO_INCREMENT PRIMARY KEY,
    BuildingID INT,
    Date DATE,
    WorkCompleted TEXT,
    IssuesReported TEXT,
    FOREIGN KEY (BuildingID) REFERENCES Buildings(BuildingID)
);

CREATE TABLE Building_Inspection_Reports (
    InspectionID INT AUTO_INCREMENT PRIMARY KEY,
    BuildingID INT,
    InspectorName VARCHAR(100),
    InspectionDate DATE,
    Findings TEXT,
    Remarks TEXT,
    Status ENUM('Passed', 'Failed'),
    FOREIGN KEY (BuildingID) REFERENCES Buildings(BuildingID)
);


INSERT INTO Owners (FullName, Phone, Email, ResidentialAddress, TotalInvestment) VALUES
('Md. Arman Hossain', '01711111111', 'arman@gmail.com', 'Mirpur, Dhaka', 2500000.00),
('Sharmin Akter', '01822222222', 'sharmin@gmail.com', 'Banani, Dhaka', 3200000.00),
('Rezaul Karim', '01933333333', 'rezaul@gmail.com', 'GEC, Chittagong', 4500000.00),
('Farzana Jahan', '01744444444', 'farzana@gmail.com', 'Zindabazar, Sylhet', 2800000.00),
('Md. Hasan Ali', '01855555555', 'hasan@gmail.com', 'Sonadanga, Khulna', 3000000.00),
('Nusrat Faria', '01766666666', 'nusrat@gmail.com', 'Boalia, Rajshahi', 2600000.00),
('Tamim Iqbal', '01977777777', 'tamim@gmail.com', 'Launch Terminal, Barishal', 3500000.00),
('Sadia Jahan', '01888888888', 'sadia@gmail.com', 'Tongi, Gazipur', 4000000.00),
('Mominul Haque', '01799999999', 'mominul@gmail.com', 'Fatullah, Narayanganj', 2400000.00),
('Nazmul Huda', '01810101010', 'nazmul@gmail.com', 'Sadar, Bogura', 2200000.00),
('Tasnim Rahman', '01712121212', 'tasnim@gmail.com', 'Ganginarpar, Mymensingh', 2700000.00),
('Mahmudul Hasan', '01913131313', 'mahmudul@gmail.com', 'Railroad, Jessore', 3500000.00),
('Rubel Khan', '01714141414', 'rubel@gmail.com', 'Maijdee, Noakhali', 2900000.00),
('Ayesha Siddika', '01815151515', 'ayesha@gmail.com', 'Hemayetpur, Pabna', 3100000.00),
('Taslima Akter', '01916161616', 'taslima@gmail.com', 'Bhanga, Faridpur', 2700000.00),
('Jahid Hasan', '01717171717', 'jahid@gmail.com', 'Modern Mor, Rangpur', 3200000.00),
('Sohana Rahman', '01818181818', 'sohana@gmail.com', 'Goneshpur, Dinajpur', 2900000.00),
('Kamrul Islam', '01919191919', 'kamrul@gmail.com', 'Courtpara, Kushtia', 4000000.00),
('Rafiq Ahmed', '01720202020', 'rafiq@gmail.com', 'Amberkhana, Sylhet', 3600000.00),
('Sharifa Khatun', '01821212121', 'sharifa@gmail.com', 'Laboni Point, CoxBazar', 5000000.00);


INSERT INTO Buildings (ProjectName, Location, NumberOfFloors, NumberOfApartments, TotalCost, StartDate, ExpectedCompletionDate) VALUES
('Skyline Tower', 'Gulshan, Dhaka', 20, 60, 150000000.00, '2023-01-15', '2025-12-31'),
('Green View Residence', 'Banani, Dhaka', 15, 40, 100000000.00, '2023-03-10', '2025-06-30'),
('Riverside Heights', 'Chittagong', 18, 50, 130000000.00, '2022-11-01', '2025-10-30'),
('Ocean Breeze Complex', 'Cox’s Bazar', 12, 35, 95000000.00, '2023-02-01', '2025-08-15'),
('Metro Palace', 'Mirpur, Dhaka', 22, 65, 200000000.00, '2023-05-20', '2026-01-10'),
('Sunset Valley', 'Sylhet', 10, 25, 55000000.00, '2023-01-10', '2025-07-20'),
('Royal Tower', 'Rajshahi', 16, 45, 120000000.00, '2023-06-01', '2025-11-10'),
('Golden Heights', 'Khulna', 14, 30, 85000000.00, '2023-04-15', '2025-09-30'),
('Luxury Residence', 'Mymensingh', 20, 55, 170000000.00, '2023-03-05', '2025-12-10'),
('East Coast Mansion', 'Barishal', 13, 40, 95000000.00, '2023-05-25', '2025-10-01'),
('Silver Garden', 'Narayanganj', 10, 30, 60000000.00, '2023-02-10', '2025-08-30'),
('Platinum Heights', 'Gazipur', 18, 60, 140000000.00, '2023-06-15', '2026-01-05'),
('Luxe Towers', 'Pabna', 12, 25, 75000000.00, '2023-07-01', '2025-09-01'),
('Blue Hills', 'Noakhali', 15, 45, 120000000.00, '2023-01-20', '2025-06-15'),
('Urban Retreat', 'Jessore', 17, 50, 130000000.00, '2023-02-20', '2025-11-20'),
('Serene Park', 'Rangpur', 19, 60, 145000000.00, '2023-05-01', '2025-12-25'),
('Aqua Breeze', 'Dinajpur', 14, 35, 90000000.00, '2023-03-12', '2025-09-30'),
('Grand Avenue', 'Kushtia', 16, 50, 135000000.00, '2023-04-10', '2025-11-15'),
('Emerald Park', 'Rajshahi', 11, 30, 75000000.00, '2023-06-05', '2025-08-30'),
('Crystal Towers', 'Barishal', 22, 70, 180000000.00, '2023-07-20', '2026-01-01');



INSERT INTO Apartments (BuildingID, ApartmentNumber, FloorNumber, Size, Price, Status) VALUES
(1, 'A101', 1, 1200.00, 4500000.00, 'Available'),
(1, 'A102', 1, 1100.00, 4200000.00, 'Sold'),
(1, 'A103', 2, 1300.00, 4600000.00, 'Under Construction'),
(2, 'B101', 1, 1000.00, 4000000.00, 'Available'),
(2, 'B102', 1, 950.00, 3750000.00, 'Sold'),
(2, 'B103', 2, 1050.00, 3900000.00, 'Under Construction'),
(3, 'C101', 1, 1400.00, 5000000.00, 'Available'),
(3, 'C102', 1, 1350.00, 4900000.00, 'Sold'),
(3, 'C103', 2, 1200.00, 4600000.00, 'Under Construction'),
(4, 'D101', 1, 950.00, 3750000.00, 'Available'),
(4, 'D102', 1, 900.00, 3500000.00, 'Sold'),
(4, 'D103', 2, 1050.00, 3800000.00, 'Under Construction'),
(5, 'E101', 1, 1100.00, 4200000.00, 'Available'),
(5, 'E102', 1, 1050.00, 4000000.00, 'Sold'),
(5, 'E103', 2, 1150.00, 4300000.00, 'Under Construction'),
(6, 'F101', 1, 1000.00, 3800000.00, 'Available'),
(6, 'F102', 1, 950.00, 3600000.00, 'Sold'),
(6, 'F103', 2, 1100.00, 4000000.00, 'Under Construction'),
(7, 'G101', 1, 1050.00, 3900000.00, 'Available'),
(7, 'G102', 1, 1000.00, 3700000.00, 'Sold');

INSERT INTO Project_Stages (BuildingID, StageName, StartDate, EndDate, Progress) VALUES
(1, 'Foundation', '2023-01-15', '2023-04-30', 100.00),
(1, 'Superstructure', '2023-05-01', '2023-08-30', 80.00),
(1, 'Roofing', '2023-09-01', '2023-12-31', 60.00),
(2, 'Foundation', '2023-03-10', '2023-06-30', 100.00),
(2, 'Superstructure', '2023-07-01', '2023-11-30', 90.00),
(2, 'Roofing', '2023-12-01', '2024-03-31', 50.00),
(3, 'Foundation', '2022-11-01', '2023-02-28', 100.00),
(3, 'Superstructure', '2023-03-01', '2023-07-30', 70.00),
(3, 'Roofing', '2023-08-01', '2023-11-30', 50.00),
(4, 'Foundation', '2023-02-01', '2023-05-31', 100.00),
(4, 'Superstructure', '2023-06-01', '2023-09-30', 85.00),
(4, 'Roofing', '2023-10-01', '2024-01-15', 40.00),
(5, 'Foundation', '2023-05-20', '2023-09-30', 100.00),
(5, 'Superstructure', '2023-10-01', '2024-01-31', 75.00),
(5, 'Roofing', '2024-02-01', '2024-05-15', 50.00),
(6, 'Foundation', '2023-01-10', '2023-04-30', 100.00),
(6, 'Superstructure', '2023-05-01', '2023-08-31', 90.00),
(6, 'Roofing', '2023-09-01', '2023-12-15', 60.00),
(7, 'Foundation', '2023-06-01', '2023-09-30', 100.00),
(7, 'Superstructure', '2023-10-01', '2024-02-28', 80.00);


INSERT INTO Sector_Heads (FullName, Phone, Sector, Email, BuildingID, MonthlySalary)
VALUES
('Md. Kamal Hossain', '01730101010', 'Masonry', 'kamal@gmail.com', 1, 80000.00),
('Ayesha Begum', '01730202020', 'Plumbing', 'ayesha@gmail.com', 2, 85000.00),
('Shamim Ahmed', '01730303030', 'Electrical', 'shamim@gmail.com', 3, 90000.00),
('Rehena Parvin', '01730404040', 'Painting', 'rehena@gmail.com', 4, 75000.00),
('Rafiqur Rahman', '01730505050', 'Carpentry', 'rafiqur@gmail.com', 5, 80000.00),
('Tahmina Akhter', '01730606060', 'Landscaping', 'tahmina@gmail.com', 6, 82000.00),
('Nazmul Islam', '01730707070', 'Inspection', 'nazmul@gmail.com', 7, 88000.00),
('Rubina Sultana', '01730808080', 'Finishing', 'rubina@gmail.com', 8, 87000.00),
('Tarek Zaman', '01730909090', 'Foundation', 'tarek@gmail.com', 9, 86000.00),
('Mizanur Rahman', '01731010101', 'Framing', 'mizanur@gmail.com', 10, 90000.00),
('Hasina Akhter', '01731111111', 'Masonry', 'hasina@gmail.com', 11, 83000.00),
('Abdullah Al Mamun', '01731212121', 'Plumbing', 'abdullah@gmail.com', 12, 89000.00),
('Sharmin Sultana', '01731313131', 'Electrical', 'sharmin@gmail.com', 13, 92000.00),
('Habibur Rahman', '01731414141', 'Painting', 'habibur@gmail.com', 14, 87000.00),
('Sultana Begum', '01731515151', 'Carpentry', 'sultana@gmail.com', 15, 82000.00),
('Fahim Ahmed', '01731616161', 'Landscaping', 'fahim@gmail.com', 16, 88000.00),
('Mehedi Hasan', '01731717171', 'Inspection', 'mehedi@gmail.com', 17, 86000.00),
('Shaila Akter', '01731818181', 'Finishing', 'shaila@gmail.com', 18, 85000.00),
('Rokon Uddin', '01731919191', 'Foundation', 'rokon@gmail.com', 19, 87000.00),
('Nasima Akter', '01732020202', 'Framing', 'nasima@gmail.com', 20, 89000.00);


INSERT INTO Workers (FullName, Specialization, Phone, Address, HeadID, DailyWage, WorkStatus)
VALUES
('Md. Anwar Hossain', 'Mason', '01840101010', 'Mirpur, Dhaka', 1, 1200.00, 'Active'),
('Rubel Ahmed', 'Plumber', '01840202020', 'Banani, Dhaka', 2, 1000.00, 'Active'),
('Jamil Hossain', 'Electrician', '01840303030', 'GEC, Chittagong', 3, 1300.00, 'On Leave'),
('Sadia Rahman', 'Painter', '01840404040', 'Zindabazar, Sylhet', 4, 1100.00, 'Active'),
('Rahima Akter', 'Carpenter', '01840505050', 'Sonadanga, Khulna', 5, 1000.00, 'On Leave'),
('Shahadat Hossain', 'Mason', '01840606060', 'Boalia, Rajshahi', 6, 1150.00, 'Active'),
('Salma Akter', 'Plumber', '01840707070', 'Launch Terminal, Barishal', 7, 1200.00, 'Active'),
('Rafi Ahmed', 'Electrician', '01840808080', 'Tongi, Gazipur', 8, 1050.00, 'On Leave'),
('Imran Hossain', 'Painter', '01840909090', 'Fatullah, Narayanganj', 9, 1100.00, 'Active'),
('Nahidul Islam', 'Carpenter', '01841010101', 'Sadar, Bogura', 10, 1200.00, 'Active'),
('Sakib Rahman', 'Mason', '01841111111', 'Ganginarpar, Mymensingh', 11, 1300.00, 'Active'),
('Nusrat Jahan', 'Plumber', '01841212121', 'Railroad, Jessore', 12, 1000.00, 'On Leave'),
('Faruk Hossain', 'Electrician', '01841313131', 'Maijdee, Noakhali', 13, 1100.00, 'Active'),
('Shamima Akter', 'Painter', '01841414141', 'Hemayetpur, Pabna', 14, 1200.00, 'Active'),
('Mokhlesur Rahman', 'Carpenter', '01841515151', 'Bhanga, Faridpur', 15, 1150.00, 'Active'),
('Arifa Akhter', 'Mason', '01841616161', 'Modern Mor, Rangpur', 16, 1250.00, 'Active'),
('Saiful Islam', 'Plumber', '01841717171', 'Goneshpur, Dinajpur', 17, 1300.00, 'On Leave'),
('Shakil Hossain', 'Electrician', '01841818181', 'Courtpara, Kushtia', 18, 1400.00, 'Active'),
('Sharmin Islam', 'Painter', '01841919191', 'Amberkhana, Sylhet', 19, 1500.00, 'Active'),
('Habibul Bashar', 'Carpenter', '01842020202', 'Laboni Point, CoxBazar', 20, 1600.00, 'On Leave');

INSERT INTO Worker_Attendance (WorkerID, Date, Shift, Status) VALUES
(1, '2024-01-10', 'Morning', 'Present'),
(2, '2024-01-10', 'Morning', 'Absent'),
(3, '2024-01-10', 'Morning', 'Present'),
(4, '2024-01-10', 'Morning', 'Present'),
(5, '2024-01-10', 'Morning', 'Absent'),
(6, '2024-01-10', 'Morning', 'Present'),
(7, '2024-01-10', 'Morning', 'Present'),
(8, '2024-01-10', 'Morning', 'Absent'),
(9, '2024-01-10', 'Morning', 'Present'),
(10, '2024-01-10', 'Morning', 'Present'),
(11, '2024-01-10', 'Morning', 'Present'),
(12, '2024-01-10', 'Morning', 'Present'),
(13, '2024-01-10', 'Morning', 'Absent'),
(14, '2024-01-10', 'Morning', 'Present'),
(15, '2024-01-10', 'Morning', 'Present'),
(16, '2024-01-10', 'Morning', 'Present'),
(17, '2024-01-10', 'Morning', 'Present'),
(18, '2024-01-10', 'Morning', 'Absent'),
(19, '2024-01-10', 'Morning', 'Present'),
(20, '2024-01-10', 'Morning', 'Present');



INSERT INTO Worker_Payments (WorkerID, AmountPaid, PaymentDate, PaymentMethod)
VALUES
(1, 1500.00, '2024-11-15', 'Cash'),
(2, 1200.00, '2024-11-15', 'Bank Transfer'),
(3, 2000.00, '2024-11-16', 'bKash'),
(4, 1800.00, '2024-11-17', 'Nagad'),
(5, 1700.00, '2024-11-18', 'Cash'),
(6, 2100.00, '2024-11-19', 'Bank Transfer'),
(7, 1600.00, '2024-11-20', 'bKash'),
(8, 1900.00, '2024-11-21', 'Nagad'),
(9, 2500.00, '2024-11-22', 'Cash'),
(10, 2200.00, '2024-11-23', 'Bank Transfer'),
(11, 1400.00, '2024-11-24', 'bKash'),
(12, 2300.00, '2024-11-25', 'Nagad'),
(13, 1600.00, '2024-11-26', 'Cash'),
(14, 1800.00, '2024-11-27', 'Bank Transfer'),
(15, 2100.00, '2024-11-28', 'bKash'),
(16, 1750.00, '2024-11-29', 'Nagad'),
(17, 1900.00, '2024-11-30', 'Cash'),
(18, 2100.00, '2024-12-01', 'Bank Transfer'),
(19, 2000.00, '2024-12-02', 'bKash'),
(20, 2200.00, '2024-12-03', 'Nagad');

INSERT INTO Materials (MaterialName, Category, UnitPrice, StockQuantity, BuildingID) 
VALUES 
('Cement', 'Building Material', 420.00, 1000, 1),
('Sand', 'Construction Material', 1000.00, 20, 1),
('Bricks', 'Building Material', 9.00, 20000, 1),
('Iron Rods', 'Construction Material', 72000.00, 100, 1),
('Paint', 'Finishing Material', 3000.00, 200, 2),
('Pipes', 'Plumbing Material', 250.00, 500, 2),
('Electrical Wires', 'Electrical Material', 50.00, 3000, 2),
('Tiles', 'Finishing Material', 45.00, 1000, 3),
('Glass Sheets', 'Building Material', 500.00, 150, 3),
('Wood', 'Construction Material', 25000.00, 50, 4),
('Cement', 'Building Material', 410.00, 1500, 5),
('Sand', 'Construction Material', 950.00, 25, 5),
('Bricks', 'Building Material', 8.50, 15000, 6),
('Iron Rods', 'Construction Material', 71500.00, 80, 6),
('Paint', 'Finishing Material', 2800.00, 250, 7),
('Pipes', 'Plumbing Material', 240.00, 600, 7),
('Electrical Wires', 'Electrical Material', 55.00, 4000, 8),
('Tiles', 'Finishing Material', 47.00, 1200, 8),
('Glass Sheets', 'Building Material', 490.00, 200, 9),
('Wood', 'Construction Material', 26000.00, 70, 10);



INSERT INTO Material_Usage_Log (MaterialID, BuildingID, WorkerID, DateUsed, QuantityUsed, UsagePurpose) 
VALUES 
(1, 1, 1, '2024-11-15', 50, 'Brick laying'),
(2, 2, 2, '2024-11-16', 30, 'Cement mixing'),
(3, 3, 3, '2024-11-17', 20, 'Plastering'),
(4, 4, 4, '2024-11-18', 10, 'Tile fixing'),
(5, 5, 5, '2024-11-19', 15, 'Wooden framework'),
(6, 6, 6, '2024-11-20', 100, 'Brick laying'),
(7, 7, 7, '2024-11-21', 25, 'Cement mixing'),
(8, 8, 8, '2024-11-22', 12, 'Plastering'),
(9, 9, 9, '2024-11-23', 40, 'Tile fixing'),
(10, 10, 10, '2024-11-24', 60, 'Wooden framework'),
(11, 1, 11, '2024-11-25', 50, 'Brick laying'),
(12, 2, 12, '2024-11-26', 20, 'Cement mixing'),
(13, 3, 13, '2024-11-27', 30, 'Plastering'),
(14, 4, 14, '2024-11-28', 18, 'Tile fixing'),
(15, 5, 15, '2024-11-29', 25, 'Wooden framework'),
(16, 6, 16, '2024-11-30', 75, 'Brick laying'),
(17, 7, 17, '2024-12-01', 35, 'Cement mixing'),
(18, 8, 18, '2024-12-02', 10, 'Plastering'),
(19, 9, 19, '2024-12-03', 45, 'Tile fixing'),
(20, 10, 20, '2024-12-04', 55, 'Wooden framework');


INSERT INTO Suppliers (Name, ContactNumber, Address, Email) 
VALUES 
('Md. Alamgir Hossain', '01920101010', 'Tejgaon, Dhaka', 'alamgir@abc.com'),
('Rezaul Karim', '01920202020', 'Hathazari, Chittagong', 'rezaul@buildermart.com'),
('Sohag Ahmed', '01920303030', 'Shylet, Sylhet', 'sohag@bricks.com'),
('Faridul Islam', '01920404040', 'Khalishpur, Khulna', 'faridul@irondeals.com'),
('Nazma Begum', '01920505050', 'Uttara, Dhaka', 'nazma@paintplus.com'),
('Salman Ahmed', '01920606060', 'Barisal Sadar, Barisal', 'salman@pipingpro.com'),
('Hasanuzzaman', '01920707070', 'Tongi, Gazipur', 'hasan@electrics.com'),
('Tanjina Sultana', '01920808080', 'Narayanganj Sadar, Narayanganj', 'tanjina@tiles.com'),
('Arifur Rahman', '01920909090', 'Badda, Dhaka', 'arifur@glassking.com'),
('Jannatul Ferdous', '01921010101', 'Kushtia Sadar, Kushtia', 'jannatul@woodworks.com'),
('Rubel Hossain', '01921111111', 'Feni Sadar, Feni', 'rubel@steelsolutions.com'),
('Asma Khatun', '01921212121', 'Comilla Sadar, Comilla', 'asma@modernbuilders.com'),
('Shamim Alam', '01921313131', 'Kanchpur, Narayanganj', 'shamim@paintworld.com'),
('Tahmina Rahman', '01921414141', 'Savar, Dhaka', 'tahmina@tileexperts.com'),
('Rafiqul Islam', '01921515151', 'Ashulia, Dhaka', 'rafiqul@concreteltd.com'),
('Nazia Ahmed', '01921616161', 'Patiya, Chittagong', 'nazia@electricalhouse.com'),
('Fahim Hassan', '01921717171', 'Chandgaon, Chittagong', 'fahim@roofingstars.com'),
('Samiul Islam', '01921818181', 'Brahmanbaria Sadar, Brahmanbaria', 'samiul@glassmakers.com'),
('Mahiya Chowdhury', '01921919191', 'Sylhet Sadar, Sylhet', 'mahiya@plumbingmasters.com'),
('Arif Ahmed', '01922020202', 'Rangpur Sadar, Rangpur', 'arif@foundationexperts.com');



INSERT INTO Material_Orders (SupplierID, MaterialID, OrderDate, QuantityOrdered, TotalCost)
VALUES
(1, 1, '2024-11-15', 500, 15000.00),
(2, 2, '2024-11-16', 300, 12000.00),
(3, 3, '2024-11-17', 200, 8000.00),
(4, 4, '2024-11-18', 100, 5000.00),
(5, 5, '2024-11-19', 150, 7500.00),
(6, 6, '2024-11-20', 1000, 30000.00),
(7, 7, '2024-11-21', 250, 10000.00),
(8, 8, '2024-11-22', 300, 12000.00),
(9, 9, '2024-11-23', 400, 16000.00),
(10, 10, '2024-11-24', 600, 24000.00),
(11, 11, '2024-11-25', 500, 12500.00),
(12, 12, '2024-11-26', 350, 14000.00),
(13, 13, '2024-11-27', 200, 10000.00),
(14, 14, '2024-11-28', 150, 7500.00),
(15, 15, '2024-11-29', 250, 12500.00),
(16, 16, '2024-11-30', 450, 13500.00),
(17, 17, '2024-12-01', 300, 12000.00),
(18, 18, '2024-12-02', 200, 8000.00),
(19, 19, '2024-12-03', 350, 14000.00),
(20, 20, '2024-12-04', 400, 16000.00);


INSERT INTO Equipment (EquipmentName, Category, EquipmentCondition, AvailabilityStatus) 
VALUES 
('Excavator', 'Heavy Machinery', 'New', 'Available'),
('Concrete Mixer', 'Construction Equipment', 'Used', 'In Use'),
('Bulldozer', 'Heavy Machinery', 'New', 'Under Maintenance'),
('Tower Crane', 'Crane', 'Used', 'Available'),
('Forklift', 'Material Handling', 'New', 'In Use'),
('Cement Mixer', 'Construction Equipment', 'Used', 'Available'),
('Backhoe Loader', 'Heavy Machinery', 'New', 'Under Maintenance'),
('Compactor', 'Construction Equipment', 'New', 'Available'),
('Pile Driver', 'Construction Equipment', 'Used', 'In Use'),
('Scaffolding', 'Building Materials', 'New', 'Under Maintenance'),
('Generator', 'Electrical Equipment', 'Used', 'Available'),
('Air Compressor', 'Construction Equipment', 'New', 'In Use'),
('Concrete Pump', 'Construction Equipment', 'Used', 'Available'),
('Forklift Truck', 'Material Handling', 'New', 'Under Maintenance'),
('Welding Machine', 'Electrical Equipment', 'Used', 'Available'),
('Drilling Rig', 'Heavy Machinery', 'New', 'In Use'),
('Concrete Vibrator', 'Construction Equipment', 'Used', 'Available'),
('Concrete Cutter', 'Construction Equipment', 'New', 'In Use'),
('Portable Crane', 'Crane', 'Used', 'Under Maintenance'),
('Portable Crane', 'Crane', 'Used', 'Under Maintenance');



INSERT INTO Equipment_Usage_Log (EquipmentID, WorkerID, StartDate, EndDate, Purpose)
VALUES
(1, 1, '2024-11-15', '2024-11-16', 'Excavation for foundation'),
(2, 2, '2024-11-16', '2024-11-17', 'Mixing concrete for walls'),
(3, 3, '2024-11-17', '2024-11-18', 'Excavation for drainage'),
(4, 4, '2024-11-18', '2024-11-19', 'Lifting materials for construction'),
(5, 5, '2024-11-19', '2024-11-20', 'Transporting materials'),
(6, 6, '2024-11-20', '2024-11-21', 'Mixing concrete for slabs'),
(7, 7, '2024-11-21', '2024-11-22', 'Excavation for trenching'),
(8, 8, '2024-11-22', '2024-11-23', 'Compacting ground for foundation'),
(9, 9, '2024-11-23', '2024-11-24', 'Driving piles for foundation'),
(10, 10, '2024-11-24', '2024-11-25', 'Installing scaffolding'),
(11, 11, '2024-11-25', '2024-11-26', 'Power backup for site activities'),
(12, 12, '2024-11-26', '2024-11-27', 'Air compression for tool operation'),
(13, 13, '2024-11-27', '2024-11-28', 'Pumping concrete for foundation'),
(14, 14, '2024-11-28', '2024-11-29', 'Welding metal frames for structure'),
(15, 15, '2024-11-29', '2024-11-30', 'Drilling holes for foundations'),
(16, 16, '2024-11-30', '2024-12-01', 'Vibrating concrete for slabs'),
(17, 17, '2024-12-01', '2024-12-02', 'Cutting concrete for road work'),
(18, 18, '2024-12-02', '2024-12-03', 'Lifting and moving heavy materials'),
(19, 19, '2024-12-03', '2024-12-04', 'Hoisting materials to elevated floors'),
(20, 20, '2024-12-04', '2024-12-05', 'Transporting construction equipment');

INSERT INTO Owner_Payments (OwnerID, Amount, PaymentDate, PaymentMethod) 
VALUES 
(1, 50000.00, '2024-11-15', 'Cash'),
(2, 60000.00, '2024-11-16', 'Bank Transfer'),
(3, 45000.00, '2024-11-17', 'bKash'),
(4, 70000.00, '2024-11-18', 'Nagad'),
(5, 55000.00, '2024-11-19', 'Cash'),
(6, 80000.00, '2024-11-20', 'Bank Transfer'),
(7, 65000.00, '2024-11-21', 'bKash'),
(8, 75000.00, '2024-11-22', 'Nagad'),
(9, 50000.00, '2024-11-23', 'Cash'),
(10, 60000.00, '2024-11-24', 'Bank Transfer'),
(11, 45000.00, '2024-11-25', 'bKash'),
(12, 70000.00, '2024-11-26', 'Nagad'),
(13, 55000.00, '2024-11-27', 'Cash'),
(14, 80000.00, '2024-11-28', 'Bank Transfer'),
(15, 65000.00, '2024-11-29', 'bKash'),
(16, 75000.00, '2024-11-30', 'Nagad'),
(17, 50000.00, '2024-12-01', 'Cash'),
(18, 60000.00, '2024-12-02', 'Bank Transfer'),
(19, 45000.00, '2024-12-03', 'bKash'),
(20, 70000.00, '2024-12-04', 'Nagad');



INSERT INTO Invoices (OwnerID, Amount, InvoiceDate, DueDate, Status)
VALUES
(1, 50000.00, '2024-11-15', '2024-12-15', 'Paid'),
(2, 60000.00, '2024-11-16', '2024-12-16', 'Unpaid'),
(3, 45000.00, '2024-11-17', '2024-12-17', 'Paid'),
(4, 70000.00, '2024-11-18', '2024-12-18', 'Unpaid'),
(5, 55000.00, '2024-11-19', '2024-12-19', 'Paid'),
(6, 80000.00, '2024-11-20', '2024-12-20', 'Unpaid'),
(7, 65000.00, '2024-11-21', '2024-12-21', 'Paid'),
(8, 75000.00, '2024-11-22', '2024-12-22', 'Unpaid'),
(9, 50000.00, '2024-11-23', '2024-12-23', 'Paid'),
(10, 60000.00, '2024-11-24', '2024-12-24', 'Unpaid'),
(11, 45000.00, '2024-11-25', '2024-12-25', 'Paid'),
(12, 70000.00, '2024-11-26', '2024-12-26', 'Unpaid'),
(13, 55000.00, '2024-11-27', '2024-12-27', 'Paid'),
(14, 80000.00, '2024-11-28', '2024-12-28', 'Unpaid'),
(15, 65000.00, '2024-11-29', '2024-12-29', 'Paid'),
(16, 75000.00, '2024-11-30', '2024-12-30', 'Unpaid'),
(17, 50000.00, '2024-12-01', '2024-12-31', 'Paid'),
(18, 60000.00, '2024-12-02', '2025-01-02', 'Unpaid'),
(19, 45000.00, '2024-12-03', '2025-01-03', 'Paid'),
(20, 70000.00, '2024-12-04', '2025-01-04', 'Unpaid');


INSERT INTO Contracts (BuildingID, ContractorName, StartDate, EndDate, TotalAmount, Status, Terms)
VALUES
(1, 'ABC Constructions', '2024-01-01', '2024-12-31', 5000000.00, 'Active', 'All materials supplied by contractor'),
(2, 'XYZ Builders', '2023-06-01', '2024-05-31', 4500000.00, 'Active', 'Contractor to manage workforce and schedule'),
(3, 'Elite Engineering', '2023-03-01', '2024-02-28', 6000000.00, 'Completed', 'Full site management and construction'),
(4, 'BuildSmart Co.', '2022-01-01', '2022-12-31', 4000000.00, 'Completed', 'Material quality must meet safety standards'),
(5, 'Rapid Construct', '2024-07-01', '2025-06-30', 7500000.00, 'Active', 'Contract includes landscaping services'),
(6, 'ProBuild Ltd.', '2023-05-01', '2024-04-30', 5500000.00, 'Terminated', 'Work halted due to financial issues'),
(7, 'Urban Developers', '2023-11-01', '2024-10-31', 6500000.00, 'Active', 'Monthly progress reports required'),
(8, 'NextGen Builders', '2024-02-01', '2025-01-31', 7000000.00, 'Pending', 'Pending approval from regulatory bodies'),
(9, 'FutureBuild Inc.', '2024-03-01', '2025-02-28', 4800000.00, 'Pending', 'Design adjustments under review'),
(10, 'Skyline Projects', '2024-04-01', '2025-03-31', 5200000.00, 'Active', 'Install eco-friendly systems'),
(11, 'Vision Construct', '2024-05-01', '2025-04-30', 8000000.00, 'Pending', 'Energy-efficient construction required'),
(12, 'GreenBuild LLC', '2024-06-01', '2025-05-31', 4300000.00, 'Completed', 'Use of recycled materials encouraged'),
(13, 'Delta Constructions', '2024-07-01', '2025-06-30', 7200000.00, 'Pending', 'Additional floors under negotiation'),
(14, 'Vertex Developers', '2024-08-01', '2025-07-31', 5600000.00, 'Active', 'Strict adherence to deadlines'),
(15, 'Prime Builders', '2024-09-01', '2025-08-31', 6300000.00, 'Completed', 'Includes post-construction maintenance'),
(16, 'Foundation Co.', '2024-10-01', '2025-09-30', 4500000.00, 'Pending', 'Waiting for government approval'),
(17, 'SkyHigh Contractors', '2024-11-01', '2025-10-31', 7000000.00, 'Active', 'Focus on high-rise construction techniques'),
(18, 'Innovative Builds', '2024-12-01', '2025-11-30', 6700000.00, 'Pending', 'Awaiting client agreement on terms'),
(19, 'Pinnacle Construction', '2025-01-01', '2025-12-31', 5000000.00, 'Active', 'Includes underground parking facilities'),
(20, 'Summit Builders', '2025-02-01', '2026-01-31', 6100000.00, 'Pending', 'Additional structural audits requested');



INSERT INTO Safety_Incidents (WorkerID, IncidentDate, IncidentType, ResolutionStatus)
VALUES
(1, '2024-11-15', 'Slipped on wet surface', 'Resolved'),
(2, '2024-11-16', 'Cut from sharp object', 'Unresolved'),
(3, '2024-11-17', 'Fell from height', 'Resolved'),
(4, '2024-11-18', 'Inhaled dust', 'Unresolved'),
(5, '2024-11-19', 'Burned by equipment', 'Resolved'),
(6, '2024-11-20', 'Tripped over equipment', 'Resolved'),
(7, '2024-11-21', 'Head injury from falling object', 'Unresolved'),
(8, '2024-11-22', 'Sprained ankle', 'Resolved'),
(9, '2024-11-23', 'Electric shock', 'Unresolved'),
(10, '2024-11-24', 'Exposure to toxic chemicals', 'Resolved'),
(11, '2024-11-25', 'Pushed by heavy load', 'Unresolved'),
(12, '2024-11-26', 'Broken limb', 'Resolved'),
(13, '2024-11-27', 'Crushed by machinery', 'Unresolved'),
(14, '2024-11-28', 'Eye injury from debris', 'Resolved'),
(15, '2024-11-29', 'Burned by welding equipment', 'Unresolved'),
(16, '2024-11-30', 'Falling object injury', 'Resolved'),
(17, '2024-12-01', 'Foot injury from heavy tool', 'Unresolved'),
(18, '2024-12-02', 'Exposure to heat', 'Resolved'),
(19, '2024-12-03', 'Broken finger', 'Unresolved'),
(20, '2024-12-04', 'Accidental fall', 'Resolved');


INSERT INTO Daily_Work_Log (BuildingID, Date, WorkCompleted, IssuesReported)
VALUES
(1, '2024-11-15', 'Completed foundation excavation and soil leveling', 'Minor equipment malfunction'),
(2, '2024-11-16', 'Poured concrete for the first floor slab', 'Delay in cement delivery'),
(3, '2024-11-17', 'Installed scaffolding for building elevation', 'Worker injury, minor'),
(4, '2024-11-18', 'Completed bricklaying for the outer walls', 'Rain delays construction'),
(5, '2024-11-19', 'Plumbing installation for the ground floor', 'Pipe leak detected'),
(6, '2024-11-20', 'Electrical wiring installation in the second floor', 'Power outage'),
(7, '2024-11-21', 'Completed drywall installation in interior rooms', 'Material shortage'),
(8, '2024-11-22', 'Finished roof frame installation', 'High winds causing delays'),
(9, '2024-11-23', 'Roof tiling completed', 'Unavailability of roofing tiles'),
(10, '2024-11-24', 'Electrical work for the lighting system', 'Faulty wiring'),
(11, '2024-11-25', 'Completed installation of windows and doors', 'Missing window frames'),
(12, '2024-11-26', 'Interior wall painting completed', 'Paint drying issues due to humidity'),
(13, '2024-11-27', 'Started exterior wall painting', 'Paint delivery delay'),
(14, '2024-11-28', 'Poured concrete for the basement floor', 'Mixing machine breakdown'),
(15, '2024-11-29', 'Reinforced foundation pillars', 'Material handling errors'),
(16, '2024-11-30', 'Finished flooring in the living room', 'Floor tiles broken during installation'),
(17, '2024-12-01', 'Installed kitchen fixtures', 'Late delivery of appliances'),
(18, '2024-12-02', 'Planted exterior landscaping', 'Unfavorable weather conditions'),
(19, '2024-12-03', 'Completed plumbing connections for bathrooms', 'Pipe installation took longer than expected'),
(20, '2024-12-04', 'Final inspection of the completed building', 'Minor finishing work pending');


INSERT INTO Building_Inspection_Reports (BuildingID, InspectorName, InspectionDate, Findings, Remarks, Status)
VALUES
(1, 'Ahmed Hossain', '2024-11-15', 'Foundation settled properly, no cracks observed.', 'Minor cleanup required on site.', 'Passed'),
(2, 'Fatima Begum', '2024-11-16', 'Structural integrity of outer walls is compromised due to poor brickwork.', 'Recommend redoing the brickwork on the west side.', 'Failed'),
(3, 'Rashidul Islam', '2024-11-17', 'Roofing system stable, insulation properly installed.', 'Waterproofing required for certain areas.', 'Passed'),
(4, 'Samiul Alam', '2024-11-18', 'No major issues detected in plumbing or electrical systems.', 'Some cosmetic improvements needed in the interior.', 'Passed'),
(5, 'Nusrat Jahan', '2024-11-19', 'Exterior walls are cracked in multiple spots.', 'Immediate repair is needed for the cracks.', 'Failed'),
(6, 'Mizanur Rahman', '2024-11-20', 'Structural beams are well secured.', 'A few doors need to be replaced for proper fitting.', 'Passed'),
(7, 'Sharmin Akter', '2024-11-21', 'Electrical wiring conforms to safety standards.', 'Some areas need additional lighting installation.', 'Passed'),
(8, 'Abdur Rahim', '2024-11-22', 'Plumbing systems function well, no leaks.', 'Exterior cleaning and paint touch-up required.', 'Passed'),
(9, 'Ayesha Khan', '2024-11-23', 'No fire safety measures in place, emergency exits blocked.', 'Urgent need for fire exits and safety equipment installation.', 'Failed'),
(10, 'Jamil Ahmed', '2024-11-24', 'Concrete floor leveling is uneven.', 'Floor leveling needs to be addressed before final handover.', 'Failed'),
(11, 'Kazi Anwar', '2024-11-25', 'Windows are properly installed, no air gaps.', 'Minor scratches on window frames.', 'Passed'),
(12, 'Hassan Mahmud', '2024-11-26', 'Building structure is stable, no shifting noticed.', 'Exterior walls need repainting.', 'Passed'),
(13, 'Rifat Chowdhury', '2024-11-27', 'Roof waterproofing layer is leaking.', 'Recommend replacing the waterproofing material.', 'Failed'),
(14, 'Shilpi Sultana', '2024-11-28', 'Insulation system for HVAC is properly installed.', 'A few ducts are not properly secured.', 'Passed'),
(15, 'Khalid Noor', '2024-11-29', 'Plumbing connections are working fine.', 'Drainage system needs some adjustments.', 'Passed'),
(16, 'Fariha Islam', '2024-11-30', 'Walls and floors are well-finished.', 'Minor cracks found near stairways.', 'Passed'),
(17, 'Tariq Mahmood', '2024-12-01', 'No water leakage detected in basement.', 'Ventilation system not fully functional.', 'Passed'),
(18, 'Rina Sultana', '2024-12-02', 'Windows and doors are properly sealed.', 'Final inspection of balconies needed.', 'Passed'),
(19, 'Zahidul Karim', '2024-12-03', 'Structural support beams and columns are secure.', 'Some electrical wiring needs rearrangement.', 'Passed'),
(20, 'Shamim Ahmed', '2024-12-04', 'Building passed all safety and structural checks.', 'Some interior details need adjustments.', 'Passed');




-- Core Project Management Tables
SELECT * FROM Owners;
SELECT * FROM Buildings;
SELECT * FROM Apartments;
SELECT * FROM Project_Stages;

-- Workforce Management Tables
SELECT * FROM Sector_Heads;
SELECT * FROM Workers;
SELECT * FROM Worker_Attendance;
SELECT * FROM Worker_Payments;

-- Materials and Resources Tables
SELECT * FROM Materials;
SELECT * FROM Material_Usage_Log;
SELECT * FROM Suppliers;
SELECT * FROM Material_Orders;
SELECT * FROM Equipment;
SELECT * FROM Equipment_Usage_Log;

-- Financial and Legal Tables
SELECT * FROM Owner_Payments;
SELECT * FROM Invoices;
SELECT * FROM Contracts;

-- Safety and Monitoring Tables
SELECT * FROM Safety_Incidents;
SELECT * FROM Daily_Work_Log;
SELECT * FROM Building_Inspection_Reports;



DELIMITER $$

CREATE PROCEDURE GetDailyTransactions(IN TransactionDate DATE)
BEGIN
    -- Temporary table to store results
    CREATE TEMPORARY TABLE DailyTransactions (
        TransactionType VARCHAR(50),
        Amount DECIMAL(15, 2),
        PaymentMethod VARCHAR(50),
        RelatedPerson VARCHAR(100),
        Sector VARCHAR(100)
    );

    -- Insert data for worker payments
    INSERT INTO DailyTransactions (TransactionType, Amount, PaymentMethod, RelatedPerson, Sector)
    SELECT 
        'Worker Payment',
        wp.AmountPaid,
        wp.PaymentMethod,
        w.FullName,
        sh.Sector
    FROM 
        Worker_Payments wp
    INNER JOIN 
        Workers w ON wp.WorkerID = w.WorkerID
    INNER JOIN 
        Sector_Heads sh ON w.HeadID = sh.HeadID
    WHERE 
        wp.PaymentDate = TransactionDate;

    -- Insert data for owner payments
    INSERT INTO DailyTransactions (TransactionType, Amount, PaymentMethod, RelatedPerson, Sector)
    SELECT 
        'Owner Payment',
        op.Amount,
        op.PaymentMethod,
        o.FullName,
        'N/A'
    FROM 
        Owner_Payments op
    INNER JOIN 
        Owners o ON op.OwnerID = o.OwnerID
    WHERE 
        op.PaymentDate = TransactionDate;

    -- Insert data for material orders
    INSERT INTO DailyTransactions (TransactionType, Amount, PaymentMethod, RelatedPerson, Sector)
    SELECT 
        'Material Order',
        mo.TotalCost,
        'N/A',
        s.Name,
        'Materials'
    FROM 
        Material_Orders mo
    INNER JOIN 
        Suppliers s ON mo.SupplierID = s.SupplierID
    WHERE 
        mo.OrderDate = TransactionDate;

    -- Retrieve and display the daily transactions
    SELECT * FROM DailyTransactions;

    -- Drop the temporary table
    DROP TEMPORARY TABLE DailyTransactions;
END$$

DELIMITER ;

CALL GetDailyTransactions('2024-11-15');


CREATE TABLE TransactionRecycleBin (
    RecycleID INT AUTO_INCREMENT PRIMARY KEY,
    OriginalTable VARCHAR(50),
    DeletedRecord JSON,
    DeletedDate DATETIME DEFAULT CURRENT_TIMESTAMP
);


DELIMITER $$
CREATE TRIGGER AfterOwnerPaymentDelete
AFTER DELETE ON Owner_Payments
FOR EACH ROW
BEGIN
    INSERT INTO TransactionRecycleBin (OriginalTable, DeletedRecord)
    VALUES ('Owner_Payments', JSON_OBJECT(
        'PaymentID', OLD.PaymentID,
        'OwnerID', OLD.OwnerID,
        'Amount', OLD.Amount,
        'PaymentDate', OLD.PaymentDate,
        'PaymentMethod', OLD.PaymentMethod
    ));
END$$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER AfterWorkerPaymentDelete
AFTER DELETE ON Worker_Payments
FOR EACH ROW
BEGIN
    INSERT INTO TransactionRecycleBin (OriginalTable, DeletedRecord)
    VALUES ('Worker_Payments', JSON_OBJECT(
        'PaymentID', OLD.PaymentID,
        'WorkerID', OLD.WorkerID,
        'AmountPaid', OLD.AmountPaid,
        'PaymentDate', OLD.PaymentDate,
        'PaymentMethod', OLD.PaymentMethod
    ));
END$$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER AfterSectorHeadDelete
AFTER DELETE ON Sector_Heads
FOR EACH ROW
BEGIN
    INSERT INTO TransactionRecycleBin (OriginalTable, DeletedRecord)
    VALUES ('Sector_Heads', JSON_OBJECT(
        'HeadID', OLD.HeadID,
        'FullName', OLD.FullName,
        'Phone', OLD.Phone,
        'Sector', OLD.Sector,
        'Email', OLD.Email,
        'BuildingID', OLD.BuildingID,
        'MonthlySalary', OLD.MonthlySalary
    ));
END$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE RestoreDeletedRecord(IN RecycleSerial INT)
BEGIN
    DECLARE tableName VARCHAR(50);
    DECLARE recordData JSON;
    
    -- Fetch the parent table name and deleted record
    SELECT OriginalTable, DeletedRecord INTO tableName, recordData
    FROM TransactionRecycleBin
    WHERE RecycleID = RecycleSerial;

    -- Conditional re-insertion based on the original table
    IF tableName = 'Owner_Payments' THEN
        INSERT INTO Owner_Payments (PaymentID, OwnerID, Amount, PaymentDate, PaymentMethod)
        VALUES (
            JSON_UNQUOTE(JSON_EXTRACT(recordData, '$.PaymentID')),
            JSON_UNQUOTE(JSON_EXTRACT(recordData, '$.OwnerID')),
            JSON_UNQUOTE(JSON_EXTRACT(recordData, '$.Amount')),
            JSON_UNQUOTE(JSON_EXTRACT(recordData, '$.PaymentDate')),
            JSON_UNQUOTE(JSON_EXTRACT(recordData, '$.PaymentMethod'))
        );
    ELSEIF tableName = 'Worker_Payments' THEN
        INSERT INTO Worker_Payments (PaymentID, WorkerID, AmountPaid, PaymentDate, PaymentMethod)
        VALUES (
            JSON_UNQUOTE(JSON_EXTRACT(recordData, '$.PaymentID')),
            JSON_UNQUOTE(JSON_EXTRACT(recordData, '$.WorkerID')),
            JSON_UNQUOTE(JSON_EXTRACT(recordData, '$.AmountPaid')),
            JSON_UNQUOTE(JSON_EXTRACT(recordData, '$.PaymentDate')),
            JSON_UNQUOTE(JSON_EXTRACT(recordData, '$.PaymentMethod'))
        );
    ELSEIF tableName = 'Sector_Heads' THEN
        INSERT INTO Sector_Heads (HeadID, FullName, Phone, Sector, Email, BuildingID, MonthlySalary)
        VALUES (
            JSON_UNQUOTE(JSON_EXTRACT(recordData, '$.HeadID')),
            JSON_UNQUOTE(JSON_EXTRACT(recordData, '$.FullName')),
            JSON_UNQUOTE(JSON_EXTRACT(recordData, '$.Phone')),
            JSON_UNQUOTE(JSON_EXTRACT(recordData, '$.Sector')),
            JSON_UNQUOTE(JSON_EXTRACT(recordData, '$.Email')),
            JSON_UNQUOTE(JSON_EXTRACT(recordData, '$.BuildingID')),
            JSON_UNQUOTE(JSON_EXTRACT(recordData, '$.MonthlySalary'))
        );
    END IF;
END$$
DELIMITER ;

/*
DELETE FROM Owner_Payments WHERE PaymentID = 1;
CALL RestoreDeletedRecord(1);
*/


-- Core Project Management Queries

-- 1. List the names of all workers along with their sector and current work status
SELECT w.FullName AS WorkerName, 
       s.Sector AS WorkerSector, 
       w.WorkStatus AS CurrentStatus
FROM Workers w
JOIN Sector_Heads s ON w.HeadID = s.HeadID;


-- 2. Find the total number of apartments in each building
SELECT BuildingID, COUNT(ApartmentID) AS TotalApartments FROM Apartments GROUP BY BuildingID;

-- 3. Get details of all available apartments
SELECT * FROM Apartments WHERE Status = 'Available';

-- 4. List buildings that are expected to be completed after 2025
SELECT * FROM Buildings WHERE ExpectedCompletionDate > '2025-12-31';

-- 5. Show the total investment by each owner
SELECT FullName, TotalInvestment FROM Owners;

-- Workforce Management Queries
-- 6. List all active workers
SELECT * FROM Workers WHERE WorkStatus = 'Active';

-- 7. Count the number of workers under each sector head
SELECT HeadID, COUNT(WorkerID) AS TotalWorkers FROM Workers GROUP BY HeadID;

-- 8. Show attendance records for the last 30 days
SELECT * FROM Worker_Attendance WHERE Date >= CURDATE() - INTERVAL 30 DAY;

-- 9. List workers who were absent more than 5 times
SELECT WorkerID, COUNT(*) AS Absences FROM Worker_Attendance WHERE Status = 'Absent' GROUP BY WorkerID HAVING Absences > 5;

-- 10. Find the total payment made to each worker
SELECT WorkerID, SUM(AmountPaid) AS TotalPaid FROM Worker_Payments GROUP BY WorkerID;

-- Materials and Resources Queries
-- 11. List materials with stock quantity below 50
SELECT * FROM Materials WHERE StockQuantity < 50;

-- 12. Find the most used material
SELECT MaterialID, SUM(QuantityUsed) AS TotalUsed FROM Material_Usage_Log GROUP BY MaterialID ORDER BY TotalUsed DESC LIMIT 1;

-- 13. Show all orders made to suppliers in 2024
SELECT * FROM Material_Orders WHERE OrderDate BETWEEN '2024-01-01' AND '2024-12-31';

-- 14. List equipment currently under maintenance
SELECT * FROM Equipment WHERE AvailabilityStatus = 'Under Maintenance';

-- 15. Find equipment used by workers for a specific purpose
SELECT EquipmentID, WorkerID, Purpose FROM Equipment_Usage_Log WHERE Purpose LIKE '%welding%';

-- Financial and Legal Queries
-- 16. List all payments made by owners using bKash
SELECT * FROM Owner_Payments WHERE PaymentMethod = 'bKash';

-- 17. Find unpaid invoices for each owner
SELECT * FROM Invoices WHERE Status = 'Unpaid';

-- 18. Show contracts that are still pending
SELECT * FROM Contracts WHERE Status = 'Pending';

-- 19. Calculate the total amount paid by each owner
SELECT OwnerID, SUM(Amount) AS TotalPaid FROM Owner_Payments GROUP BY OwnerID;

-- 20. Find contracts that started in 2023
SELECT * FROM Contracts WHERE StartDate BETWEEN '2023-01-01' AND '2023-12-31';

-- Safety and Monitoring Queries
-- 21. List all safety incidents resolved this year
SELECT * FROM Safety_Incidents WHERE ResolutionStatus = 'Resolved' AND YEAR(IncidentDate) = YEAR(CURDATE());

-- 22. Find unresolved incidents for a specific worker
SELECT * FROM Safety_Incidents WHERE WorkerID = 1 AND ResolutionStatus = 'Unresolved';

-- 23. Show daily work logs for a specific building
SELECT * FROM Daily_Work_Log WHERE BuildingID = 1;

-- 24. Count the number of inspections that failed
SELECT COUNT(*) AS FailedInspections FROM Building_Inspection_Reports WHERE Status = 'Failed';

-- 25. List all work completed in the last week
SELECT * FROM Daily_Work_Log WHERE Date >= CURDATE() - INTERVAL 7 DAY;

-- Advanced and Multi-Table Queries
-- 26.  List all buildings that have contracts (without OwnerID) 
SELECT * 
FROM Buildings 
WHERE BuildingID IN (SELECT BuildingID FROM Contracts) 
LIMIT 0, 1000;

-- 27. Show the total cost of materials used in each building
SELECT BuildingID, SUM(QuantityUsed * (SELECT UnitPrice FROM Materials WHERE MaterialID = Material_Usage_Log.MaterialID)) AS TotalCost 
FROM Material_Usage_Log GROUP BY BuildingID;

-- 28. List workers involved in unresolved incidents
SELECT DISTINCT WorkerID FROM Safety_Incidents WHERE ResolutionStatus = 'Unresolved';

-- 29. Find the average price of apartments in each building
SELECT BuildingID, AVG(Price) AS AveragePrice FROM Apartments GROUP BY BuildingID;

-- 30. Show total payments made for each building
SELECT BuildingID, SUM(AmountPaid) AS TotalPayments 
FROM Worker_Payments 
WHERE WorkerID IN (SELECT WorkerID FROM Workers WHERE HeadID IN (SELECT HeadID FROM Sector_Heads WHERE BuildingID IS NOT NULL)) 
GROUP BY BuildingID;

-- Miscellaneous Queries
-- 31. Total payments by building
SELECT sh.BuildingID, SUM(wp.AmountPaid) 
FROM Worker_Payments wp 
JOIN Workers w ON wp.WorkerID = w.WorkerID
JOIN Sector_Heads sh ON w.HeadID = sh.HeadID
GROUP BY sh.BuildingID;



-- 32. List all workers specializing in masonry
SELECT * FROM Workers WHERE Specialization = 'Masonry';

-- 33. Find buildings with more than 5 floors
SELECT * FROM Buildings WHERE NumberOfFloors > 5;

-- 34. Count available apartments on each floor of a specific building
SELECT FloorNumber, COUNT(*) AS AvailableApartments 
FROM Apartments 
WHERE BuildingID = 1 AND Status = 'Available' GROUP BY FloorNumber;

-- 35. Show all contracts completed this year
SELECT * FROM Contracts WHERE Status = 'Completed' AND YEAR(EndDate) = YEAR(CURDATE());

-- 36. Find total income from sold apartments
SELECT SUM(Price) AS TotalIncome FROM Apartments WHERE Status = 'Sold';

-- 37. List workers on leave today
SELECT * FROM Workers WHERE WorkStatus = 'On Leave';

-- 38. Show all suppliers located in Dhaka
SELECT * FROM Suppliers WHERE Address LIKE '%Dhaka%';

-- 39. Count incidents for each worker
SELECT WorkerID, COUNT(*) AS TotalIncidents FROM Safety_Incidents GROUP BY WorkerID;

-- 40. Show total wages paid to workers
SELECT SUM(DailyWage * (SELECT COUNT(*) FROM Worker_Attendance WHERE Worker_Attendance.WorkerID = Workers.WorkerID AND Status = 'Present')) AS TotalWages
FROM Workers;

-- Additional Queries (41-50)
-- 41. Show average size of apartments per building
SELECT BuildingID, AVG(Size) AS AverageSize FROM Apartments GROUP BY BuildingID;

-- 42. Find the most frequent shift type for workers
SELECT Shift, COUNT(*) AS Frequency FROM Worker_Attendance GROUP BY Shift ORDER BY Frequency DESC LIMIT 1;

-- 43. List all materials used in a specific building
SELECT * FROM Materials WHERE BuildingID = 1;

-- 44. Find workers with unresolved safety incidents
SELECT WorkerID FROM Safety_Incidents WHERE ResolutionStatus = 'Unresolved';

-- 45. Show projects with no apartments sold
SELECT * FROM Buildings WHERE BuildingID NOT IN (SELECT BuildingID FROM Apartments WHERE Status = 'Sold');

-- 46. List all equipment currently in use
SELECT * FROM Equipment WHERE AvailabilityStatus = 'In Use';

-- 47. Total safety incidents by building
SELECT sh.BuildingID, COUNT(*) AS TotalIncidents 
FROM Safety_Incidents si
JOIN Workers w ON si.WorkerID = w.WorkerID
JOIN Sector_Heads sh ON w.HeadID = sh.HeadID
GROUP BY sh.BuildingID;

-- 48. Find workers paid more than 50,000 total
GROUP BY WorkerID 
HAVING TotalPaid > 50000;

-- 49. Show buildings with inspections that passed
SELECT * FROM Buildings WHERE BuildingID IN (SELECT BuildingID FROM Building_Inspection_Reports WHERE Status = 'Passed');

-- 50. Find the total quantity of materials ordered by suppliers
SELECT SupplierID, SUM(QuantityOrdered) AS TotalQuantity 
FROM Material_Orders 
GROUP BY SupplierID;
SELECT WorkerID, SUM(AmountPaid) AS TotalPaid 
FROM Worker_Payments 


