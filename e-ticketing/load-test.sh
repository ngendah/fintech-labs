sudo docker compose down && sudo docker compose up -d --build &
for i in {1..40}; do
  printf "."
  sleep 1
done
echo ""
sudo docker run --rm --network e-ticketing_default -i grafana/k6:1.2.2 run - <"load-testing/script.js" &
: >stats.txt
end=$((SECONDS + 20))
while [ $SECONDS -lt $end ]; do
  sudo docker compose stats --no-stream | tee -a stats.txt
  sleep 0.2
done
