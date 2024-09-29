package main

import (
	"log"
	"net/http"
	"os/exec"
	"runtime"
)

// To open URLs or applications only on Windows
func openBrowser(url string) *exec.Cmd {
	if runtime.GOOS != "windows" {
		log.Println("openBrowser: Unsupported OS. This function only works on Windows.")
		return nil
	}

	// If the OS is Windows, proceed to open the URL
	return exec.Command("rundll32", "url.dll,FileProtocolHandler", url)
}

// To runs the given command and logs the output
func execCommand(cmd *exec.Cmd, w http.ResponseWriter) {
	if cmd == nil {
		http.Error(w, "Failed to execute command", http.StatusInternalServerError)
		return
	}
	if err := cmd.Start(); err != nil {
		log.Printf("Failed to execute command: %v", err)
		http.Error(w, "Failed to execute command", http.StatusInternalServerError)
		return
	}
	w.Write([]byte("Executed command"))
}

// To send key press events
func sendKeyPress(keyCombination string, w http.ResponseWriter) {
	if runtime.GOOS == "windows" {
		// Using nircmd to simulate Ctrl+C
		cmd := exec.Command("./helper/nircmd.exe", "sendkeypress", keyCombination)
		err := cmd.Run()
		if err != nil {
			log.Printf("Failed to execute sendkeypress: %v", keyCombination)
			http.Error(w, "Failed to execute sendkeypress", http.StatusInternalServerError)
			return
		}
		w.Write([]byte("Executed command"))
	} else {
		http.Error(w, "sendkeypress is not implemented for this OS", http.StatusNotImplemented)
	}
}