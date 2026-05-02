import os
import shutil

source_img = r"C:\Users\91994\.gemini\antigravity\brain\86340f65-4337-48a4-967a-88cadd4df5f9\nutriexplain_ai_icon_1777659355175.png"
res_dir = r"c:\Users\91994\AndroidStudioProjects\nutriai\app\src\main\res"

# Remove anydpi xml files that override pngs
xml1 = os.path.join(res_dir, "mipmap-anydpi-v26", "ic_launcher.xml")
xml2 = os.path.join(res_dir, "mipmap-anydpi-v26", "ic_launcher_round.xml")
if os.path.exists(xml1): os.remove(xml1)
if os.path.exists(xml2): os.remove(xml2)

# Copy to all mipmap folders
folders = ["mipmap-mdpi", "mipmap-hdpi", "mipmap-xhdpi", "mipmap-xxhdpi", "mipmap-xxxhdpi"]
for folder in folders:
    dest_dir = os.path.join(res_dir, folder)
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)
    
    shutil.copy(source_img, os.path.join(dest_dir, "ic_launcher.png"))
    shutil.copy(source_img, os.path.join(dest_dir, "ic_launcher_round.png"))

print("App icons updated successfully!")
