# 🌐 CarTech Platform API Documentation

## 🔐 Authentication Endpoints

### **POST /api/auth/login**
- 📝 **Description** - Authenticate user and return JWT token
- 📊 **Request Body** - `{ email, password }`
- 📤 **Response** - `{ token, user, permissions }`
- 🛡️ **Security** - Rate limited, bcrypt password hashing

### **POST /api/auth/register**
- 📝 **Description** - Register new technician account
- 📊 **Request Body** - `{ email, password, name, certification }`
- 📤 **Response** - `{ user, token }`
- 🛡️ **Security** - Admin approval required

### **POST /api/auth/refresh**
- 📝 **Description** - Refresh JWT token
- 📊 **Headers** - `Authorization: Bearer <token>`
- 📤 **Response** - `{ token, expires }`

## 🔧 ECU Communication Endpoints

### **GET /api/ecu/status**
- 📝 **Description** - Get ECU connection status
- 📤 **Response** - `{ connected, vehicle, protocol }`
- 🔄 **Real-time** - WebSocket updates available

### **POST /api/ecu/connect**
- 📝 **Description** - Establish ECU connection
- 📊 **Request Body** - `{ port, protocol, vehicleId }`
- 📤 **Response** - `{ success, vehicle, capabilities }`
- 🛡️ **Safety** - Connection validation required

### **GET /api/ecu/live-data**
- 📝 **Description** - Stream live engine parameters
- 📤 **Response** - `{ rpm, boost, temp, timing, afr, timestamp }`
- ⚡ **Frequency** - 10Hz update rate
- 🔄 **Real-time** - WebSocket streaming

### **POST /api/ecu/write-parameter**
- 📝 **Description** - Write tuning parameter to ECU
- 📊 **Request Body** - `{ address, value, safety_override }`
- 📤 **Response** - `{ success, old_value, new_value }`
- 🛡️ **Safety** - Parameter validation, audit logging

### **GET /api/ecu/fault-codes**
- 📝 **Description** - Read diagnostic trouble codes
- 📤 **Response** - `{ codes: [{ code, description, severity }] }`
- 🔍 **Details** - Includes freeze frame data

## 🏁 Dyno Integration Endpoints

### **GET /api/dyno/status**
- 📝 **Description** - Get dyno connection status
- 📤 **Response** - `{ connected, type, capabilities }`
- 🔧 **Supported** - DynoJet, Mustang, SuperFlow

### **POST /api/dyno/start-session**
- 📝 **Description** - Start new dyno testing session
- 📊 **Request Body** - `{ vehicleId, testType, operator }`
- 📤 **Response** - `{ sessionId, startTime }`
- 📊 **Logging** - Automatic data recording

### **GET /api/dyno/session/:id/data**
- 📝 **Description** - Get dyno session results
- 📤 **Response** - `{ power_curve, torque_curve, afr_data }`
- 📈 **Format** - Time-series data arrays

### **POST /api/dyno/session/:id/stop**
- 📝 **Description** - Stop dyno session and save results
- 📤 **Response** - `{ peak_hp, peak_torque, report_url }`
- 📊 **Analysis** - Automatic performance calculations

## 🚗 Vehicle Management Endpoints

### **GET /api/vehicle**
- 📝 **Description** - List all vehicles in system
- 📤 **Response** - `{ vehicles: [{ id, make, model, year, owner }] }`
- 🔍 **Filters** - Make, model, year, customer

### **POST /api/vehicle**
- 📝 **Description** - Add new vehicle to system
- 📊 **Request Body** - `{ vin, make, model, year, engine, owner }`
- 📤 **Response** - `{ vehicle, baseline_data }`
- 🔍 **Validation** - VIN verification, duplicate check

### **GET /api/vehicle/:id**
- 📝 **Description** - Get detailed vehicle information
- 📤 **Response** - `{ vehicle, modifications, tune_history }`
- 📊 **History** - Complete modification timeline

### **PUT /api/vehicle/:id/modifications**
- 📝 **Description** - Update vehicle modifications
- 📊 **Request Body** - `{ modifications: [{ type, brand, model }] }`
- 📤 **Response** - `{ updated_vehicle, safety_recommendations }`

## 📊 Performance Analytics Endpoints

### **GET /api/performance/vehicle/:id/history**
- 📝 **Description** - Get vehicle performance history
- 📤 **Response** - `{ sessions: [{ date, hp, torque, mods }] }`
- 📈 **Charts** - Power progression over time

### **GET /api/performance/comparison**
- 📝 **Description** - Compare multiple vehicles or sessions
- 📊 **Query Params** - `vehicleIds`, `sessionIds`
- 📤 **Response** - `{ comparison_data, recommendations }`

### **POST /api/performance/report**
- 📝 **Description** - Generate performance report
- 📊 **Request Body** - `{ sessionId, format, include_charts }`
- 📤 **Response** - `{ report_url, pdf_url }`
- 📄 **Formats** - PDF, Excel, JSON

## 🏪 Shop Management Endpoints

### **GET /api/shop/appointments**
- 📝 **Description** - List shop appointments
- 📤 **Response** - `{ appointments: [{ date, customer, service }] }`
- 📅 **Calendar** - Integration with scheduling system

### **POST /api/shop/appointment**
- 📝 **Description** - Create new appointment
- 📊 **Request Body** - `{ customerId, date, services, notes }`
- 📤 **Response** - `{ appointment, confirmation_sent }`

### **GET /api/shop/inventory**
- 📝 **Description** - Get parts inventory status
- 📤 **Response** - `{ parts: [{ sku, name, quantity, price }] }`
- 📦 **Tracking** - Low stock alerts

### **GET /api/shop/revenue**
- 📝 **Description** - Get shop revenue analytics
- 📊 **Query Params** - `start_date`, `end_date`
- 📤 **Response** - `{ total_revenue, services_breakdown }`

## 🚨 Safety & Monitoring Endpoints

### **GET /api/safety/alerts**
- 📝 **Description** - Get active safety alerts
- 📤 **Response** - `{ alerts: [{ type, severity, vehicle, timestamp }] }`
- 🚨 **Real-time** - WebSocket notifications

### **POST /api/safety/limits**
- 📝 **Description** - Update safety parameter limits
- 📊 **Request Body** - `{ vehicleId, limits: { rpm, boost, temp } }`
- 📤 **Response** - `{ updated_limits, active_monitoring }`

### **GET /api/safety/audit-log**
- 📝 **Description** - Get parameter modification audit log
- 📤 **Response** - `{ log: [{ user, action, old_value, new_value }] }`
- 📋 **Compliance** - Regulatory requirement

## 🔄 WebSocket Events

### **Real-time Data Streams**
- 🔧 **ecu_data** - Live engine parameters (10Hz)
- 🏁 **dyno_data** - Real-time dyno measurements
- 🚨 **safety_alert** - Immediate safety notifications
- 📊 **session_update** - Tuning session progress

### **Connection Events**
- 🔌 **ecu_connected** - ECU connection established
- 🔌 **ecu_disconnected** - ECU connection lost
- 🏁 **dyno_ready** - Dyno system ready for testing
- 🛡️ **safety_system_active** - Safety monitoring enabled
