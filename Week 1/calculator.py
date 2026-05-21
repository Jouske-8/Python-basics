def add(a,b): return a+b
def subtract(a,b): return a-b
def multiply(a,b): return a*b
def divide(a,b): return a/b if b != 0 else "ZeroDivisionError"

def calculator(expression):
    operations = {
        '+': add,
        '-': subtract,
        '*': multiply,
        '/': divide
    }
    
    for op in operations:
        if op in expression:
            a, b = map(int, expression.split(op))
            return operations[op](a, b)
    
    return "Invalid Expression"


print(calculator(input("Enter expression: ")))