# cach 1
#from collections import Counter
#text = "apple banana apple orange banana apple grape"
#print(Counter(text.split()))
#-----------------CACH 2----------------
text = "apple banana apple orange banana apple grape"
#fruit_counter = {fruit: len(fruit) for fruit in text.split()}
fruit_counter = {fruit: text.split().count(fruit) for fruit in text.split()}
print(fruit_counter)
#CHƯA TỐI ƯU 
text = "apple banana apple orange banana apple grape"
words = text.split()
fruit_counter = {fruit: words.count(fruit) for fruit in set(words)}
