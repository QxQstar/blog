module.exports = function validateMessage(raw, sourceFile) {
    var types = config.types = config.types || 'conventional-commit-types';
    var AUTO_FIX = config.autoFix && sourceFile;

    // resolve types from a module
    if (typeof types === 'string' && types !== '*') {
        types = Object.keys(require(types).types);
    }

    var messageWithBody = (raw || '').split('\n').filter(function(str) {
        return str.indexOf('#') !== 0;
    }).join('\n');

    var message = messageWithBody.split('\n').shift();

    if (message === '') {
        console.log('Aborting commit due to empty commit message.');
        return false;
    }

    var isValid = true;

    if (MERGE_COMMIT_PATTERN.test(message)) {
        console.log('Merge commit detected.');
        return true
    }

    if (IGNORED.test(message)) {
        console.log('Commit message validation ignored.');
        return true;
    }

    var match = PATTERN.exec(message);

    if (!match) {
        error('does not match "<type>(<scope>): <subject>" !');
        isValid = false;
    } else {
        var firstLine = match[1];
        var squashing = !!match[2];
        var type = match[3];
        var scope = match[4];
        var subject = match[5];

        var SUBJECT_PATTERN = new RegExp(config.subjectPattern || '.+');
        var SUBJECT_PATTERN_ERROR_MSG = config.subjectPatternErrorMsg || 'subject does not match subject pattern!';

        if (firstLine.length > MAX_LENGTH && !squashing) {
            error('is longer than %d characters !', MAX_LENGTH);
            isValid = false;
        }

        if (AUTO_FIX) {
            type = lowercase(type);
        }

        if (types !== '*' && types.indexOf(type) === -1) {
            error('"%s" is not allowed type ! Valid types are: %s', type, types.join(', '));
            isValid = false;
        }

        isValid = validateScope(isValid, scope);

        if (AUTO_FIX) {
            subject = lowercaseFirstLetter(subject);
        }

        if (!SUBJECT_PATTERN.exec(subject)) {
            error(SUBJECT_PATTERN_ERROR_MSG);
            isValid = false;
        }
    }

    // Some more ideas, do want anything like this ?
    // - Validate the rest of the message (body, footer, BREAKING CHANGE annotations)
    // - auto add empty line after subject ?
    // - auto remove empty () ?
    // - auto correct typos in type ?
    // - store incorrect messages, so that we can learn

    isValid = isValid || config.warnOnFail;

    if (isValid) { // exit early and skip messaging logics
        if (AUTO_FIX && !squashing) {
            var scopeFixed = scope ? '(' + scope + ')' : '';
            var firstLineFixed = type + scopeFixed + ': ' + subject;

            if (firstLine !== firstLineFixed) {
                var rawFixed = raw.replace(firstLine, firstLineFixed);
                fs.writeFileSync(sourceFile, rawFixed);
            }
        }

        return true;
    }

    var argInHelp = config.helpMessage && config.helpMessage.indexOf('%s') !== -1;

    if (argInHelp) {
        console.log(config.helpMessage, messageWithBody);
    } else if (message) {
        console.log(message);
    }

    if (!argInHelp && config.helpMessage) {
        console.log(config.helpMessage);
    }

    return false;
};