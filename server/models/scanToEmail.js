const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for Scan To Email
let ScanToEmail = new Schema(
    {ScanToEmail:
            {Destination: {type: String},
                ScanTray: {type: String},
                ColorMode: {type: String},
                Resolution: {type: String},
                FileType: {type: String}
            },
        createdAt: Date
    }
);

// Adding created Date
ScanToEmail.pre('save', function(next) {
    this.createdAt = Date.now();
    next();
});

// Export the model
module.exports = mongoose.model('scanToEmail', ScanToEmail);
