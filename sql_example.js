/ jshint esversion: 9

// function to install a npm package
//
// see https://nimbella.com/resources-commander/guide#add-npm-packages-for-a-command

async function install(pkgs) {
  pkgs = pkgs.join(' ');
  return new Promise((resolve, reject) => {
    const { exec } = require('child_process');
    exec(`npm install ${pkgs}`, (err, stdout, stderr) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

/**
 * @description null
 * @param {ParamsType} params list of command parameters
 * @param {?string} commandText text message
 * @param {!object} [secrets = {}] list of secrets
 * @return {Promise<SlackBodyType>} Response body
 */
async function _command(params, commandText, secrets = {}) {
  let packages = [ 'promise-mysql' ];
  await install(packages);
  
  const mysql = require('promise-mysql');

  // we could store the mysql database host and password as encrypted secrets called dbHost and dbPassword and access them
  // with secrets.dbHost and secrets.dbPassword (for example) so the key isn't in the source code here. To keep this example
  // simple, we're just putting a sample password directly in the config below.
  //
  // see https://nimbella.com/resources-commander/guide#secrets

  let dbConfig =  {
    "host": "HOST_HERE_FOR_EXAMPLE_xyz.us-east-1.rds.amazonaws.com",
    "user": "DATABASE_USER_HERE",
    "password": "DATABASE_PASSWORD_HERE",
    "database": "DATABASE_NAME_HERE"
  };

  let results = null;
  let db = null;
  try {
    db = await mysql.createConnection(dbConfig);
    // an example SQL query with parameters
    results = await db.query("select * from mytable where (row_type = ? or row_type = ?) and t >= ? and t <= ?", [ 'one', 'two', 3, 4 ]);
  } catch(e) {
    results = { error: "query error " + e };
  } finally {
    if (db && db.end) await db.end();
  }
  return {
    response_type: 'in_channel', // or `ephemeral` for private response
    text: 'Query Result: ' + JSON.stringify(results)
  };
}

/**
 * @typedef {object} SlackBodyType
 * @property {string} text
 * @property {'in_channel'|'ephemeral'} [response_type]
 */

const main = async (args) => ({
  body: await _command(args.params, args.commandText, args.__secrets || {}).catch(error => ({
    response_type: 'ephemeral',
    text: `Error: ${error.message}`
  }))
});
module.exports = main;
