import random

def number_guessing_game():
    number = random.randint(1, 100)
    attempts = 0

    print("Guess a number between 1 and 100.\n")

    while True:
        guess = int(input("Enter your guess: "))
        attempt += 1

        if guess == number:
            print(f"Congratulations! You guessed the right number in {attempts} attempt(s)")
            break
        elif guess < number:
            print("Guess Higher")
        else:
            print("Guess Lower")
    
number_guessing_game()