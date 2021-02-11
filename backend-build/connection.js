"use strict";

var _mysql = _interopRequireDefault(require("mysql"));

var _dbconfig = _interopRequireDefault(require("./dbconfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var mysqlConnection = _mysql["default"].createPool(_dbconfig["default"]);

module.exports = mysqlConnection;
//# sourceMappingURL=connection.js.map