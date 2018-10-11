/**
 * Domain Model
 *
 * @copyright (c) 2018 Passbolt SARL
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
const Model = require('./model.js');
const i18n = require('./i18n.js');

/**
 * Domain model constructor
 */
class Key extends Model {
  constructor(key) {
    super();
    if (key.fingerprint !== undefined) {
      this.fingerprint = key.fingerprint.toUpperCase().replace(/\s/g, '');
    }
  }

  /**
   * Validate user fields individually
   * @param field string
   * @param value string
   * @return boolean true or Error
   */
  static validate(field, value) {
    switch (field) {
      case 'fingerprint':
        return (value.match(/[0-9A-F]{40}/g) !== null);
      default:
        return new Error(i18n.__(`No validation defined for field: ${field}`));
    }
  }

  /**
   * Return the key id
   * @returns {*}
   */
  get fingerprint() {
    return this._fingerprint;
  }

  /**
   * Set a fingerprint
   * @param fingerprint
   */
  set fingerprint(fingerprint) {
    const result = Key.validate('fingerprint', fingerprint);
    if (result === true) {
      this._fingerprint = fingerprint;
      return;
    }
    throw result;
  }
}

module.exports = Key;
