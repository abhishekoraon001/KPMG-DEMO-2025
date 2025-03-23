#!/bin/bash

# Variables
BUCKET_NAME=""
FILE_PATH="path/to/your/file.txt"
S3_PATH="s3://$BUCKET_NAME/your-destination-path/file.txt"

# Check if the file exists
if [ -f "$FILE_PATH" ]; then
    # Upload the file to S3
    aws s3 cp "$FILE_PATH" "$S3_PATH"
    echo "File uploaded to $S3_PATH"
else
    echo "File not found: $FILE_PATH"
fi