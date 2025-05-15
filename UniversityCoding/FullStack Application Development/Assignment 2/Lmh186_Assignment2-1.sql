/*
* File: Assignment2_SubmissionTemplate.sql
*
* 1) Rename this file according to the instructions in the assignment statement.
* 2) Use this file to insert your solution.
*
*
* Author: <Horner-Long>, <Luke>
* Student ID Number: <2278086>
* Institutional mail prefix: <Lmh186>
*/


/*
*  Assume a user account 'fsad' with password 'fsad2022' with permission
* to create  databases already exists. You do NO need to include the commands
* to create the user nor to give it permission in you solution.
* For your testing, the following command may be used:
*
* CREATE USER fsad PASSWORD 'fsad2022' CREATEDB;
* GRANT pg_read_server_files TO fsad;
* '\i /home/luke/Desktop/PSQL_folder/Lmh186_Assignment2.sql'
*/


/* *********************************************************
* Exercise 1. Create the Smoked Trout database
*
************************************************************ */

-- The first time you login to execute this file with \i it may
-- be convenient to change the working directory.
\cd '/home/luke/Desktop/PSQL_folder'
  -- In PostgreSQL, folders are identified with '/'
\connect postgres;
DROP DATABASE IF EXISTS "SmokedTrout";
-- 1) Create a database called SmokedTrout.

CREATE DATABASE "SmokedTrout"
WITH OWNER = fsad
ENCODING = 'UTF8'
CONNECTION LIMIT = -1 ;

-- 2) Connect to the database

\c SmokedTrout fsad

/* *********************************************************
* Exercise 2. Implement the given design in the Smoked Trout database
*
************************************************************ */

-- 1) Create a new ENUM type called materialState for storing the raw material state

CREATE TYPE materialState AS ENUM ('Solid', 'Liquid', 'Gas', 'Plasma');

-- 2) Create a new ENUM type called materialComposition for storing whether
-- a material is Fundamental or Composite.

CREATE TYPE materialComposition AS ENUM ('Fundamental','Composite');

-- 3) Create the table TradingRoute with the corresponding attributes.

CREATE TABLE TradingRoute (
	MonitoringKey SERIAL,
	FleetSize integer,
	OperatingCompany text NOT NULL,
	LastYearRevenue real,
	PRIMARY KEY (MonitoringKey));

-- 4) Create the table Planet with the corresponding attributes.

CREATE TABLE Planet (
  PlanetID integer NOT NULL,
  StarSystem text,
  PName text,
  Population integer,
  PRIMARY KEY (PlanetID));

-- 5) Create the table SpaceStation with the corresponding attributes.

CREATE TABLE SpaceStation(
  StationID integer NOT NULL,
  PlanetID integer,
  SName text,
  Longitude text,
  Latitude text,
  PRIMARY KEY(StationID),
  CONSTRAINT planetconstraint
  FOREIGN KEY(PlanetID)
  REFERENCES Planet(PlanetID));

-- 6) Create the parent table Product with the corresponding attributes.

CREATE TABLE Product(
	ProductID integer NOT NULL,
	ProductName text NOT NULL,
	VolumePerTon real,
	ValuePerTon real,
	PRIMARY KEY(ProductID));

-- 7) Create the child table RawMaterial with the corresponding attributes.

CREATE TABLE RawMaterial(
	Composite materialComposition,
	ProductState materialState)INHERITS(Product);

-- 8) Create the child table ManufacturedGood.

CREATE TABLE ManufacturedGood()INHERITS(Product);

-- 9) Create the table MadeOf with the corresponding attributes.

CREATE TABLE MadeOf(
	ManufacturedID integer NOT NULL,
	ProductID integer NOT NULL);

-- 10) Create the table Batch with the corresponding attributes.

CREATE TABLE Batch(
	BatchID integer NOT NULL,
	ProductID integer NOT NULL,
	ExtractionOrManufacturingDate date,
	OrigionalFrom integer,
	PRIMARY KEY(BatchID),
	CONSTRAINT OrigionalFromConstraint
	FOREIGN KEY(OrigionalFrom)
	REFERENCES Planet(PlanetID));

-- 11) Create the tale Sells with the corresponding attributes.

CREATE TABLE sells(
	BatchID integer	,
	StationID integer,
	PRIMARY KEY(BATCHID),
	CONSTRAINT stationconstraint
	FOREIGN KEY(StationID)
	REFERENCES SpaceStation(StationID));

-- 12)  Create the table Buys with the corresponding attributes.

CREATE TABLE Buys(
	BatchID integer	,
	StationID integer,
	PRIMARY KEY(BATCHID),
	CONSTRAINT stationconstraint
	FOREIGN KEY(StationID)
	REFERENCES SpaceStation(StationID));

-- 13)  Create the table CallsAt with the corresponding attributes.

CREATE TABLE CallsAt(
	MonitoringKey integer,
	StationID integer,
	VisitOrder integer,
	CONSTRAINT stationconstraint
	FOREIGN KEY(StationID)
	REFERENCES SpaceStation(StationID));

-- 14)  Create the table Distance with the corresponding attributes.

CREATE TABLE Distance(
	PlanetOrigin integer NOT NULL,
	PlanetDestination integer NOT NULL,
	Distance real NOT NULL,
	CONSTRAINT DestinationConstraint
	FOREIGN KEY(PlanetDestination)
	REFERENCES Planet(PlanetID),
	CONSTRAINT OriginConstraint
	FOREIGN KEY(PlanetOrigin)
	REFERENCES Planet(PlanetID));

/* *********************************************************
* Exercise 3. Populate the Smoked Trout database
*
************************************************************ */
/* *********************************************************
* NOTE: The copy statement is NOT standard SQL.
* The copy statement does NOT permit on-the-fly renaming columns,
* hence, whenever necessary, we:
* 1) Create a dummy table with the column name as in the file
* 2) Copy from the file to the dummy table
* 3) Copy from the dummy table to the real table
* 4) Drop the dummy table (This is done further below, as I keep
*    the dummy table also to imporrt the other columns)
************************************************************ */

-- NOTE: GO through CSV files and make sure tables and variable names match up to whats in the csv files

-- 1) Unzip all the data files in a subfolder called data from where you have your code file
-- NO CODE GOES HERE. THIS STEP IS JUST LEFT HERE TO KEEP CONSISTENCY WITH THE ASSIGNMENT STATEMENT

--DONE

-- 2) Populate the table TradingRoute with the data in the file TradeRoutes.csv.

\COPY TradingRoute FROM 'data/TradeRoutes.csv' delimiter ',' CSV header;

-- 3) Populate the table Planet with the data in the file Planets.csv.

\COPY Planet FROM 'data/Planets.csv' delimiter ',' CSV header;

-- 4) Populate the table SpaceStation with the data in the file SpaceStations.csv.

\COPY SpaceStation FROM 'data/SpaceStations.csv' delimiter ',' CSV header;

-- 5) Populate the tables RawMaterial and Product with the data in the file Products_Raw.csv.

CREATE TABLE ImportRaw(
	ProductID integer,
	ProductName text,
	Composite text,
	VolumePerTon real,
	ValuePerTon real,
	State materialState,
	EnumComposite materialComposition);

	\COPY ImportRaw(ProductID,ProductName,Composite,VolumePerTon,ValuePerTon,State) FROM 'data/Products_Raw.csv' delimiter ',' CSV header;
	
	UPDATE ImportRaw
	SET EnumComposite = 'Fundamental'
	WHERE Composite = 'No';
	
	UPDATE ImportRaw
	SET EnumComposite = 'Composite'
	WHERE Composite = 'Yes';
	
	INSERT INTO RawMaterial(ProductID,ProductName,VolumePerTon,ValuePerTon,Composite,ProductState)
	SELECT ProductID,ProductName,VolumePerTon,ValuePerTon,EnumComposite,State FROM ImportRaw;
-- 6) Populate the tables ManufacturedGood and Product with the data in the file  Products_Manufactured.csv.

\COPY ManufacturedGood FROM 'data/Products_Manufactured.csv' delimiter ',' CSV header;

-- 7) Populate the table MadeOf with the data in the file MadeOf.csv.

\COPY MadeOf FROM 'data/MadeOf.csv' delimiter ',' CSV header;

-- 8) Populate the table Batch with the data in the file Batches.csv.

\COPY Batch FROM 'data/Batches.csv' delimiter ',' CSV header;

-- 9) Populate the table Sells with the data in the file Sells.csv.

\COPY Sells FROM 'data/Sells.csv' delimiter ',' CSV header;

-- 10) Populate the table Buys with the data in the file Buys.csv.

\COPY Buys FROM 'data/Buys.csv' delimiter ',' CSV header;

-- 11) Populate the table CallsAt with the data in the file CallsAt.csv.

\COPY CallsAt FROM 'data/CallsAt.csv' delimiter ',' CSV header;

-- 12) Populate the table Distance with the data in the file PlanetDistances.csv.

\COPY Distance FROM 'data/PlanetDistances.csv' delimiter ',' CSV header;

/* *********************************************************
* Exercise 4. Query the database
*
************************************************************ */

-- 4.1 Report last year taxes per company

-- 1) Add an attribute Taxes to table TradingRoute

ALTER TABLE TradingRoute
Add COLUMN Taxes real;

-- 2) Set the derived attribute taxes as 12% of LastYearRevenue

UPDATE TradingRoute
SET Taxes = LastYearRevenue *0.12;
--WHERE LastYearRevenue >= 0

-- 3) Report the operating company and the sum of its taxes group by company.

SELECT OperatingCompany AS "Operating Company", SUM(Taxes) AS "Ssum of Taxes"
FROM TradingRoute
GROUP BY OperatingCompany;

--INNER JOIN OperatingCompany ON


-- 4.2 What's the longest trading route in parsecs?

CREATE TABLE RouteLength(
	TradingRoute SERIAL,
	Distance real
);

CREATE VIEW EnrichedCallsAt AS
  SELECT CallsAt.MonitoringKey,
    CallsAt.VisitOrder,
	SpaceStation.PlanetID
   FROM CallsAt, SpaceStation
   WHERE CallsAt.StationID=SpaceStation.StationID;
   
DO $$
	DECLARE ir record;
	DECLARE ih record;
	
	DECLARE query text;
	
	DECLARE rtd real;
	DECLARE hpd real;
	
	DECLARE lastPlanet integer;
BEGIN
	<< route_loop >>
	FOR ir IN SELECT MonitoringKey FROM TradingRoute
	LOOP
	
	rtd := 0.0;
	DROP VIEW IF EXISTS PortsOfCall;
	
	query := 'CREATE VIEW PortsOfCall AS ' ||
				'SELECT PlanetID, VisitOrder ' ||
				'FROM EnrichedCallsAt ' ||
				'WHERE MonitoringKey = ' || ir.MonitoringKey || ' ' ||
				'ORDER BY VisitOrder ASC';
	EXECUTE query;
			
		<< hop_loop >>
		FOR ih IN SELECT PlanetID, VisitOrder FROM PortsOfCall
		LOOP
		
		hpd := 0.0;
		
		IF ih.VisitOrder = 1 THEN
			lastPlanet := ih.PlanetID;
		ELSE
			SELECT Distance
			INTO hpd
			FROM Distance
			WHERE PlanetOrigin=lastPlanet AND PlanetDestination=ih.PlanetID;
		END IF;
		
		lastPlanet := ih.PlanetID;		
		rtd := rtd + hpd;
		
		END LOOP hop_loop;
		
	INSERT INTO RouteLength (TradingRoute, Distance)
	VALUES (ir.MonitoringKey, rtd);
	
	END LOOP route_loop;
END $$;

SELECT *
FROM RouteLength
WHERE Distance = (SELECT MAX(Distance) FROM RouteLength);