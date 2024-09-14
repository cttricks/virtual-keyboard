package main

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"github.com/skip2/go-qrcode"
)

func handler(w http.ResponseWriter, r *http.Request) {
	// Log new connection
	ip := r.RemoteAddr
	log.Printf("New connection | IP Address: %s\n", ip)

	// Serve the HTML file
	http.ServeFile(w, r, "static/index.html")
}

func executeCommand(w http.ResponseWriter, r *http.Request) {
	ip := r.RemoteAddr
	command := r.URL.Query().Get("command")

	if command == "" {
		http.Error(w, "Command not specified", http.StatusBadRequest)
		return
	}

	// log the command
	log.Printf("From: %s | Command: %s\n", ip, command)

	// Using the helper function to execute the command
	executeCommandHelper(command, w)
}

func getLocalIP() (string, error) {
	// Get a list of all network interfaces
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		return "", err
	}

	// Loop through the addresses and find the first valid IPv4 address
	for _, addr := range addrs {
		// Check if the address is IP address
		ipNet, ok := addr.(*net.IPNet)
		if ok && !ipNet.IP.IsLoopback() && ipNet.IP.To4() != nil {
			ip := ipNet.IP.String()
			// Check if the IP is in a private network range
			if isPrivateIP(ip) {
				return ip, nil
			}
		}
	}

	return "", fmt.Errorf("unable to find local IP address")
}

// To check if an IP address is in the private range
func isPrivateIP(ip string) bool {
	privateBlocks := []string{"192.168.", "10.", "172.16.", "172.17.", "172.18.", "172.19.", "172.20.", "172.21.", "172.22.", "172.23.", "172.24.", "172.25.", "172.26.", "172.27.", "172.28.", "172.29.", "172.30.", "172.31."}
	for _, block := range privateBlocks {
		if len(ip) >= len(block) && ip[:len(block)] == block {
			return true
		}
	}
	return false
}

// To print QR code in the terminal
func printQRCode(url string) {
	qr, err := qrcode.New(url, qrcode.Medium)
	if err != nil {
		log.Fatalf("Failed to generate QR code: %v", err)
	}
	// Convert QR code to a string and print it
	qrStr := qr.ToSmallString(false)
	fmt.Println(qrStr)
}

func main() {
	
	ip, err := getLocalIP()
	if err != nil {
		log.Fatalf("Failed to get local IP address: %v", err)
	}

	// Serve static files from the "static" directory
    fs := http.FileServer(http.Dir("static"))
    http.Handle("/static/", http.StripPrefix("/static/", fs))

	// Set up the route handlers
	http.HandleFunc("/", handler)
	http.HandleFunc("/execute", executeCommand)

	// Construct the URL
	url := fmt.Sprintf("http://%s:3001", ip)
	
	// Print QR code in the terminal
	printQRCode(url)
	
	// Log connection info
	fmt.Println("Scan the QR Code or use the URL to access it from your phone or other devices on the same network.")
	fmt.Printf("URL: %s\n", url)
	fmt.Println("Listening to your command")

	// Start the server
	if err := http.ListenAndServe("0.0.0.0:3001", nil); err != nil {
		log.Fatal(err)
	}
}
