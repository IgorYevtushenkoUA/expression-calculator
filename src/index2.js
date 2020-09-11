function eval() {
    // Do not use eval!!!
    return;
}

let OPERATION_PRIORITIES = {
    '/': 3,
    '*': 3,
    '+': 2,
    '-': 2,
    '(': 1,
    ')': -1
}


function improveExpression(expr) {
    expr = expr.trim()
    if (expr.includes(' ') === false){
        let temp = ''
        for (let i = 0 ; i < expr.length ; i++){
            temp += (parseInt(expr.charAt(i)) || expr.charAt(i) === '0') ? expr.charAt(i) : ' '+expr.charAt(i) + ' '
        }
        expr = temp
    }
    while (expr.includes('  '))
        expr = expr.replace('  ', ' ')
    return expr
}


function expressionCalculator(expr) {

    let calc = improveExpression(expr).split(' ')
    let current = [], stack = []
    // filter to current and stack
    //expression to reversed poland notation (rpn)

    for (let i = 0; i < calc.length; i++) {
        if (parseInt(calc[i]) || calc[i] === '0') {
            current.push(calc[i])
        } else {
            if (stack.length === 0) {
                stack.push(calc[i])
            } else if (calc[i] === '(') {
                stack.push('(')
            } else if (calc[i] === ')') {
                while (stack[stack.length - 1] !== '(') {
                    let oper = stack.pop()
                    current.push(oper)
                }
                stack.pop()
            } else if (OPERATION_PRIORITIES[calc[i]] > OPERATION_PRIORITIES[stack[stack.length - 1]]) {
                stack.push(calc[i])
            } else if (OPERATION_PRIORITIES[calc[i]] <= OPERATION_PRIORITIES[stack[stack.length - 1]]) {
                while (OPERATION_PRIORITIES[calc[i]] <= OPERATION_PRIORITIES[stack[stack.length - 1]]
                &&
                stack.length > 0) {
                    // console.log(`OPERATION_PRIORITIES[calc[i]] = ${OPERATION_PRIORITIES[calc[i]]}`)
                    // console.log(`OPERATION_PRIORITIES[stack[stack.length - 1]] = ${OPERATION_PRIORITIES[stack[stack.length - 1]]}`)
                    console.log()
                    current.push(stack.pop())
                }
                stack.push(calc[i])
            }
        }
    }
    //clean stack
    while (stack.length !== 0)
        current.push(stack.pop())

    const do_math =  (oper, x, y) => {
        if (oper == '+') {
            return x + y
        }
        if (oper === '-') {
            return x - y
        }
        if (oper === '*') {
            return x * y
        }
        if (oper === '/') {
            if (y === 0)
                throw new TypeError('TypeError: Division by zero.');
            return x / y
        }
    }

    //prn to answer
    let answer = []
    for (let i = 0; i < current.length; i++) {
        let item = current[i]
        if (parseFloat(item) || item === '0') {
            //when item is number
            answer.push(parseFloat(item))
        } else {
            //when item is operation

            let y = answer.pop();
            let x = answer.pop();
            console.log()
            if (y === 0)
                throw new Error("TypeError: Division by zero.");
            let newNum = do_math(item, x, y)
            answer.push(newNum)
        }
    }
    return parseFloat(answer[0])
}


console.log(expressionCalculator("1 / 0"))

module.exports = {
    expressionCalculator
}
