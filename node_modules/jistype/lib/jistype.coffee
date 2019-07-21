getType = (obj) ->
    Object::toString.call obj

class module.exports
    @isString: (obj)->
        '[object String]' is getType obj

    @isArray: (obj)->
        '[object Array]' is getType obj

    @isRegExp: (obj)->
        '[object RegExp]' is getType obj

    @isNumber: (obj)->
        '[object Number]' is getType obj

    @isObject: (obj)->
        '[object Object]' is getType obj

    @isFunction: (obj)->
        '[object Function]' is getType obj

    @isBoolean: (obj)->
        '[object Boolean]' is getType obj

    @isUndefined: (obj)->
        '[object Undefined]' is getType obj

    @isNull: (obj)->
        '[object Null]' is getType obj

    @isDate: (obj)->
        '[object Date]' is getType obj

    @isGlobal: (obj)->
        '[object global]' is getType obj

    @type: getType