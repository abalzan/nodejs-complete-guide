const fs = require('fs');

const deleteFile = (path) => {
    if (fs.existsSync(path)) {
        fs.unlink(path, err => {
            if (err) {
                throw(err);
            }
        });
    }
}

exports.deleteFile = deleteFile;
