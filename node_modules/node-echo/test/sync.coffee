echo = require '..'
fs   = require 'fs'

str  = 'testStr'
dir  = 'testDir'
file = "#{dir}/test.txt"

describe 'echo.sync()', ->
    it 'one arg', ->
        log = console.log
        console.log = sinon.spy()
        echo.sync str
        console.log.should.have.been.calledOnce
        console.log.should.have.been.calledWith str

        console.log = log

    it 'two arg', ->
        log = console.log
        err = console.error

        console.log = sinon.spy()
        console.error = sinon.spy()

        echo.sync str
        echo.sync str, echo.STDOUT
        echo.sync str, echo.STDERR

        console.log.should.have.been.calledTwice
        console.error.should.have.been.calledOnce

        console.log = log
        console.error = err

    it 'create new file', ->
        echo.sync str, '>', file

        data = fs.readFileSync file,
            encoding: 'utf8'

        data.should.equal str

        fs.unlinkSync file
        fs.rmdirSync dir

    it 'append new file', ->
        echo.sync str, '>>', file

        data = fs.readFileSync file,
            encoding: 'utf8'
        data.should.equal str

        fs.unlinkSync file
        fs.rmdirSync dir

    it 'create then append', ->
        echo.sync str, '>', file

        data = fs.readFileSync file,
            encoding: 'utf8'

        data.should.equal str

        echo.sync str, '>>', file

        data = fs.readFileSync file,
            encoding: 'utf8'

        data.should.equal str + '\n' + str

        fs.unlinkSync file
        fs.rmdirSync dir

    it 'append then create', ->
        echo.sync str, '>>', file
        data = fs.readFileSync file,
            encoding: 'utf8'

        data.should.equal str

        echo.sync str, '>', file

        data = fs.readFileSync file,
            encoding: 'utf8'

        data.should.equal str

        fs.unlinkSync file
        fs.rmdirSync dir

    it 'echo Object', ->
        obj = {str: true}

        echo.sync obj, '>', file

        data = fs.readFileSync file,
            encoding: 'utf8'

        JSON.parse(data).should.deep.equal obj

        fs.unlinkSync file
        fs.rmdirSync dir

    it 'echo Array', ->
        arr = [1, 2, 3, 4]

        echo.sync arr, '>', file

        data = fs.readFileSync file,
            encoding: 'utf8'

        JSON.parse(data).should.deep.equal arr

        fs.unlinkSync file
        fs.rmdirSync dir

    it 'echo Function', ->
        func = ->
            'func'

        echo.sync func, '>', file

        data = fs.readFileSync file,
            encoding: 'utf8'

        func2 = eval "(#{data})"

        func2().should.equal 'func'

        fs.unlinkSync file
        fs.rmdirSync dir