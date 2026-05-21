import math

def is_prime(n):

    if(n <= 1): return False


    for i in range(2, math.isqrt(n) + 1):
        if n % i == 0 :
            return False
    return True

num = int(input("Check whether a number is Prime or not: "))

print(("Is " if is_prime(num) else "Not ") + "a Prime Number")