function eval() {
    // Do not use eval!!!
    return;
}

const MATH_OPERATION_PRIORITY = {
    '/': 3,
    '*': 3,
    '-': 2,
    '+': 2,
}

/***
 * check if item math operation like [/,*,-,+] or not
 * @param item
 */
const isMathOperation = (item) => {
    switch (item) {
        case '/':
            return true
        case '*':
            return true
        case '-':
            return true
        case '+':
            return true
        default:
            return false
    }
}

const isNumber = (item) => {
    return !isMathOperation(item)
}
/**
 * depend of math operation -> do math action
 * @param operation
 * @param x
 * @param y
 * @returns {number|*}
 */
const doOperation = (operation, x, y) => {
    switch (operation) {
        case '/':
            return x / y
        case '*':
            return x * y
        case '-':
            return x - y
        case '+':
            return x + y
    }
}

/***
 * this method normalize expression
 * - do trim()
 * - put spaces if expr without it
 * - delete unnecessary space (for instance double space)
 * @param expr
 */
const normalizeExpression = (expr) => {
    // del right and end spaces
    expr = expr.trim()
    //if expr has not spaces -> make it
    let exprCopy = ''
    for (let i = 0; i < expr.length; i++) {
        let item = expr.charAt(i)
        exprCopy += isMathOperation(item) ? ' ' + item + ' ' : item
    }
    expr = exprCopy
    // delete double spaces in the word center
    while (expr.includes('  '))
        expr = expr = expr.replace('  ', ' ')
    return expr
}
// TODO write own func
/**
 * check brackets in expr
 * @param expr
 */
const isBracketsCorrect = (expr) => {
    let checker = expr.split(" ").filter(e => e != "").join("");
    if (checker.replace(/[^(]/g, "").length != checker.replace(/[^)]/g, "").length) {
        throw new Error("ExpressionError: Brackets must be paired");
    }
}

const divByZero = (expr) => {
    if (expr.includes('/ 0')) throw new Error("TypeError: Division by zero.")
}
/**
 * return true if expr incorrect else -> false
 * @param expr
 */
const checkForError = (expr) => {
    divByZero(expr)
    isBracketsCorrect(expr)
}

/**
 * using RPN (reversed poland notation)
 * to build special math string
 * @param expr
 * @returns {[]}
 */
const transformExpressionByReversedPolandNotation = (expr) => {
    let equation = expr.split(' ')
    let current = [], stack = []
    for (let i = 0; i < equation.length; i++) {
        let item = equation[i]
        if (isNumber(item)) {
            current.push(item)
        } else {
            if (item === '(') {
                stack.push(item)
            } else if (item === ')') {
                while (stack[stack.length - 1] !== '(') {
                    current.push(stack.pop())
                }
                stack.pop()
            } else if (MATH_OPERATION_PRIORITY[item] > MATH_OPERATION_PRIORITY[stack[stack.length - 1]]) {
                stack.push(item)
            } else if (MATH_OPERATION_PRIORITY[item] === MATH_OPERATION_PRIORITY[stack[stack.length - 1]]) {
                current.push(stack.pop())
                stack.push(item)
            } else if (MATH_OPERATION_PRIORITY[item] < MATH_OPERATION_PRIORITY[stack[stack.length - 1]]) {
                while (MATH_OPERATION_PRIORITY[item] <= MATH_OPERATION_PRIORITY[stack[stack.length - 1]]) {
                    current.push(stack.pop())
                }
                stack.push(item)
            }
        }
    }
    while (stack.length > 0)
        current.push(stack.pop())

    return current
}
/**
 * using current list (with RPN - reversed poland notation)
 * to calculate value by special math string
 * @param current
 * @returns {*}
 */
const transformReversedPolandNotationToValue = (current) => {
    let answer = []
    for (let i = 0; i < current.length; i++) {
        let item = current[i]
        if (isNumber(item)) {
            answer.push(item)
        } else {
            let y = answer.pop()
            let x = answer.pop()
            let res = doOperation(item, x, y)
            answer.push(res)
        }
    }
    return answer[0]
}

function expressionCalculator(expr) {
    checkForError(expr)

    expr = normalizeExpression(expr)
    let current = transformExpressionByReversedPolandNotation(expr)
    let answer = transformReversedPolandNotationToValue(current)
    return answer
}

module.exports = {
    expressionCalculator
}
