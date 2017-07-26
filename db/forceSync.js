const sequalizeInstace = require('./adapter');

sequalizeInstace.sync({ force: true })
    .then(res => {
        sequalizeInstace.close()
    })
    .catch(err => console.log(err));