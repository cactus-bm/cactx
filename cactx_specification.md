# Cactx: Merger Modeling Web Application Specification

## 1. Project Overview

Cactx is a React-based web application designed to model potential merger scenarios between two companies: CatX and Cactus. The application will enable users to evaluate different merger options through interactive financial and operational modeling.

## 2. Project Objectives

- Provide a user-friendly interface to model merger scenarios
- Allow comparison of different merger configurations
- Visualize key financial and operational metrics
- Support decision-making through data-driven insights

## 3. Key Features

### 3.1 Merger Scenario Modeling
- Create and save multiple merger scenarios

#### 3.1.1 Key Inputs

- Valuation of CatX in $M
- Valuation of Cactus in $M
- Percentage of Cactus offered to buy CatX
    - To be split between CatX and the employees of CatX on a go forward basis.
- Listing of CatX SAFE investors converting at $2.5m by $m
- Listing of non SAFE investors that would split the rest of the company by %

### 3.2 Visualization Dashboard
- Interactive charts and graphs
- Side-by-side comparison of scenarios

## 4. Technical Requirements

### 4.1 Frontend
- React.js framework
- Modern responsive UI design
- Chart.js or D3.js for data visualization
- Material-UI or similar component library for UI elements

### 4.2 State Management
- Redux or Context API for application state
- Persistence of scenarios in localStorage or IndexedDB

### 4.3 Data Handling
- JSON format for data input/output
- Import/export functionality for scenarios

## 5. User Interface

### 5.1 Core Screens
- Dashboard: Overview of merger scenarios and key metrics
- Scenario Builder: Interface for creating and editing merger scenarios
- Comparison View: Side-by-side analysis of multiple scenarios
- Report Generator: Create shareable reports of analysis

### 5.2 Design Principles
- Clean, professional interface
- Intuitive navigation
- Responsive design for desktop and tablet
- Accessibility compliance

## 6. Data Model

### 6.1 Company Profiles
- Financial data for CatX and Cactus
- Operational metrics
- Asset inventory

### 6.2 Calculation Engine
- Valuation models

## 7. Implementation Plan

### 7.1 Phase 1: Core Functionality
- Basic UI implementation
- Company profile data entry
- Simple merger modeling

## 8. Success Criteria

- User can model at least 3-5 different merger scenarios
- Application provides clear visualization of financial outcomes
- Interface is intuitive and requires minimal training
- Data can be exported for external reporting
