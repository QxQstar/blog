fs     = require 'fs'
mkdirp = require 'mkdirp'
util   = require 'jistype'

stringify = (content)->
    switch util.type(content)
        when '[object Object]', '[object Array]'
            JSON.stringify content
        else
            String content

echo = (args...)->
    switch args.length
        when 0
            return
        when 1 # echo to stdout without callback
            console.log args[0]
        when 2 # echo to stdout or stderr without a callback
            [content, output] = args
            if output is '__stderr__'
                console.error content
            else
                console.log content
        when 3 # echo to stdout or stderr with a callback
            [content, output, callback] = args
            if output is '__stderr__'
                console.error content
            else
                console.log content
            callback null
        when 4 # echo to local file with a callback
            [content, flag, file, callback] = args

            content = stringify content

            flag or= '>>'

            fs.exists file, (exist)->
                if exist # file exist, so append to file when flag is '>>'
                    fs.readFile file, {encoding: 'utf8'}, (err, data)->
                        if err # readfile error
                            return callback err
                        if data and flag is '>>' # file is not empty, and flat is append
                            fs.appendFile file, "\n#{content}", callback
                        else # file is empty or replace file, so use write file
                            fs.writeFile file, content, callback
                else # file is not exist, so create new file whatever the flag
                    dirname = file.substr 0, file.lastIndexOf '/'
                    if dirname # has specific directory
                        mkdirp dirname, (err)->
                            if err
                                return callback err
                            fs.writeFile file, content, callback
                    else
                        fs.writeFile file, content, callback

echo.sync = (args...)->
    switch args.length
        when 0, 1, 2
            echo args...
        when 3 # echo to local file
            [content, flag, file] = args

            content = stringify content

            flag or= '>>'

            if fs.existsSync file
                if fs.readFileSync(file).toString() isnt '' and flag is '>>' # file is not empty, and flat is append
                    fs.appendFileSync file, "\n#{content}"
                else # file is empty or replace the old file
                    fs.writeFileSync file, content
            else # file not exist, so create new file whatever the flag
                dirname = file.substr 0, file.lastIndexOf '/'
                if dirname # has specific dirname
                    mkdirp.sync dirname
                fs.writeFileSync file, content


echo.STDOUT = '__stdout__'
echo.STDERR = '__stderr__'

module.exports = echo
