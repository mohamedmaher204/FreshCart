@echo off
echo Starting Migration... > migration_log.txt
npx prisma generate >> migration_log.txt 2>&1
npx prisma db push >> migration_log.txt 2>&1
echo Starting Seeding... >> migration_log.txt
node seed-products.js >> migration_log.txt 2>&1
echo ALL_DONE > done.txt
