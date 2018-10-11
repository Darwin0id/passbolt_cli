/**
 * Domain Model
 *
 * @copyright (c) 2018 Passbolt SARL
 * @licence AGPL-3.0 http://www.gnu.org/licenses/agpl-3.0.en.html
 */
const Model = require('./model.js');
const Config = require('./config.js');
const Key = require('./key.js');
const i18n = require('./i18n.js');
const validator = require('validator');

/**
 * Domain model constructor
 */
class Domain extends Model {
  constructor(url) {
    super();
    if (url !== undefined) {
      this.url = url;
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
      case 'url':
        if (typeof value === 'undefined' || value === '') {
          return new Error(i18n.__('The url should not be be empty'));
        }
        if (!validator.isURL(value)) {
          return new Error('This is not a valid domain url');
        }
        break;
      default:
        return new Error(i18n.__(`No validation defined for field: ${field}`));
    }
    return true;
  }

  /**
   * Set the domain url
   * @param url
   * @return void
   * @throw Error validation error
   */
  set url(url) {
    const result = Domain.validate('url', url);
    if (result === true) {
      this._url = url;
      return;
    }
    throw result;
  }

  /**
   * Return the domain url and optionally load it from config if there is none
   * @returns {*}
   */
  get url() {
    if (this._url == null) {
      const r = this.__loadDefault();
      if (r instanceof Error) {
        return undefined;
      }
    }
    return this._url;
  }

  /**
   * Reset a domain as per file configuration
   * @returns {Error} or true
   * @private
   */
  __loadDefault() {
    const config = Config.get();
    if (config.domain.baseUrl === undefined) {
      return new Error(i18n.__("Can not read domain url from file"));
    }
    this._url = config.domain.baseUrl;
    this.publicKey = new Key(config.domain.publicKey);
    return true;
  }
}

module.exports = Domain;
