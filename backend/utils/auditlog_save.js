const Enum = require("../config/enum");
const  AuditLogs  = require('../models/auditlog');
const responseHandler = require("./responseHandler");

let instance = null;    

class AuditLog {
    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    }

    info(email, location, processType, log) {
        this.saveToDb({
            level: Enum.LOG_LEVELS.INFO,
            email, location, processType, log
        });
    }

    http(email, location, processType, log) {
        this.saveToDb({
            level: Enum.LOG_LEVELS.HTTP,
            email, location, processType, log
        });
    }

    debug(email, location, processType, log) {
        this.saveToDb({
            level: Enum.LOG_LEVELS.DEBUG,
            email, location, processType, log
        });
    }

    error(email, location, processType, log) {
        this.saveToDb({
            level: Enum.LOG_LEVELS.ERROR,
            email, location, processType, log
        });
    }

    warn(email, location, processType, log) {
        this.saveToDb({
            level: Enum.LOG_LEVELS.WARN,
            email, location, processType, log
        });
    }

    async saveToDb({ email, location, processType, log, level }) {     
        await AuditLogs.create({
            level,
            email,
            location,
            processType,
            log
        });
    }
}

module.exports = new AuditLog();
