module.exports = {
            custom_signature: null, // not yet used - rsa public key or null
            nodeOptions: null,
            arguments: null,
            setNodeOptions: function(nodeOptions){
                                    this.nodeOptions = nodeOptions;
                              },
            setArguments: function(arguments){
                                    this.arguments = arguments;
                              },
            run: function(){
                  var args = this.arguments;
                  var commands=[];
                  for (let [key, value] of Object.entries(args)) {

                    const value_split = value.replace(',','|||').split('|||',2);

                    var command_obj = {
                          name: key,
                          path: value_split[0].trim(),
                          command: value_split[1].trim()
                    }
                    commands.push(command_obj);
                  }

                    return new Promise(function(resolve, reject) {

                          var string_return = {};
                          const { exec } = require('child_process');

                          var exec_commands = (commands) => {

                            var command = commands.shift()

                            exec(command.command, {cwd: command.path}, (error, stdout, stderr) => {
                              if(stdout) string_return[command.name] = stdout;
                              if(stderr) string_return[command.name] = stderr;

                              if(commands.length) exec_commands(commands)
                              else resolve(string_return);
                            });
                          }

                          exec_commands(commands)
                    })
            }
}
