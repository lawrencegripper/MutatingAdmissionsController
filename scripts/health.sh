attempt_counter=0
max_attempts=10

until $(curl --output /dev/null --silent --fail http://localhost:3000/healthz); do
    if [ ${attempt_counter} -eq ${max_attempts} ];then
      echo "Max attempts reached"
      exit 1
    fi

    printf '.'
    attempt_counter=$(($attempt_counter+1))
    sleep 5
done