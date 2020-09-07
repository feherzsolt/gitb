const term = require( 'terminal-kit' ).terminal ;
const process = require('process');
const simpleGit = require('simple-git');
const array = require('lodash/array');

async function run()
{
    try {

        const git = simpleGit();
        
        const localBranches = (await git.branch({'-l': null})).all;
        
        const remoteBranches = (await git.branch({'-r': null})).all
            .map(item => {
                const index = item.indexOf('/');
                if (index > -1 && index < item.length - 1) {
                    return item.substring(index + 1 );
                } else {
                    return item;
                }
            });
        
        const branches = array.union(localBranches, remoteBranches);
                
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
            
            if (input != undefined && input != '') {

                term.green( "\nChecking out: '%s'\n" , input ) ;
                
                try {
                    await git.checkout(input);
                } catch (_) {
                    console.error("Failed to checkout " + input);
                }
            }
            
    } catch (e) {
        console.error(e);
    }

    process.exit();
}

exports.run = run;