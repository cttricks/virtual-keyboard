# Virtual Keyboard

A Go-powered virtual keyboard that turns your phone into an external keyboard for your PC. Built as part of my learning journey, this project aims to give developers an easy way to boost productivity with customizable key mappings.


### Tools & Credits

- [NirCmd by NirSoft](https://www.nirsoft.net/utils/nircmd.html), For simulating key-presses on the computer. Shout-out to NirSoft for this amazing utility!
- [Hugeicons](https://hugeicons.com/) For the icons used in the project. Thanks for the great icons!
- [Keyboard Design Inspiration](https://codepen.io/kulpreets/pen/MKgqqB) Inspired by `@kulpreets` virtual keyboard design on CodePen. It's an excellent starting point for building a clean and functional interface!

### How to Use
- Make sure [Go](https://go.dev/doc/install) is installed on your system as no executable files are provided.
- Download the [NirCmd](https://www.nirsoft.net/utils/nircmd.html) executable and place it in the root directory of this project.
- Run the command `go mod tidy` to install all Go dependencies
- Run the command `go run .` to start the application:
- A QR code along with a URL will be printed on the console. Scan the QR code or open the URL on the phone/tablet you want to use as a virtual keyboard.

That's it! Your phone is now set up as a virtual keyboard. 🎉

> This is a personal learning project, so any feedback or suggestions are highly appreciated! Also the project is under continuous development—more features and improvements are coming soon!