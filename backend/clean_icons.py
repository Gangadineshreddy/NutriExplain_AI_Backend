import os

res_dir = r"c:\Users\91994\AndroidStudioProjects\nutriai\app\src\main\res"
folders = ["mipmap-mdpi", "mipmap-hdpi", "mipmap-xhdpi", "mipmap-xxhdpi", "mipmap-xxxhdpi"]

for folder in folders:
    dest_dir = os.path.join(res_dir, folder)
    if os.path.exists(dest_dir):
        webp1 = os.path.join(dest_dir, "ic_launcher.webp")
        webp2 = os.path.join(dest_dir, "ic_launcher_round.webp")
        if os.path.exists(webp1):
            os.remove(webp1)
        if os.path.exists(webp2):
            os.remove(webp2)

print("Duplicate webp files removed successfully!")
