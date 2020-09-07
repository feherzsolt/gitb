const term = require( 'terminal-kit' ).terminal ;
const process = require('process');
const simpleGit = require('simple-git');

async function run()
{
    try {

        const git = simpleGit();
        
        const branches = (await git.branch()).all;
        
        var autoCompleter = function autoCompleter( inputString )
        {  
            const r = [];
            
            branches.forEach(element => {
                if (element.toLowerCase().indexOf(inputString.toLowerCase()) != -1) {
                    r.push(element);
                }
            });
            
            if (r.length == 0) {
                return inputString;
            }
            
            if (r.length == 1) {
                return r[0];
            }
            
            return r;
        } ;
        
        term( 'Branch : ' ) ;
        
        const input = await term.inputField(
            { history: branches, autoComplete: autoCompleter, autoCompleteMenu: true }).promise ;
            
            term.green( "\nChecking out: '%s'\n" , input ) ;
            
            await git.checkout(input);
            
    } catch (e) {
        console.error(e);
    }

    process.exit();
}

exports.run = run;