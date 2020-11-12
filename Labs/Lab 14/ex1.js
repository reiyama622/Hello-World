const fs = require('fs');
var user_data_filename = 'user_data.json'
var data = fs.readFileSync(user_data_filename, 'utf-8');
var users_reg_data = JSON.parse(data);
//console.log(data, typeof users_reg_data, typeof data);
console.log(user_reg_data.['dport'].password)