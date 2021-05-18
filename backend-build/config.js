"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  JWT_SECRET: process.env.JWT_SECRET || 'a75a6826d38e0e10b038349eee02ad0ca2922557b7cf1f536bfa1fc81033bcc356eeebcd72fa6723c368c32e5e05bf3ba25471f1e67b120ac316d6754fe16551',
  PORT: process.env.PORT || 5000,
  EMAIL_HOST: process.env.EMAIL_HOST || 'linux121.papaki.gr',
  EMAIL_PORT: process.env.EMAIL_PORT || '465',
  EMAIL_ACCOUNT_USER: process.env.EMAIL_ACCOUNT_USER || 'account@grandmobile.gr',
  EMAIL_ACCOUNT_PASSWORD: process.env.EMAIL_ACCOUNT_PASSWORD || 'qbv7V#27',
  EMAIL_NEWSLETTER_USER: process.env.EMAIL_NEWSLETTER_USER || 'newsletter@grandmobile.gr',
  EMAIL_NEWSLETTER_PASSWORD: process.env.EMAIL_NEWSLETTER_PASSWORD || 'P4~9j8hy',
  EMAIL_SALES_USER: process.env.EMAIL_SALES_USER || 'sales@grandmobile.gr',
  EMAIL_SALES_PASSWORD: process.env.EMAIL_SALES_PASSWORD || 'P6v98$wc',
  EMAIL_CONTACT_USER: process.env.EMAIL_CONTACT_USER || 'contact@grandmobile.gr',
  EMAIL_CONTACT_PASSWORD: process.env.EMAIL_CONTACT_PASSWORD || 'Lyjt30^2',
  EMAIL_ORDER_USER: process.env.EMAIL_ORDER_USER || 'orders@grandmobile.gr',
  EMAIL_ORDER_PASSWORD: process.env.EMAIL_ORDER_PASSWORD || '4dowK0~2'
};
exports["default"] = _default;
//# sourceMappingURL=config.js.map