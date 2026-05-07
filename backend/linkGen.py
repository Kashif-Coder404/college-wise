viewLink = input("Enter Your View Link: ")
id = viewLink.split("/")[5]
toDownload = "https://docs.google.com/document/d/"+ id + "/export?format=pdf"

print(toDownload)