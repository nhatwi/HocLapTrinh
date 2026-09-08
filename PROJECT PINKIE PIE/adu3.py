# everything in python are object and object always have functions
# u can access function with "." after a object
course = "   nhật quý đẹp chai"
course_lowercase = course.lower()
course_capital = course.upper()
course_title = course.title()
course_strip = course.strip()
course_find = course.find("đẹp")
course_replace = course.replace("đẹp", "xih")
print(course_strip)
print(course_lowercase)
print(course_title)
print(course_capital)
print(course)
print(course_find)
print(course_replace)
print("nhật" in course)
print("ok" not in course) 