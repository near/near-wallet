#!/usr/bin/env bash

# The wallet app's environment variables can only be configured at build time due to Parcel being used to build the wallet, which means that passing 
#  environment variables to a Docker container running a wallet wouldn't do anything.
# Parcel *does* store environment variables in a '.env' file in the root of the project though, so when we launch a Wallet Docker image we a) write a .env
#  file with the environment variables we want the wallet to have and b) rebuild the Wallet as part of the Docker container startup
# This script does the first part - taking environment variables set in the shell environment and writing them to a .env file for Parcel

set -euo pipefail   # Bash "strict mode"
script_dirpath="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
project_root_dirpath="$(dirname "${script_dirpath}")"


# ==================================================================================================
#                                             Constants
# ==================================================================================================
# Parcel, which is used to build the project, will read this file at build time and 'process.env.SOMEVAR' calls
#  in the Javascript code will use the variables set in this file
OUTPUT_FILENAME=".env"

# Environment variables that will be set in the shell environment when the container is started, and which should be propagated
#  to the .env file for Parcel to use
ENVVARS_TO_STORE=(
    "CONTRACT_HELPER_URL_ENVVAR"
    "EXPLORER_URL_ENVVAR"
    "NODE_URL_ENVVAR"
    "REACT_APP_IS_MAINNET"
    "REACT_APP_NETWORK_ID"
    "REACT_APP_ACCOUNT_ID_SUFFIX"
    "REACT_APP_ACCESS_KEY_FUNDING_AMOUNT"
)

# ==================================================================================================
#                                             Main Logic
# ==================================================================================================
output_abs_filepath="${project_root_dirpath}/${OUTPUT_FILENAME}"

for envvar in "${ENVVARS_TO_STORE[@]}"; do
    value="${!envvar}"
    if [ -z "${value}" ]; then
        # Safety guard to make sure someone running from the Docker image sets all the expected envvars
        echo "Error: Expected environment variable '${envvar}' to have a value, but none was passed in" >&2
        exit 1
    fi
    echo "${envvar}=\"${value}\"" >> "${output_abs_filepath}"
done
