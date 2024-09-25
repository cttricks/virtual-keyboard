![Virtual keyboard Banner](https://repository-images.githubusercontent.com/857397772/d2429672-f9b3-4848-a076-517a15ac7411)

![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![Visual Studio](https://img.shields.io/badge/Visual%20Studio-5C2D91.svg?style=for-the-badge&logo=visual-studio&logoColor=white) 	![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white) ![Motorola](https://img.shields.io/badge/Motorola-%23E1140A.svg?style=for-the-badge&logo=motorola&logoColor=white)

A Go-powered virtual keyboard that turns your phone into an external keyboard for your PC. Built as part of my learning journey, this project aims to give developers an easy way to boost productivity with customizable key mappings.

> This project is currently designed for use on Windows. I have only tested it by loading the web app on a Motorola phone's Chrome browser. Feel free to try it out on other devices and share your feedback!

## Features Added So Far
Here's a rundown of all the nifty features I’ve put together

⬜️ = In to-do, will be added soon <br>
🟨 = Added & working but has some functionality issues<br>
✅ = Feature is added & working

|Status| Button | What It Does|
|:--- |:--- |:--- |
| ✅ | Copy | Copies the selected text to the clipboard. Easy-peasy!
| ✅ | Paste | Pastes text right from the clipboard. Boom, done.
| ✅ | CMD  | Opens the Windows Command Prompt. Geek mode: activated.
| ✅ | All Apps | Shows a list of all running apps (*Basically, a shortcut for `win + tab`*).
| ✅ | Close App | Force quits the current app on Windows (*aka the classic `alt + f4` move*).
| ✅ | Enter  | Works like pressing the enter key on the keyboard. Handy, right?
| ✅ | Tab | Acts like hitting the tab button on the keyboard. Press & hold this button for few sec to change tab direction (*forward-backward*). Jump around with ease!
| ✅ | Arrow Keys | Planning to add arrow key ( ⬅️⬆️⬇️➡️ ) support for easier navigation
| 🟨 | Keyboard | Opens up the virtual keyboard on your mobile/tablet/iPad (*But heads up, not all keys sync up perfectly* 😒).
| ✅ | Notepad  | Launches the Windows Notepad app. Jot down those quick thoughts!
| ✅ | Chrome  | Opens Chrome (*If no default profile is set, you'll see the profile selector first*).
| ✅ | GitHub  | Opens [github](https://github.com/cttricks) in Chrome.
| ✅ | Music  | Control music.

That's what I've added so far! Got more cool ideas? Feel free to share them. Give it a try and don't forget to pass it along to your dev friends! 😎

## Tools & Credits

- [NirCmd by NirSoft](https://www.nirsoft.net/utils/nircmd.html), For simulating key-presses on the computer. Shout-out to NirSoft for this amazing utility!
- [Hugeicons](https://hugeicons.com/) For the icons used in the project. Thanks for the great icons!
- [Keyboard Design Inspiration](https://codepen.io/kulpreets/pen/MKgqqB) Inspired by `@kulpreets` virtual keyboard design on CodePen. It's an excellent starting point for building a clean and functional interface!

## How to Use
- Make sure [Go](https://go.dev/doc/install) is installed on your system as no executable files are provided.
- Download the [NirCmd](https://www.nirsoft.net/utils/nircmd.html) executable and place it in the root directory of this project.
- Run the command `go mod tidy` to install all Go dependencies
- Run the command `go run .` to start the application:
- A QR code along with a URL will be printed on the console. Scan the QR code or open the URL on the phone/tablet you want to use as a virtual keyboard.

That's it! Your phone is now set up as a virtual keyboard. 🎉

> It's a personal learning project, so any feedback or suggestions are highly appreciated! Also the project is under continuous development—more features and improvements are coming soon!
