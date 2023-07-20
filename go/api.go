package main

import (
	"github.com/go-vgo/robotgo"
	"time"
	"fmt"
	"log"
	"os"
	"io"
	"bufio"
	"strings"
	"net/http"
	"path/filepath"
)
var ConsoleKeys = ""


func main() {
	http.HandleFunc("/patch", func(w http.ResponseWriter, r *http.Request) {
		pids, err := robotgo.FindIds("ShooterGame.exe")
		if err == nil {
			if len(pids) != 0 {
				Path, err := robotgo.FindPath(pids[0])
				Path = filepath.Dir(Path)
				Path = filepath.Dir(Path)
				Path = filepath.Dir(Path)
				
				
				if fileExists("ShooterGame.locres") {
					err = copyFile("ShooterGame.locres", Path + "\\Content\\Localization\\Game\\zh\\ShooterGame.locres")
					if err != nil {
						fmt.Fprintln(w, `{"error":"复制文件时发生错误"}`)
					}
					
					
					fmt.Fprintln(w, `{"error":"汉化完成重启游戏生效"}`)
				} else {
					fmt.Fprintln(w, `{"error":"汉化文件不存在"}`)
				}
			} else {
				fmt.Fprintln(w, `{"error":"请先启动游戏"}`)
			}
		}
	})
	
	
	http.HandleFunc("/auto_code", func(w http.ResponseWriter, r *http.Request) {
		if robotgo.GetTitle() != "ARK: Survival Evolved" {
			pids, err := robotgo.FindIds("ShooterGame.exe")
			if err == nil {
				if len(pids) != 0 {
					robotgo.ActivePID(pids[0])
				}
			}
		}
		
		
		if robotgo.GetTitle() == "ARK: Survival Evolved" {
			robotgo.KeyTap(ConsoleKey())
			time.Sleep(time.Millisecond)
			robotgo.TypeStr(r.URL.Query().Get("value"))
			robotgo.KeyTap("enter")
			
			
			fmt.Fprintln(w, `{"error":"ok"}`)
		} else {
			fmt.Fprintln(w, `{"error":"方舟不处在激活状态"}`)
		}
	})
	
	
	http.HandleFunc("/auto_paste", func(w http.ResponseWriter, r *http.Request) {
		if robotgo.GetTitle() != "ARK: Survival Evolved" {
			pids, err := robotgo.FindIds("ShooterGame.exe")
			if err == nil {
				if len(pids) != 0 {
					robotgo.ActivePID(pids[0])
				}
			}
		}
		
		
		if robotgo.GetTitle() == "ARK: Survival Evolved" {
			robotgo.KeyTap(ConsoleKey())
			time.Sleep(time.Millisecond)
			robotgo.KeyTap("v","ctrl")
			robotgo.KeyTap("enter")
			
			
			fmt.Fprintln(w, `{"error":"ok"}`)
		} else {
			fmt.Fprintln(w, `{"error":"方舟不处在激活状态"}`)
		}
	})
	
	
	log.Fatal(http.ListenAndServe("127.0.0.1:8066", nil))
}


func fileExists(filePath string) bool {
	_, err := os.Stat(filePath)
	if err != nil {
		if os.IsNotExist(err) {
			return false
		}
		return true
	}
	return true
}

func copyFile(sourceFile, destinationFile string) error {
	src, err := os.Open(sourceFile)
	if err != nil {
		return err
	}
	defer src.Close()

	dst, err := os.Create(destinationFile)
	if err != nil {
		return err
	}
	defer dst.Close()

	_, err = io.Copy(dst, src)
	if err != nil {
		return err
	}

	return nil
}


func ConsoleKey() string {
	if ConsoleKeys == "" {
		pids, err := robotgo.FindIds("ShooterGame.exe")
		if err == nil {
			if len(pids) != 0 {
				Path, err := robotgo.FindPath(pids[0])
				Path = filepath.Dir(Path)
				Path = filepath.Dir(Path)
				Path = filepath.Dir(Path)
				
				
				file, err := os.Open(Path + "\\Saved\\Config\\WindowsNoEditor\\Input.ini")
				if err == nil {
					scanner := bufio.NewScanner(file)
					
					for scanner.Scan() {
						line := scanner.Text()
						if strings.Contains(line, "ConsoleKeys=") {
							Console := strings.Split(line, "ConsoleKeys=")
							ConsoleKeys = strings.ToLower(Console[1])
							break
						}
					}
				}
				file.Close()
			}
		}
		
		return ConsoleKeys
	} else {
		return ConsoleKeys
	}
}