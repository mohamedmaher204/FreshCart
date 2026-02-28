@echo off
node verify-seed.js > verify_log.txt 2>&1
type verify_log.txt
