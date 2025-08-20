// 🔧 ECU Communication Service
const SerialPort = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const EventEmitter = require('events');
const logger = require('../../utils/logger');

class ECUService extends EventEmitter {
  constructor() {
    super();
    this.port = null;
    this.parser = null;
    this.connected = false;
    this.vehicle = null;
    this.safetyLimits = {
      maxRPM: 7000,
      maxBoost: 25, // PSI
      maxEGT: 1600, // °F
      maxCoolantTemp: 220, // °F
      minOilPressure: 10 // PSI
    };
  }

  // 🔌 Connect to ECU
  async connect(portPath = process.env.OBD_PORT || 'COM3') {
    try {
      this.port = new SerialPort({
        path: portPath,
        baudRate: 38400,
        dataBits: 8,
        parity: 'none',
        stopBits: 1
      });

      this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
      
      this.port.on('open', () => {
        logger.info('🔌 ECU connection established');
        this.connected = true;
        this.emit('connected');
        this.initializeECU();
      });

      this.parser.on('data', (data) => {
        this.processECUData(data);
      });

      this.port.on('error', (err) => {
        logger.error('🚨 ECU connection error:', err);
        this.connected = false;
        this.emit('error', err);
      });

      this.port.on('close', () => {
        logger.info('🔌 ECU connection closed');
        this.connected = false;
        this.emit('disconnected');
      });

    } catch (error) {
      logger.error('🚨 Failed to connect to ECU:', error);
      throw error;
    }
  }

  // 🚀 Initialize ECU Communication
  async initializeECU() {
    try {
      // Reset ECU communication
      await this.sendCommand('ATZ');
      await this.delay(1000);

      // Turn off echo
      await this.sendCommand('ATE0');
      
      // Set protocol to automatic
      await this.sendCommand('ATSP0');
      
      // Get vehicle identification
      const vin = await this.sendCommand('0902');
      this.vehicle = { vin: this.parseVIN(vin) };
      
      logger.info(`🚗 Vehicle identified: ${this.vehicle.vin}`);
      this.emit('initialized', this.vehicle);

      // Start real-time monitoring
      this.startMonitoring();

    } catch (error) {
      logger.error('🚨 ECU initialization failed:', error);
      throw error;
    }
  }

  // 📊 Start Real-time Monitoring
  startMonitoring() {
    this.monitoringInterval = setInterval(async () => {
      try {
        const data = await this.readLiveData();
        this.validateSafety(data);
        this.emit('data', data);
      } catch (error) {
        logger.error('🚨 Monitoring error:', error);
      }
    }, 100); // 10Hz monitoring rate
  }

  // 📈 Read Live Engine Data
  async readLiveData() {
    const commands = {
      rpm: '010C',           // Engine RPM
      speed: '010D',         // Vehicle Speed
      coolantTemp: '0105',   // Engine Coolant Temperature
      intakeTemp: '010F',    // Intake Air Temperature
      maf: '0110',           // Mass Air Flow
      throttle: '0111',      // Throttle Position
      boost: '010B',         // Manifold Absolute Pressure
      fuelTrim: '0106',      // Short Term Fuel Trim
      ignitionTiming: '010E', // Timing Advance
      oilTemp: '015C'        // Oil Temperature
    };

    const data = {};
    
    for (const [param, command] of Object.entries(commands)) {
      try {
        const response = await this.sendCommand(command);
        data[param] = this.parseParameter(param, response);
      } catch (error) {
        logger.warn(`⚠️ Failed to read ${param}:`, error);
      }
    }

    data.timestamp = new Date().toISOString();
    return data;
  }

  // 🛡️ Safety Validation
  validateSafety(data) {
    const alerts = [];

    if (data.rpm > this.safetyLimits.maxRPM) {
      alerts.push({ type: 'RPM_LIMIT', value: data.rpm, limit: this.safetyLimits.maxRPM });
    }

    if (data.boost > this.safetyLimits.maxBoost) {
      alerts.push({ type: 'BOOST_LIMIT', value: data.boost, limit: this.safetyLimits.maxBoost });
    }

    if (data.coolantTemp > this.safetyLimits.maxCoolantTemp) {
      alerts.push({ type: 'COOLANT_TEMP', value: data.coolantTemp, limit: this.safetyLimits.maxCoolantTemp });
    }

    if (alerts.length > 0) {
      logger.warn('🚨 Safety alerts:', alerts);
      this.emit('safety_alert', alerts);
    }
  }

  // 🔧 Write Tuning Parameters
  async writeTuningParameter(address, value) {
    if (process.env.SAFETY_MODE === 'enabled') {
      logger.info('🛡️ Safety mode enabled - parameter write blocked');
      throw new Error('Safety mode prevents parameter modification');
    }

    try {
      const command = `22${address.toString(16).padStart(4, '0')}${value.toString(16).padStart(4, '0')}`;
      const response = await this.sendCommand(command);
      
      logger.info(`🔧 Parameter written - Address: 0x${address.toString(16)}, Value: ${value}`);
      this.emit('parameter_written', { address, value, response });
      
      return response;
    } catch (error) {
      logger.error('🚨 Parameter write failed:', error);
      throw error;
    }
  }

  // 📤 Send Command to ECU
  async sendCommand(command) {
    return new Promise((resolve, reject) => {
      if (!this.connected) {
        reject(new Error('ECU not connected'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Command timeout'));
      }, parseInt(process.env.ECU_TIMEOUT) || 5000);

      const responseHandler = (data) => {
        clearTimeout(timeout);
        this.parser.removeListener('data', responseHandler);
        resolve(data);
      };

      this.parser.once('data', responseHandler);
      this.port.write(command + '\r');
    });
  }

  // 🔍 Parse ECU Response
  parseParameter(param, response) {
    const hex = response.replace(/\s/g, '');
    
    switch (param) {
      case 'rpm':
        return parseInt(hex.substr(4, 4), 16) / 4;
      case 'speed':
        return parseInt(hex.substr(4, 2), 16);
      case 'coolantTemp':
        return parseInt(hex.substr(4, 2), 16) - 40;
      case 'intakeTemp':
        return parseInt(hex.substr(4, 2), 16) - 40;
      case 'maf':
        return parseInt(hex.substr(4, 4), 16) / 100;
      case 'throttle':
        return parseInt(hex.substr(4, 2), 16) * 100 / 255;
      case 'boost':
        return parseInt(hex.substr(4, 2), 16) * 0.145; // Convert kPa to PSI
      default:
        return parseInt(hex.substr(4, 2), 16);
    }
  }

  // 🚗 Parse Vehicle Identification Number
  parseVIN(response) {
    const hex = response.replace(/\s/g, '');
    let vin = '';
    for (let i = 10; i < hex.length; i += 2) {
      vin += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return vin.trim();
  }

  // ⏱️ Utility Delay Function
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 🔌 Disconnect from ECU
  async disconnect() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    if (this.port && this.port.isOpen) {
      await new Promise((resolve) => {
        this.port.close(resolve);
      });
    }

    this.connected = false;
    logger.info('🔌 ECU disconnected');
  }

  // 📊 Connection Status
  isConnected() {
    return this.connected;
  }

  // 🛡️ Update Safety Limits
  updateSafetyLimits(limits) {
    this.safetyLimits = { ...this.safetyLimits, ...limits };
    logger.info('🛡️ Safety limits updated:', this.safetyLimits);
  }
}

module.exports = new ECUService();
