# commander_sql_example

The sql_example.js is a Nimbella Commander command source code example to output the results of a MySQL database query

To get this running, you will need to modify this:

```let dbConfig =  {
    "host": "HOST_HERE_FOR_EXAMPLE_xyz.us-east-1.rds.amazonaws.com",
    "user": "DATABASE_USER_HERE",
    "password": "DATABASE_PASSWORD_HERE",
    "database": "DATABASE_NAME_HERE"
  };
```
  
to contain the MySQL hostname, MySQL user, MySQL database password and MySQL database to execute the query on.

And you'll need to modify the SQL query:

`results = await db.query("select * from mytable where (row_type = ? or row_type = ?) and t >= ? and t <= ?", [ 'one', 'two', 3, 4 ]);`

to perform the SQL query you want.

To use this code with Commander, you can

`/nc command_create sql_example`

and then click the *edit code* link and cut and replace the source code with the source code in this repository.

If you are creating the command in the default app, you can then run the command with:

`/dapp sql_example`

The command_create above creates a command that takes no parameters. You can also create a command with parameters (such as `/nc command_create sql_example <param1> <param2>`, etc.)

When you create a command (as an admin), only the admins can run the command initially. To enable others to run the command, you can:

`/nc command_runners sql_example + @User1 + @User2`

if you just want to allow evrryone in the workspace to run the code, you can

`/nc command_runners sql_example + anyone`

You can get a log of who ran the command with:

`/nc command_log sql_example`
