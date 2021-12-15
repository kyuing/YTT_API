# import sys
# # Takes first name and last name via command 
# # line arguments and then display them
# print("Output from Python")
# print(sys.argv[1])
# # print("Last name: " + sys.argv[2])

# # need to test if PEGASUS actually works or not.

# print(sys.argv[1])

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

# with open('script.txt') as json_data:
#  for entry in json_data:
#   print(entry)


# with open('script.txt', encoding='utf8') as f:
#     contents = f.read()


# print(contents)
# context = sys.argv[1].encode(encoding = 'UTF-8', errors = 'strict')
# print("input\n" + context.toString())


rawInput = sys.argv[1]
input = rawInput
# input = rawInput.replace(u"\u00EF", "\'")  # not working
# input = sys.argv[1].replace(u"\u00EF", "\'") # not working
print("input\n" + input)


# # str.decode("utf-8")
# # input = sys.argv[1].decode("utf-8").replace(u"\uFFFD", "\'").encode("utf-8")
# # str.decode("utf-8").replace(u"\u2022", "*")

# # rawInput = "For some reason my �double quotes� were lost.";
# # input = sys.argv[1].replace(u'ï¿½ï¿½', '\'')

# # \u00ef   
# input = sys.argv[1].replace(u"\u00EF", "XXX")
# # input = sys.argv[1].replace(u'\uFFFD', '\'')
# # input = rawInput.replace(u'\uFFD', '\'')
# # input = rawInput.decode("utf-8").replace(u"\uFFFD", "\'").encode("utf-8")
# print("input\n" + input)
# # print("input\n" + sys.argv[1])


# sys.stdout.flush()

# import sys
import torch
from transformers import PegasusForConditionalGeneration, PegasusTokenizer






# model_name = 'tuner007/pegasus_paraphrase'
# torch_device = 'cuda' if torch.cuda.is_available() else 'cpu'
# tokenizer = PegasusTokenizer.from_pretrained(model_name)
# model = PegasusForConditionalGeneration.from_pretrained(model_name).to(torch_device)


# # Paragraph of text
# # single/double quote are a big deal...
# context = sys.argv[1]
# # context = "Hi, I am saying hello world. Nice to meet you."
# # print(context)

# # Takes the input paragraph and splits it into a list of sentences
# from sentence_splitter import SentenceSplitter, split_text_into_sentences

# splitter = SentenceSplitter(language='en')

# sentence_list = splitter.split(context)
# # print(sentence_list)

# def get_response(input_text,num_return_sequences):
#   batch = tokenizer.prepare_seq2seq_batch([input_text],truncation=True,padding='longest',max_length=60, return_tensors="pt").to(torch_device)
#   translated = model.generate(**batch,max_length=60,num_beams=10, num_return_sequences=num_return_sequences, temperature=1.5)
#   tgt_text = tokenizer.batch_decode(translated, skip_special_tokens=True)
#   return tgt_text

# # Do a for loop to iterate through the list of sentences and paraphrase each sentence in the iteration
# paraphrase = []

# for i in sentence_list:
#   a = get_response(i,1)
#   paraphrase.append(a)

# paraphrase2 = [' '.join(x) for x in paraphrase]

# # Combines the above list into a paragraph
# paraphrase3 = [' '.join(x for x in paraphrase2) ]
# paraphrased_text = str(paraphrase3).strip('[]').strip("'")


# print('\n' + "print(context)" + '\n' + context + '\n')
# print('\n' + "print(paraphrased_text)" + '\n' + paraphrased_text + '\n')
# # print(paraphrased_text)