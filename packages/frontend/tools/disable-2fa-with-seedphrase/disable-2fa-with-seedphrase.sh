#/bin/bash 
for i in "$@"; do
  case $i in
    --accountId=*)
      ACCOUNTID="${i#*=}"
      shift
      ;;
    --seedPhrase=*)
      SEEDPHRASE="${i#*=}"
      shift
      ;;
  esac
done

if [ -z "$SEEDPHRASE" ] || [ -z "$ACCOUNTID" ]
then
      echo "Both accountId and seedphrase are required"
      exit 1
fi

near generate-key $ACCOUNTID --seedPhrase="$SEEDPHRASE"
curl "https://raw.githubusercontent.com/near/near-wallet/master/packages/frontend/src/wasm/main.wasm" --output ./main.wasm
near deploy --accountId $ACCOUNTID --wasmFile main.wasm
rm -rf main.wasm