const fs = require("fs");
const util = require("util");
const path = require("path");
const { exec } = require('child_process');

const directory = "../horcombuild";

const deleteFilesFromHorcomBuild = () => {
    const files = fs.readdirSync(directory);
    const deletedFilesPromisesList =  [];

    for (const file of files) {
        if ([".git", ".idea", ".gitignore"].includes(file)) {
            continue;
        }

        deletedFilesPromisesList.push(
            fs.promises.unlink(path.join(directory, file))
            .then(null)
            .catch((err) => {
                if (err) {
                    console.log("errUnlink");
                    throw err
                }
            })
        )
    }

    return Promise.all(deletedFilesPromisesList);
};

// File destination.txt will be created or overwritten by default.
const copyFilesToHorcomBuild = () => fs.promises.cp(
    "./build",
    directory,
    {recursive: true}
);
const commitChangesInHorcomBuild = () => {
    exec(
        'git -C ' + directory + '/ add .'
        + ' && git -C ' + directory +
        '/ commit -m "build was updated"'
        + ' && git -C ' + directory + '/ push origin',
        (err, stdout, stderr) => {
        if (err) {
            // node couldn't execute the command
            return;
        }

        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    })
};

deleteFilesFromHorcomBuild()
    .then(() => {
        return copyFilesToHorcomBuild();
    })
    .then(() => {
        commitChangesInHorcomBuild()
    });

