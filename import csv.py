import pandas as pd
import csv
from collections import Counter
from collections import defaultdict

words= []
words_counted=[]

with open('c:/mywork/nameslist.csv', 'rt', encoding='windows-1252') as csvfile:
    reader = csv.reader(csvfile)    
    for col in reader:        
        for x in col:
            wlist = x.split(' ')
            for y in wlist:
               words.append(y.upper())


with open('c:/mywork/frequency_result.csv',  'a+') as csvfile:
    writer = csv.writer(csvfile, delimiter=',')
    for i in words:
        x = words.count(i)
        words_counted.append((i,x))    
    writer.writerow(words_counted)



data = pd.DataFrame(words_counted)

data.sort_values(by=1)
data.to_csv("c:/mywork/pyresult.csv")

words_counted


with open('c:/mywork/GREENTECH4.csv', encoding="UTF-8") as f:
    next(f) # skip the header
    cn = Counter(map(itemgetter(2), csv.reader(f)))
    for t in cn.iteritems():
        print("{} appears {} times".format(*t))