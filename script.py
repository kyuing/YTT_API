# https://github.com/dataprofessor/python/blob/main/transformer_pegasus_paraphrase.ipynb
# https://phoenixnap.com/kb/install-pip-windows
# https://stackoverflow.com/questions/23708898/pip-is-not-recognized-as-an-internal-or-external-command
# -m pip install openpyxl

# py -m pip install sentence-splitter
# py -m pip install transformers
# py -m pip install SentencePiece
# py -m pip install torch
# cmnd setx PATH “%PATH%;C:\Users\HP\AppData\Local\Programs\Python\Python39\Scripts”
import sys

context = sys.argv[1]
# context = sys.argv[1].replace(u"'", "\'")
# context = "This happened when I was 17 years old..."
# context = sys.argv[1].replace(u"\"", "")
# print(context)


import json
import torch
from transformers import PegasusForConditionalGeneration, PegasusTokenizer

model_name = 'tuner007/pegasus_paraphrase'
torch_device = 'cuda' if torch.cuda.is_available() else 'cpu'
tokenizer = PegasusTokenizer.from_pretrained(model_name)
model = PegasusForConditionalGeneration.from_pretrained(model_name).to(torch_device)

# Paragraph of text
# single/double quote are fussy..
# input = "One beautiful summer day, a lazy grasshopper was
#  sitting and enjoying the sun, just as he did every day! Then a hardworking ant passed by,  bearing along with great effort, an ear of corn that
#  he was taking to his nest. “Why don’t you come
#  and chat with me?” " asked the grasshopper
#  “instead of working all day” “I am saving food
#  for the winter season” said the ant
#  “I think you should  do the same” “What will you eat
#  when the weather gets cold?”  “How will you feed
#  your hungry household?” The grasshopper laughed and said “You are always in such a hurry” “Why do you always
#  work and worry? “Why bother about the winter now?”  said the grasshopper “We have got
#  plenty of food at present” But the ant was very wise,  and didn’t pay attention
#  to Grasshoppers words.  He continued to work hard and
#  stored enough food for the winter. The winter came sooner than expected. The grasshopper couldn’t find
#  a place to stay and anything to eat. He went to the ants house
#  and begged him for food and shelter. “I’m sorry, but I can’t help you”
#  the ant said. “I only have room and food for my family,  so go and find help somewhere else” “I should have followed the Ant’s example” ” the grasshopper said sadly. So children, the moral of this story is “There’s a time for work,  and there’s a time for play ” If you play during the time
#  you are supposed to work, then be ready to
#  face the consequences” "
# input = "This happened when I was 17 years old... I would go to the gym, three to four times a week and ride the bus home. It was a Sunday - and I had just missed my bus, so I had to wait longer for another one. I would've called my parents but they were out for the evening - and taxis charged more... So I decided to sit and wait in the bus shelter. It was a cold night and snow had just started peppering the ground. My bus was taking longer than usual so I got my phone out and listened to some music. Almost an hour had passed... It was freezing and I hadn't seen anyone at all. ...That wasn't until I noticed something out of the corner of my eye... It was a creepy guy, dressed in thick layers of clothing, walking slowly towards me. I knew staring at him would draw more attention, so I just focused on my phone. He sat down at the other end of the shelter and just stared at me. There was something off about him... He seemed like he was either drunk or on drugs. He then asked - "When is the bus due?" I took out my earphones and said - "I think it's delayed because of the snow". He stared at me for a while then started mumbling to himself. He was really starting to creep me out, so I pretended to be on my phone. After a couple of minutes, I took another look... He'd moved closer to me... I looked away for a second then heard the sound of him sliding even closer. I turned to him and said - "You okay there?" He stared at me with glossy eyes, lifted his arm and leaned towards me. Immediately, I grabbed my bag and ran as he fell to the ground. I ran down the road trying my hardest not to look back. I kept going until I got to the next bus stop. I turned around to check to see if he was there... he was gone, so I went to sit down. Feeling relieved, I rested my head on the back of the glass and waited for the bus. *knock knock knock knock* I jolted, and turned around to see the same guy staring at me through the glass. "What the hell is wrong with you"? Then he started walking around the shelter towards me. "I'm warning you! Stay. Back." I yelled in panic as I was backing up... I wanted to run, but I left my bag in the shelter and couldn't leave without it. Suddenly, the man leaped at me and I quickly moved out of the away. He fell to the ground face first. I froze in shock then noticed the blood coming from his face. I tried to get a response out of him but nothing worked. I called the police and paramedics and they arrived shortly after. I told them what had happened, and they told me that the guy was on prescription drugs... He found a photo in his wallet of him and his son. The boy looked just like me so we assumed that he thought I was him. I later learned that he had lost his son in a custody battle and went off the rails. He was taken away for treatment and that was the last I saw of him. I got my driver's licence shortly after and have never, been on a bus since."
# rawInput = "hi. nice to meet you. see you again."


rawInput = str(sys.argv[1])
# context = ""
context = rawInput
# context = rawInput.replace(u"\n", " ")
# # rawInput = sys.argv[1].replace(u"\"", "")
# rawInput = input.replace(u'\"', "\"")
# context = "This happened when I was 17 years old... I would go to the gym, three to four times a week and ride the bus home. It was a Sunday - and I had just missed my bus, so I had to wait longer for another one. I would've called my parents but they were out for the evening - and taxis charged more... So I decided to sit and wait in the bus shelter. It was a cold night and snow had just started peppering the ground. My bus was taking longer than usual so I got my phone out and listened to some music. Almost an hour had passed... It was freezing and I hadn't seen anyone at all. ...That wasn't until I noticed something out of the corner of my eye... It was a creepy guy, dressed in thick layers of clothing, walking slowly towards me. I knew staring at him would draw more attention, so I just focused on my phone. He sat down at the other end of the shelter and just stared at me. There was something off about him... He seemed like he was either drunk or on drugs. He then asked - \"When is the bus due?\" I took out my earphones and said - \"I think it's delayed because of the snow\". He stared at me for a while then started mumbling to himself. He was really starting to creep me out, so I pretended to be on my phone. After a couple of minutes, I took another look... He'd moved closer to me... I looked away for a second then heard the sound of him sliding even closer. I turned to him and said - \"You okay there?\" He stared at me with glossy eyes, lifted his arm and leaned towards me. Immediately, I grabbed my bag and ran as he fell to the ground. I ran down the road trying my hardest not to look back. I kept going until I got to the next bus stop. I turned around to check to see if he was there... he was gone, so I went to sit down. Feeling relieved, I rested my head on the back of the glass and waited for the bus. *knock knock knock knock* I jolted, and turned around to see the same guy staring at me through the glass. \"What the hell is wrong with you\"? Then he started walking around the shelter towards me. \"I'm warning you! Stay. Back.\" I yelled in panic as I was backing up... I wanted to run, but I left my bag in the shelter and couldn't leave without it. Suddenly, the man leaped at me and I quickly moved out of the away. He fell to the ground face first. I froze in shock then noticed the blood coming from his face. I tried to get a response out of him but nothing worked. I called the police and paramedics and they arrived shortly after. I told them what had happened, and they told me that the guy was on prescription drugs... He found a photo in his wallet of him and his son. The boy looked just like me so we assumed that he thought I was him. I later learned that he had lost his son in a custody battle and went off the rails. He was taken away for treatment and that was the last I saw of him. I got my driver's licence shortly after and have never, been on a bus since."
# context = sys.argv[1].replace(u"'", "\'")
# context = rawInput.replace(u"\u00EF", "\'")  # not working
# context = sys.argv[1].replace(u"\u00EF", "\'") # not working
# print("input\n" + context)

# Takes the input paragraph and splits it into a list of sentences
from sentence_splitter import SentenceSplitter, split_text_into_sentences
splitter = SentenceSplitter(language='en')
sentence_list = splitter.split(context)
# sentence_list = splitter.split(context.replace(u"\"", ""))
print(sentence_list)

def get_response(input_text,num_return_sequences):
  batch = tokenizer.prepare_seq2seq_batch([input_text],truncation=True,padding='longest',max_length=60, return_tensors="pt").to(torch_device)
  translated = model.generate(**batch,max_length=60,num_beams=10, num_return_sequences=num_return_sequences, temperature=1.5)
  tgt_text = tokenizer.batch_decode(translated, skip_special_tokens=True)

  # print(tgt_text)
  return tgt_text

# Do a for loop to iterate through the list of sentences and paraphrase each sentence in the iteration
paraphrase = []

# for i in sentence_list:
#   a = get_response(i,1)
#   paraphrase.append(a)

# for i in sentence_list:
#   if i < 2:
#     a = get_response(i,1)
#     paraphrase.append(a)


# substr = "\""
for i in range(len(sentence_list)):
  # if i < 10:  # working
  #if i > 9 and i < 20: #working
  # if i > 9 and i < 20:
  # if i >= 10 and i < 15:  #not working
  # if substr in sentence_list[i]:
    # sentence_list[i].replace(u"\"", "")
    # sentence_list[i].replace(u"\.\.*?", "\.")
    
    # sentence_list[i].replace(u"\\\"", "")
    a = get_response(sentence_list[i],1)
    paraphrase.append(a)
    # print(paraphrase)
  # if a is not None:
  #   paraphrase.append(a)
  # else:
  #   paraphrase.append("ERROR FOUND")

  

# a = get_response(sentence_list[9],1)
# paraphrase.append(a)
# print(paraphrase)







paraphrase2 = [' '.join(x) for x in paraphrase]

# Combines the above list into a paragraph
paraphrase3 = [' '.join(x for x in paraphrase2) ]
paraphrased_text = str(paraphrase3).strip('[]').strip("'")

# print('\n' + "print(sentence_list)" + '\n' + sentence_list + '\n')  #error
# print('\n' + "print(context)" + '\n' + context + '\n')
print('\n' + "print(paraphrased_text)" + '\n' + paraphrased_text + '\n')
# print(paraphrased_text)