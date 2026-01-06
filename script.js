class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
            case '−': // Handle special char
                computation = prev - current;
                break;
            case '×':
            case '*':
                computation = prev * current;
                break;
            case '÷':
            case '/':
                if (current === 0) return; // Prevent division by zero
                computation = prev / current;
                break;
            default:
                return;
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandTextElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

const previousOperandTextElement = document.querySelector('#previous-operand');
const currentOperandTextElement = document.querySelector('#current-operand');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-action="equals"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const allClearButton = document.querySelector('[data-action="clear"]');

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
        animateButton(button);
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
        animateButton(button);
    });
});

equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
    animateButton(equalsButton);
});

allClearButton.addEventListener('click', button => {
    calculator.clear();
    calculator.updateDisplay();
    animateButton(allClearButton);
});

deleteButton.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
    animateButton(deleteButton);
});

// Keyboard support
document.addEventListener('keydown', e => {
    let button;
    if ((e.key >= 0 && e.key <= 9) || e.key === '.') {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
        button = [...numberButtons].find(btn => btn.innerText === e.key);
    }
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        let op = e.key;
        if (op === '*') op = '×';
        if (op === '/') op = '÷';
        // handle minus special char if needed, but standard - is usually fine

        calculator.chooseOperation(op);
        calculator.updateDisplay();
        button = [...operationButtons].find(btn => btn.getAttribute('data-operation') === op || (op === '×' && btn.innerText === '×') || (op === '÷' && btn.innerText === '÷'));
    }
    if (e.key === 'Enter' || e.key === '=') {
        calculator.compute();
        calculator.updateDisplay();
        button = equalsButton;
    }
    if (e.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
        button = deleteButton;
    }
    if (e.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
        button = allClearButton;
    }

    if (button) animateButton(button);
});

function animateButton(button) {
    if (!button) return;

    // Remove the class to reset animation if it's already playing
    button.classList.remove('pressed');

    // Trigger reflow to restart animation
    void button.offsetWidth;

    button.classList.add('pressed');
}
