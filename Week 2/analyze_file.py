def analyze_file(file_path):
    line_count = 0
    word_count = 0
    char_count = 0

    try:
        with open(file_path, 'r') as file:
            for line in file:
                line_count += 1
                words = line.split()
                word_count += len(words)
                char_count += len(line)

        print(f"Lines: {line_count}")
        print(f"Words: {word_count}")
        print(f"Characters: {char_count}")
    
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
    except PermissionError:
        print(f"Error: You do not have permission to read the file '{file_path}'.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

analyze_file(input())