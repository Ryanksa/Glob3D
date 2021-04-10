const sanitize = require('mongo-sanitize');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const ObjectId = require('mongoose').Types.ObjectId;

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

module.exports = {
    validateId: function(id) {
        if (ObjectId.isValid(id)) {
            if (id === (String)(new ObjectId(id))) {
                return true
            }
        }
        return false;
    },
    validateEmail: function(email) {
        // email regex taken from https://ui.dev/validate-email-address-javascript/
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    validatePassword: function(password) {
        return (password.length >= 10);
    },
    validatePosition: function(position) {
        return (position.length === 2);
    },
    sanitizeString: function(string) {
        let clean = sanitize(string);
        clean = DOMPurify.sanitize(clean);
        return clean;
    }
};