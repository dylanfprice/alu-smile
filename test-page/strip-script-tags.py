import re
import sys

file_name = sys.argv[1]
contents = None
with open(file_name) as file:
    contents = file.read()

with open(file_name, 'w') as file:
    contents = re.sub(
        pattern=r'<script.*?<\/script>',
        repl='',
        string=contents,
        flags=re.DOTALL
    )
    file.write(contents)

