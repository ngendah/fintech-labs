sudo docker compose down --volumes && sudo docker compose up -d --build &
pid=$!
wait $pid
if [ $? -ne 0 ]; then
  echo "Docker command failed"
  exit 1
fi
for i in {1..40}; do
  printf "."
  sleep 1
done
echo ""
sudo docker run --rm --network e-ticketing_default -v $(pwd)/load-testing:/scripts -i grafana/k6:1.2.2 run /scripts/script.js &
pid=$!
wait $pid
if [ $? -ne 0 ]; then
  echo "Docker command failed"
  exit 1
fi
