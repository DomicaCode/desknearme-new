#!/bin/env bash
#

fetch_logs_as_json() {
  curl -s "${MPKIT_URL}/api/app_builder/logs?per_page=${1:-100}&last_id=$LAST_ID" -H "Authorization: Token ${MPKIT_TOKEN}"
}

get_last_log_id() {
  echo $1 | jq '.logs[] | .id' | tail -n 1
}

fetch_test_result() {
  sleep 5
  LAST_LOG_ENTRY=$(fetch_logs_as_json 100)
  LAST_ID=$(get_last_log_id "$LAST_LOG_ENTRY")
  # echo "LAST LOG ID: $LAST_ID"
  echo -n "."
  echo $LAST_LOG_ENTRY | jq -r '.logs[] | [.created_at, .error_type, .message] | @tsv' >> test.log

  TEST_RESULT=$(grep -E "${TEST_ID}|BackgroundJob Error" test.log)
}

start_test() {
  TEST_ID=$(curl -sf ${MPKIT_URL}/tests/run_async)
  TEST_ID=`echo $TEST_ID`
  echo triggered tests on ${MPKIT_URL/https:\/\//} - ID: ${TEST_ID}
}

LAST_ID=$(get_last_log_id "$(fetch_logs_as_json 1)")
echo $LAST_ID > test.log

start_test
fetch_test_result

counter=0
while [ -z "$TEST_RESULT" ]
do
  fetch_test_result

  counter=$((counter+1))
  if [ $counter -eq "60" ]
  then
    echo 'break - iam not waiting for tests any longer'
    break
  fi
done

# set -eu

cat test.log
echo -e "$TEST_RESULT"
echo "$TEST_RESULT" | grep -q "Success_${TEST_ID}"
