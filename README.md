# crypto-note
note web application with profiles system that work's without any database by using cryptography to confirm login and encrypt personal notes




### why this project
the main porpus of this project is to create a cms application without any database and will less server-side code
and let javascript deal with most of this appliaction like login ,creat accounts and manage the notes

### does letting javascript deal with login is safe
actully it's bad idea in any normal project to make such login system only with javascript (if it's possible)
but in this project we must create it will less server helping

my solution is simple by create a hidden file that store minimal information about user and the only way to access this file is 
by it's parent folder name and it self name to create full path
and those information (folder name and file name) is generated with hash function that take's username and password 
so the path to file that store user information is uniq and it's hard to access it without the currect set of name and password

### sicret file is encrypted ?
yes, it's bad idea to let it totaly open and the way for crypte it is by classic cryptography algorithme
that take's the username and password as input for encrypt and decirept and what powerfull in this  algorithme
is the fact that the same letter may take variaty of crypted letter for exemple C(aaaaaaa)=ze7gaf€

### sicret file parts
the sicret file split down to 4 parts  
- part1: containt username
- part2: last time user login
- part3: all notes information
- part4: hash code of the last 3 parts

### why part4 of sicret file
well this part is responsibe of checking if every is right when user try to login again by compare 
result of hashed 3 partes with the old hash (part 4) and it's doesn't match that means this attemp to login
is filed or the current sicret file is changed without permission

### server side
for read and write to sicret file we must provide it full path
and if it exist will act with it otherways the server will create it if the requet provide also 
it content
and that's enoghof for manage the data
