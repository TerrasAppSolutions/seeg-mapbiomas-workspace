echo "Cron process_tarefa started at $(date) \n"
/var/www/app/Console/cake process_tarefa >> /var/www/app/tmp/logs/cron.log 2>&1
