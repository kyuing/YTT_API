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
import json
# context = sys.argv[1]

# in testing of:
# http://localhost:5500/ytt/api/61cc9aaeb06a67579ff4a7f8/script?q=.en
# http://localhost:5500/ytt/api/61cc9aaeb06a67579ff4a7f8/paraphrase?q=.en
context = "No smiles today, Written by Cheryl, Rao Shanti and arun were good friends They had so much fun together. They shared secrets in class They ran races on the way home Chandi was always cheerful One day Shanti walked into the classroom slowly Her head was bent down She looked sad Did someone scold you? Asked Arun. Chandi shook her head She sat down and did not look up She did not answer present when Miss Sona called her name Miss Sona called again Louder this time Chandi Kumari Shanthi raised her hand Do you have a sore throat? her teacher asked Shanthi shook her head Her cheeks were red and it looked like she had a fever Are you feeling okay? Miss Sona asked Shanthi Nodded Still not daring to look up Why does Shakti look so Sad? Is your little brother okay? Is your puppy okay? Is your grandmother okay? Shanti kept nodding her head to each of her friends. She did not look up a Arun wanted to make her smile he had an idea he took out something from his bag as He ran to show it to Shanti he slipped out of his hand Shanthi saw something flying towards her and she grabbed it It was a big green rubber frog Shanti's eyes Flew open.  She opened her mouth to laugh. Thats when Arun and her friends saw why she had not smiled or talked all day! Four of her front teeth were missing "

import torch
from transformers import PegasusForConditionalGeneration, PegasusTokenizer

model_name = 'tuner007/pegasus_paraphrase'
torch_device = 'cuda' if torch.cuda.is_available() else 'cpu'
tokenizer = PegasusTokenizer.from_pretrained(model_name)
model = PegasusForConditionalGeneration.from_pretrained(model_name).to(torch_device)


# Takes the input paragraph and splits it into a list of sentences
from sentence_splitter import SentenceSplitter, split_text_into_sentences
splitter = SentenceSplitter(language='en')
sentence_list = splitter.split(context)
# sentence_list = splitter.split(context.replace(u"\"", ""))
# print(sentence_list)

def get_response(input_text,num_return_sequences):
  batch = tokenizer.prepare_seq2seq_batch([input_text],truncation=True,padding='longest',max_length=60, return_tensors="pt").to(torch_device)
  translated = model.generate(**batch,max_length=60,num_beams=10, num_return_sequences=num_return_sequences, temperature=1.5)
  tgt_text = tokenizer.batch_decode(translated, skip_special_tokens=True)

  # print(tgt_text)
  return tgt_text

# Do a for loop to iterate through the list of sentences and paraphrase each sentence in the iteration
paraphrase = []

for i in sentence_list:
  a = get_response(i,1)
  paraphrase.append(a)

# substr = "\""
# for i in range(len(sentence_list)):
#   if substr in sentence_list[i]:
#     sentence_list[i].replace(u"\"", "")
#   a = get_response(sentence_list[i], 1)
#   paraphrase.append(a)
#     # print(paraphrase)


paraphrase2 = [' '.join(x) for x in paraphrase]

# Combines the above list into a paragraph
paraphrase3 = [' '.join(x for x in paraphrase2) ]
paraphrased_text = str(paraphrase3).strip('[]').strip("'")

print('\n' + "print(context)" + '\n' + context + '\n')
print('\n' + "print(paraphrased_text)" + '\n' + paraphrased_text + '\n')
# print('\n' + "print(sentence_list)" + '\n' + sentence_list + '\n')  #error