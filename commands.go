package main

import (
	"net/http"
	"os/exec"
	"strings"
)

// To processes the command and executes the appropriate action
func executeCommandHelper(command string, w http.ResponseWriter) {

	// handel senKey commands | sendKey>ctrl+c  or sendKey enter
	if len(command) > 8 && command[:8] == "sendKey>" {
		key := command[8:]
		key = strings.ReplaceAll(key, "-", "+")
		sendKeyPress(key, w)
		return
	}

	// Custom commands
	switch command {
		case "chrome":
			execCommand(openBrowser("chrome"), w)
		case "github":
			execCommand(openBrowser("https://github.com"), w)
		case "cmd":
			execCommand(exec.Command("cmd", "/C", "start"), w)
		case "notepad":
			execCommand(exec.Command("C:\\Windows\\system32\\notepad.exe"), w)
		default:
			http.Error(w, "Unknown command", http.StatusBadRequest)
	}
}