@echo off
echo Starting installation... > install_log.txt
call npm install bcryptjs >> install_log.txt 2>&1
echo bcryptjs done. >> install_log.txt
call npm install @prisma/client >> install_log.txt 2>&1
echo @prisma/client done. >> install_log.txt
call npx prisma generate >> install_log.txt 2>&1
echo prisma generate done. >> install_log.txt
call npx prisma db push >> install_log.txt 2>&1
echo All done. >> install_log.txt
