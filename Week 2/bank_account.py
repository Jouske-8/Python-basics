class Account:
    def __init__(self, account_number, holder_name, balance=0):
        self.account_number = account_number
        self.holder_name = holder_name
        self.balance = balance

    def deposit(self, amount):
        if amount > 0:
            self.balance += amount
            print(f"Deposited ${amount}. New balance: ${self.balance}")
        else:
            print("Deposit amount must be positive.")
    
    def withdraw(self, amount):
        if amount > 0:
            if amount <= self.balance:
                self.balance -= amount
                print(f"Withdrew ${amount}. New balance: ${self.balance}")
            else:
                print("Insufficient funds.")
        else:
            print("Withdrawal amount must be positive.")
    
    def display_info(self):
        print(f"Account Number: {self.account_number}")
        print(f"Holder Name: {self.holder_name}")
        print(f"Balance: ${self.balance}")
    

class SavingsAccount(Account):
    def __init__(self, account_number, holder_name, balance=0, interest_rate=0.01):
        super().__init__(account_number, holder_name, balance)
        self.interest_rate = interest_rate

    def apply_interest(self):
        interest = self.balance * self.interest_rate
        self.balance += interest
        print(f"Applied interest of ${interest}. New balance: ${self.balance}")

class CurrentAccount(Account):
    def __init__(self, account_number, holder_name, balance=0, overdraft_limit=500):
        super().__init__(account_number, holder_name, balance)
        self.overdraft_limit = overdraft_limit

    def withdraw(self, amount):
        if amount > 0:
            if amount <= self.balance + self.overdraft_limit:
                self.balance -= amount
                print(f"Withdrew ${amount}. New balance: ${self.balance}")
            else:
                print("Exceeded overdraft limit.")
        else:
            print("Withdrawal amount must be positive.")


savings = SavingsAccount("S101", "Madhur", 10000)
current = CurrentAccount("C101", "Devansh", 5000)

print("\nSavings Account")
savings.deposit(2000)
savings.withdraw(1500)
savings.apply_interest()
savings.display_info()

print("\nCurrent Account")
current.withdraw(8000)
current.display_info()
        